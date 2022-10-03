const { series } = require('gulp');
const { cleanExportFolder, generatePackagesManifest } = require('./tasks/general');
const { generateJsonAssets } = require('./tasks/jsonasset');
const { buildRawJson } = require('./tasks/rawjson');
const { buildReact } = require('./tasks/react');


exports.default = series(
  //  cleanExportFolder,
 //   generatePackagesManifest,
 //  buildReact,
 // buildRawJson,
 generateJsonAssets
);
