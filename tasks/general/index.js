const fsx = require('fs-extra');
const path = require('path');
const { EXPORT_DIR } = require('../../paths');
const ReactAssetsSource = "./tasks/react/base";
const ASSETS_DIR = "./../New Icons";
const glob = require('glob-promise');
const cleanExportFolder = (cb) => {
    fsx.ensureDirSync(EXPORT_DIR);
    fsx.emptyDirSync(EXPORT_DIR);
    cb();
}

const generatePackagesManifest = (cb) => {





    const packs = fsx.readdirSync(ASSETS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name != ".git" && dirent.name!== "rrze-icon-set (tango)" )
        .map(p => {
            let data = fsx.readFileSync(path.join(ASSETS_DIR, p.name, "info.json"), "utf8");
            data = JSON.parse(data);
            return { ...data, iconsPath: path.join(ASSETS_DIR, p.name, "icons") };
        })
    
    
    //TODO add typescript here
    fsx.writeFileSync(path.join(ReactAssetsSource, "packs.esm.js"), `export var Packs =${JSON.stringify(packs, null, 2)}`);
    fsx.writeFileSync(path.join(ReactAssetsSource, "packs.js"), `module.exports.Packs =${JSON.stringify(packs, null, 2)}`);
   
    cb()
}

const checkMiss = async (cb) => {
    const svgs = await (await glob(ASSETS_DIR+"/*/icons/*.svg")).map(t=>t.replace('.svg', ''));
    const pngs =   await (await glob(ASSETS_DIR+"/*/icons/*.png")).map(t=>t.replace('.png', ''));;
    console.log([
          ...svgs.filter(d => !pngs.includes(d)),
        ...pngs.filter(d => !svgs.includes(d))
     ]);
    cb();
}
module.exports = { cleanExportFolder,generatePackagesManifest, checkMiss }