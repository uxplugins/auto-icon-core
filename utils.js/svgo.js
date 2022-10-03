const svgo = require("svgo");
const svgoConfig = {
  plugins: [
    {
      name: 'cleanupAttrs',
      active: true
    },
    {
      name: 'removeDoctype',
      active: true,
    },
    {
      name: 'removeXMLProcInst',
      active: true,
    },
    {
      name: 'removeXMLNS',
      active: true
    },
    {
      name: 'removeComments',
      active: true,
    },
    {
      name: 'removeMetadata',
      active: true,
    },
    {
      name: 'removeTitle',
      active: true,
    },
    {
      name: 'removeDesc',
      active: true,
    },
    {
      name: 'removeUselessDefs',
      active: true,
    },
    {
      name: 'removeEditorsNSData',
      active: true,
    },
    {
      name: 'removeEmptyAttrs',
      active: true,
    },
    {
      name: 'removeHiddenElems',
      active: true,
    },
    {
      name: 'removeEmptyText',
      active: true,
    },
    {
      name: 'removeEmptyContainers',
      active: true,
    },
    {
      name: 'removeViewBox',
      active: false,
    },
    {
      name: 'cleanupEnableBackground',
      active: true,
    },
   
    {
      name: 'convertPathData',
      active: true,
    },
    {
      name: 'convertTransform',
      active: true,
    },
    {
      name: 'removeUnknownsAndDefaults',
      active: true,
    },
    {
      name: 'removeNonInheritableGroupAttrs',
      active: true,
    },
    {
      name: 'removeUselessStrokeAndFill',
      active: true,
    },
    {
      name: 'removeUnusedNS',
      active: true,
    },
    {
      name: 'cleanupIDs',
      active: true,
    },
    {
      name: 'cleanupNumericValues',
      active: true,
    },
    {
      name: 'moveElemsAttrsToGroup',
      active: true,
    },
    {
      name: 'moveGroupAttrsToElems',
      active: true,
    },
    {
      name: 'collapseGroups',
      active: true,
    },
    {
      name: 'removeRasterImages',
      active: false,
    },
    {
      name: 'mergePaths',
      active: true,
    },
    {
      name: 'convertShapeToPath',
      active: true,
    },
    {
      name: 'sortAttrs',
      active: true,
    },
    {
      name: 'removeDimensions',
      active: true,
    },
    {
      name: 'removeAttributesBySelector',
      params: {
        selector: "*:not(svg)",
        attributes: ["stroke"],
      },
      active: true
    },
    {
      name: 'removeAttrs',
      params: { attrs: ["data.*",'*:(stroke|fill):((?!^none$).)*', "svg:fill", "svg:xml.*"] },
      active:true
    },
    {
      name: 'inlineStyles',
      params: { 
        onlyMatchedOnce: false,
       },
      active:true
    },
    {
      name: 'convertStyleToAttrs',
      active: true,
    },
    // {
    //   name: 'removeStyleElement',
    //   active: true,
    // },
    {
      name: 'removeScriptElement',
      active: true,
    },
    

    // {
    //   name: 'convertColors',
    //   params: { currentColor: true },
    //   active:true
    // },
  ],
};

const optimizeSvg = (svgStrRaw) => {
  return svgo.optimize(svgStrRaw, svgoConfig).data.replace(/xlink:href/ig,"xlinkHref").replace(/xml:space/ig,"xmlSpace");
}
module.exports = {
  optimizeSvg
};


