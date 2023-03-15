const template = (icon, multiColor, formattedName, type = "module", addPreImports) => {

    icon = icon.replace('<svg ', `<svg {...props} color={${!multiColor && ""}} stroke={${!multiColor && ""}} width={props.width || 48} fill="currentColor"  `)
        .replace("color={}", "").replace('color=""', "").replace("stroke={}", "").replace('stroke=""', "")

    switch (type) {
        case "esm":
            return (
                (addPreImports ? `import React from "react";\n` : "") +
                `export function ${formattedName} (props) {\n` +
                `  return ${icon}\n` +
                `};\n`
            )
        case "module":
            return (
                (addPreImports ? `var React = require("react");\n` : "") +
                `module.exports.${formattedName} = function ${formattedName} (props) {\n` +
                `  return ${icon}\n` +
                `};\n`
            )
        case "dts":
            return (
                (addPreImports ? `import { IconType } from "../iconBase";\n` : "") +
                `export declare const ${formattedName}: IconType;\n`
            )
    }
}

module.exports = template