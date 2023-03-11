const { series, parallel, src, dest } = require("gulp");
const fsx = require("fs-extra");
const fs = require("fs").promises;
const path = require("path");
const camelCase = require("camelcase");
const { REACT_DIR } = require("../../paths");
//const { packs } = require('../../../auto-icon-assets/assets');
const { optimizeSvg } = require("../../utils.js/svgo");
const { getPackIcons } = require("../../utils.js/index.js");
var babel = require("gulp-babel");
var log = require("fancy-log");
const ASSETS_DIR = "./../auto_icon_svg-png";
const EXPORT_DIR = "./exports/jsonassets";
const useSVG = false;

// if true only get 6 items
const compact = false;
const freePacks = [
  "Bootstrap Icons",
  "BoxIcons",
  "BPMN",
  "Brandico Font",
  "Carbon",
  "Clarity",
  "CoreUI Free",
  "css.gg",
  "Elusive Icons",
  "Feather Icon",
  "Font Awesome 4",
  "Foundation",
  "IonIcons",
  "Material Design Iconic Font",
  "Simple Icons",
  "Weather Icons",
  "WebHostingHub Glyphs",
  "Kidogo Icons",
  "SWM Icon Pack",
];

const Categories = [
  {
    name: "New",
    id: 0,
    packs: [
      "Coco icon pack",
      "Hicon",
      "Iconsax",
      "Kidogo Icons",
      "Scarlab Icons",
      "SWM Icon Pack",
    ],
  },
  {
    name: "Popular",
    id: 1,
    packs: [
      "Ant Design Icons",
      "Bootstrap Icons",
      "BoxIcons",
      "Entypo+",
      "Feather Icon",
      "Feather Icons",
      "Fluent UI System Icons",
      "Font Awesome 4",
      "Font Awesome 5 Solid",
      "Google Material Icons",
      "Line Awesome",
      "Material Design Icons",
      "Material Design Light",
      "Metro ui",
      "Phosphor",
      "Teenyicons",
      "Unicons",
      "css.gg",
      "icofont",
    ],
  },
  {
    name: "Social & Brands",
    packs: [
      "Brandico Font",
      "CoreUI Brands",
      "Devicons",
      "Entypo+ Social",
      "File Icons",
      "Font Awesome 5 Brands",
      "SVG Logos",
      "Simple Icons",
      "SuperTinyIcons",
      "VSCode Icons",
      "Vector logos Zone",
      "svgporn",
    ],
    id: 2,
  },
  { name: "General", id: 99, packs: [] },
];

const generateJsonAssets = async (cb) => {
  fsx.ensureDirSync(EXPORT_DIR);
  let packs = fsx
    .readdirSync(ASSETS_DIR, { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        dirent.name != ".git" &&
        dirent.name !== "rrze-icon-set (tango)"
    )
    .map((p, index) => {
      let data = fsx.readFileSync(
        path.join(ASSETS_DIR, p.name, "info.json"),
        "utf8"
      );
      data = JSON.parse(data);
      if(!data.license || !data.license.url || !data.author || !data.author.url) console.log('Invalid Pack ', data.name); 
      data.category = getCategory(data);
      // to fix names and titles problems
      //   data.name= p.name;
      //   fsx.writeFileSync(  path.join(ASSETS_DIR, p.name, "info.json"), JSON.stringify(data))
      if (freePacks.indexOf(data.name) > -1)
        return { ...data, id: index, isFree: true };
      return { ...data, id: UUID() };
    });
  fsx.writeFileSync(
    path.join(EXPORT_DIR, "all packs.json"),
    JSON.stringify(
      packs
        .map((n) => n.name)
        .sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
        })
    )
  );
  for (const pack of packs) {
    let files = await getPackIcons(path.join(ASSETS_DIR, pack.name, "icons"));
    pack.count = files.length;
    if (compact) files = files.slice(0, 6);
    pack.items = files.map((t) => {
      let iconName = path.basename(t, path.extname(t));
      //  return {id: `${pack.name}/icons/${iconName}`, name: iconName, packId: pack.name}
      // if(!useSVG) return {name: iconName, packId: pack.name}
      if (!useSVG) return { n: iconName };
      else {
        const contents = fsx.readFileSync(t, { encoding: "base64" });
        return { name: iconName, packId: pack.name, svg: contents };
      }
    });

    log("Exported React " + pack.name);
  }
  fsx.writeFileSync(
    path.join(EXPORT_DIR, "data.json"),
    JSON.stringify(packs, null, 0)
  );

  // if (packs) {
  //     for (const pack of packs) {
  //         await exportPack(pack);
  //         const filesToMove = [
  //             './tasks/react/packBase/**/*',
  //         ];
  //         src(filesToMove, { base: './tasks/react/packBase' })
  //             .pipe(dest(path.join(REACT_DIR, pack.id)));

  //         log('Exported React ' + pack.name);
  //     }
  // } else {
  //     throw new Error('No Asset Folder Found')
  // }
  cb();
};
function UUID() {
  function s(n) {
    return h((Math.random() * (1 << (n << 2))) ^ Date.now()).slice(-n);
  }
  function h(n) {
    return (n | 0).toString(16);
  }
  return [
    s(4) + s(4),
    s(4),
    "4" + s(3), // UUID version 4
    h(8 | (Math.random() * 4)) + s(3), // {8|9|A|B}xxx
    // s(4) + s(4) + s(4),
    Date.now().toString(16).slice(-10) + s(2), // Use timestamp to avoid collisions
  ].join("-");
}

function getCategory(data) {
  const name = data.name;
  for (i = 0; i < Categories.length; i++) {
    if (Categories[i].packs.findIndex((c) => c == name)>-1) return Categories[i].name;
  }
  return "General";
}

exports.generateJsonAssets = series(generateJsonAssets);
//exports.buildReact = series( transformJSX);
