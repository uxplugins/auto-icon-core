const glob = require('glob-promise');
async function getPackIcons(content) {
    return glob(content.files);
}

module.exports = {
    getPackIcons
};