const fsx = require('fs-extra');
const { EXPORT_DIR } = require('../../paths');
const cleanExportFolder = (cb) => {
    fsx.ensureDirSync(EXPORT_DIR);
    fsx.emptyDirSync(EXPORT_DIR);
    cb();
}
module.exports = {cleanExportFolder}