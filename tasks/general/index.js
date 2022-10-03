const fsx = require('fs-extra');
const path = require('path');
const { EXPORT_DIR } = require('../../paths');
const ReactAssetsSource = "./tasks/react/base";
const ASSETS_DIR = "./../auto_icon_svg-png";
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
module.exports = { cleanExportFolder,generatePackagesManifest }