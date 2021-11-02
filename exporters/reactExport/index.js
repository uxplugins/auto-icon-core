const { getPackIcons, convertSvgToJson } = require("../../utils")
const path = require("path");
const fs = require("fs").promises;
const camelCase = require("camelcase");
const fsx = require('fs-extra');
const {  optimizeSvg } = require("../../utils/svgo");
module.exports = reactExport = async (pack, exportPath) => {
    const exists = new Set();
    for (const content of pack.contents) {
        const files = await getPackIcons(content);
        for (const file of files) {
            const svgStrRaw = await fs.readFile(file, "utf8");
            const svgStr = optimizeSvg(svgStrRaw);
            //const svgStr = svgStrRaw;
            const iconData = await convertSvgToJson(svgStr);

            const rawName = path.basename(file, path.extname(file));
            const pascalName = camelCase(rawName, { pascalCase: true });
            const name =
                (content.formatter && content.formatter(pascalName, file)) ||
                pascalName;
            if (exists.has(name)) continue;
            exists.add(name);

            // // write like: module/fa/index.esm.js
            // const modRes = iconRowTemplate(icon, name, iconData, "module");
            // await fs.appendFile(
            //     path.resolve(DIST, icon.id, "index.esm.js"),
            //     modRes,
            //     "utf8"
            // );
            const comRes = template(iconData, name, "module");
            fsx.ensureDirSync(path.join(exportPath, pack.id));
            await fs.appendFile(
                path.resolve(exportPath, pack.id, "index.js"),
                comRes,
                "utf8"
            );
            // const dtsRes = iconRowTemplate(icon, name, iconData, "dts");
            // await fs.appendFile(
            //     path.resolve(DIST, icon.id, "index.d.ts"),
            //     dtsRes,
            //     "utf8"
            // );

            exists.add(file);
        }
    }
}
const template = (icon, formattedName, type = "module") => {
    icon = icon.replace('<svg ', '<svg {...props} fill="currentColor" ')
    switch (type) {
        case "module":
            return (
                `export function ${formattedName} (props) {\n` +
                `  return ${icon}\n` +
                `};\n`
            );
        case "common":
            return (
                `module.exports.${formattedName} = function ${formattedName} (props) {\n` +
                `  return GenIcon(${JSON.stringify(iconData)})(props);\n` +
                `};\n`
            );
        case "dts":
            return `export declare const ${formattedName}: IconType;\n`;
    }
}