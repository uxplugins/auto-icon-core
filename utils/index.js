const glob = require('glob-promise');
const { parse, stringify } = require('svgson')
async function getPackIcons(content) {
    return glob(content.files);
}
async function convertSvgToJson(svg) {
    const icon = await parse(svg);
    return stringify(icon)
}

module.exports = {
    getPackIcons,
    convertSvgToJson
};