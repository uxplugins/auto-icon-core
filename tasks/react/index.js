const { series, parallel, src, dest } = require('gulp');
const fsx = require('fs-extra');
const fs = require("fs").promises;
const path = require('path');
const camelCase = require("camelcase");
const { REACT_DIR } = require('../../paths');
const { packs } = require('./../../assets');
const { optimizeSvg } = require('../../utils.js/svgo');
const { getPackIcons } = require('../../utils.js');
const template = require('./template');
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
    for (const pack of packs) {
        await exportPack(pack);
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

exports.buildReact = series(copyBaseReactProject, generateReactComponents);