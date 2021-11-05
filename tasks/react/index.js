const { series, parallel, src, dest } = require('gulp');
const fsx = require('fs-extra');
const fs = require("fs").promises;
const path = require('path');
const camelCase = require("camelcase");
const { REACT_DIR } = require('../../paths');
const { packs } = require('../../../auto-icon-assets/assets');
const { optimizeSvg } = require('../../utils.js/svgo');
const { getPackIcons } = require('../../utils.js');
const template = require('./template');
var babel = require('gulp-babel');
var log = require('fancy-log');
const copyBaseReactProject = (cb) => {
    fsx.ensureDirSync(REACT_DIR);
    const filesToMove = [
        './tasks/react/base/**/*',
    ];
    src(filesToMove, { base: './tasks/react/base' })
        .pipe(dest(REACT_DIR));
    cb();

}
const generateReactComponents = async (cb) => {
    if(packs){
        for (const pack of packs) {
            await exportPack(pack);
            const filesToMove = [
                './tasks/react/packBase/**/*',
            ];
            src(filesToMove, { base: './tasks/react/packBase' })
                .pipe(dest(path.join(REACT_DIR, pack.id)));
    
            log('Exported React '+ pack.name);
        }
    } else{
        throw new Error('No Asset Folder Found')
    }
    cb();
}
const exportPack = async (pack) => {
    const exists = new Set();
    for (const content of pack.contents) {
        const files = await getPackIcons(content);
        for (const file of files) {
            const svgStrRaw = await fs.readFile(file, "utf8");
            const svgStr = optimizeSvg(svgStrRaw);
            const rawName = path.basename(file, path.extname(file));
            const pascalName = camelCase(rawName, { pascalCase: true });
            const name =
                (content.formatter && content.formatter(pascalName, file)) ||
                pascalName;
            if (exists.has(name)) continue;
            exists.add(name);
            const comRes = template(svgStr, name, "module", exists.size == 1);
            fsx.ensureDirSync(path.join(REACT_DIR, pack.id));
            await fs.appendFile(
                path.resolve(REACT_DIR, pack.id, "index.js"),
                comRes,
                "utf8"
            );

            const dtsRes = template(svgStr, name, "dts", exists.size == 1);
            await fs.appendFile(
                path.resolve(REACT_DIR, pack.id, "index.d.ts"),
                dtsRes,
                "utf8"
            );

            const modRes = template(svgStr, name, "esm", exists.size == 1);
            await fs.appendFile(
                path.resolve(REACT_DIR, pack.id, "index.esm.js"),
                modRes,
                "utf8"
            );

            exists.add(file);
        }
    }
}

const transformJSX = () => {
    return src('./exports/react/**/*.js', { base: './exports/react/' }).
        pipe(babel({
            plugins: ['transform-react-jsx']
        }))
        .pipe(dest("./exports/react"));
}

exports.buildReact = series(copyBaseReactProject, generateReactComponents, transformJSX);