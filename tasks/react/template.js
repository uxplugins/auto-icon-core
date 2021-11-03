const template = (icon, formattedName, type = "module", addPreImports) => {
    icon = icon.replace('<svg ', '<svg {...props} fill="currentColor" ')
    switch (type) {
        case "module":
            return (
                (addPreImports ? `import React from "react";\n` : "") +
                `export function ${formattedName} (props) {\n` +
                `  return ${icon}\n` +
                `};\n`
            );
        case "common":
            return (
                `module.exports.${formattedName} = function ${formattedName} (props) {\n` +
                `  return ${icon}\n` +
                `};\n`
            );
        case "dts":
            return `export declare const ${formattedName}: IconType;\n`;
    }
}

module.exports = template;