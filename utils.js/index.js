const glob = require('glob-promise');
async function getPackIcons(iconsPath) {
    return glob(iconsPath+"/*.svg");
}

module.exports = {
    getPackIcons
};