const path = require("path");
module.exports = {
    packs: [
        {
            id: "im",
            name: "Ico Moon",
            contents: [{
                files: path.resolve(__dirname, "icomoon-free/SVG/*.svg"),
                formatter: (name) => `Im${name.slice(3)}`,
            }],
            projectUrl: "",
            license: "",
            licenseUrl: "",
        }, 
        {
            id: "si",
            name: "Simple Icons",
            contents: [
              {
                files: path.resolve(__dirname, "simple-icons/icons/*.svg"),
                formatter: (name) => `Si${name}`,
              },
            ],
            projectUrl: "https://simpleicons.org/",
            license: "CC0 1.0 Universal",
            licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
          },
    ]
}