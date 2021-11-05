const glob = require('glob-promise');
async function getPackIcons(content) {
    return typeof content.files === "string"
    ? glob(content.files)
    : content.files();
}

module.exports = {
    getPackIcons
};