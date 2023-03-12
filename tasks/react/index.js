const { series, parallel, src, dest } = require('gulp');
const fsx = require('fs-extra');
const fs = require("fs").promises;
const path = require('path');
const camelCase = require("camelcase");
const { REACT_DIR } = require('../../paths');
//const { packs } = require('../../../auto-icon-assets/assets');
const { optimizeSvg } = require('../../utils.js/svgo');
const { getPackIcons } = require('../../utils.js');
const template = require('./template');
var babel = require('gulp-babel');
var log = require('fancy-log');
const ASSETS_DIR = "./../auto_icon_svg-png";

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
    const packs = fsx.readdirSync(ASSETS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name != ".git" && dirent.name!== "rrze-icon-set (tango)"
        && dirent.name === 'Eva Icons'
        )
        .map(p => {
            let data = fsx.readFileSync(path.join(ASSETS_DIR, p.name, "info.json"), "utf8");
            data = JSON.parse(data);
            return { ...data, iconsPath: path.join(ASSETS_DIR, p.name, "icons") };
        })
    for (const pack of packs) {
        await exportPack(pack);
        const filesToMove = [
            './tasks/react/packBase/**/*',
        ];
        src(filesToMove, { base: './tasks/react/packBase' })
            .pipe(dest(path.join(REACT_DIR, pack.name)));

        log('Exported React ' + pack.name);
    }

    // if (packs) {
    //     for (const pack of packs) {
    //         await exportPack(pack);
    //         const filesToMove = [
    //             './tasks/react/packBase/**/*',
    //         ];
    //         src(filesToMove, { base: './tasks/react/packBase' })
    //             .pipe(dest(path.join(REACT_DIR, pack.id)));

    //         log('Exported React ' + pack.name);
    //     }
    // } else {
    //     throw new Error('No Asset Folder Found')
    // }
    cb();
}
const exportPack = async (pack) => {
    const exists = new Set();
    const files = await getPackIcons(pack.iconsPath);

    for (const file of files) {
        const svgStrRaw = await fs.readFile(file, "utf8");

        const svgStr = optimizeSvg(svgStrRaw);
        const rawName = path.basename(file, path.extname(file));
        let pascalName = camelCase(rawName, { pascalCase: true });
        // pascalName = pascalName.replace(/[\W_]+/g,"");
        pascalName = pascalName.replace(/[^0-9a-zA-Z]/g, '')
        if (pascalName.match(/^\d/) || pascalName == "React" || pascalName.match(/\u200C/g) || pascalName === '') {
            console.log('matched ' + pascalName);
            var matches = pack.name.match(/\b(\w)/g); // ['J','S','O','N']
            var acronym = matches.join('');
            if (pascalName === '')
                pascalName = camelCase(acronym + Math.random(), {pascalCase: true}) + pascalName
            else
                pascalName = camelCase(acronym, {pascalCase: true}) + pascalName
            pascalName = pascalName.replace(/\u200C/g, '');
            console.log('changed to ' + pascalName)
        }
        const name = pascalName;
        if (exists.has(name)) continue;
        exists.add(name);
        const comRes = template(svgStr, name, "module", exists.size == 1);
        fsx.ensureDirSync(path.join(REACT_DIR, pack.name));
        await fs.appendFile(
            path.resolve(REACT_DIR, pack.name, "index.js"),
            comRes,
            "utf8"
        );

        const dtsRes = template(svgStr, name, "dts", exists.size == 1);
        await fs.appendFile(
            path.resolve(REACT_DIR, pack.name, "index.d.ts"),
            dtsRes,
            "utf8"
        );

        const modRes = template(svgStr, name, "esm", exists.size == 1);
        await fs.appendFile(
            path.resolve(REACT_DIR, pack.name, "index.esm.js"),
            modRes,
            "utf8"
        );

        exists.add(file);
    }

}

const transformJSX = () => {
    return src('../iconsea_react/**/*.js', { base: '../iconsea_react' }).
        pipe(babel({
            plugins: ['transform-react-jsx']
        }))
        .pipe(dest("../iconsea_react"));
}

exports.buildReact = series(
    copyBaseReactProject,
 generateReactComponents,
      transformJSX);
//exports.buildReact = series( transformJSX);