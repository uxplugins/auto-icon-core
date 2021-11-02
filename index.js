const { packs } = require('./assets/index');
const fsx = require('fs-extra');
const performance = require("perf_hooks").performance;
const path = require("path");
const reactExport = require('./exporters/reactExport');
const _rootDir = path.resolve(__dirname);
const _exportDir = path.join(_rootDir, "./npm-exports")
async function task(name, fn) {
    const start = performance.now();
    console.log(`================= ${name} =================`);
    await fn();
    const end = performance.now();
    console.log(`${name}: `, Math.floor(end - start) / 1000, "sec\n\n");
}

async function run() {
    await task("initialize Export Dir", () => {
        fsx.ensureDirSync(_exportDir);
        fsx.emptyDirSync(_exportDir);
    });
    await task("write npm packs", async () => {
        for (const pack of packs) {
            fsx.ensureDirSync(path.join(_exportDir, "react-package"));
            await reactExport(pack, path.join(_exportDir, "react-package"));
        }
    });
}


run();