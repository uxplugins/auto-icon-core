const { series } = require('gulp');
const { cleanExportFolder } = require('./tasks/general');
const { buildReact } = require('./tasks/react');


exports.default = series(
    cleanExportFolder,
    buildReact
);
