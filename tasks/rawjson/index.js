const { series, parallel, src, dest } = require('gulp');
const fsx = require('fs-extra');
const fs = require("fs").promises;
const path = require('path');
const camelCase = require("camelcase");
const { REACT_DIR } = require('../../paths');
//const { packs } = require('../../../auto-icon-assets/assets');
const { optimizeSvg } = require('../../utils.js/svgo');
const { getPackIcons } = require('../../utils.js');
var babel = require('gulp-babel');
var log = require('fancy-log');
const ASSETS_DIR = "./../auto_icon_svg-png";
const EXPORT_DIR = "./exports/rawjson";
const generateJson = async (cb) => {
    fsx.ensureDirSync(EXPORT_DIR);
    let packs = fsx.readdirSync(ASSETS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name != ".git" && dirent.name!== "rrze-icon-set (tango)" )
        .map(p => {
            let data = fsx.readFileSync(path.join(ASSETS_DIR, p.name, "info.json"), "utf8");
            data = JSON.parse(data);
            return { ...data, iconsPath: path.join(ASSETS_DIR, p.name, "icons") };
        });
    packs  = getMultipleRandom(packs, 10);
    let items = [];
    for (const pack of packs) {
        const files = await getPackIcons(pack.iconsPath);
        items = [...items, ...files.map(t=>{
            let iconName =  path.basename(t, path.extname(t));
            return {id: `${pack.name}/icons/${iconName}`, name: iconName, packId: pack.name}
        })]
        log(items);
        log('Exported React ' + pack.name);
    }
    fsx.writeFileSync(path.join(EXPORT_DIR, "data.json"), JSON.stringify(items));

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
function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
  
    return shuffled.slice(0, num);
  }




exports.buildRawJson = series(generateJson);
//exports.buildReact = series( transformJSX);