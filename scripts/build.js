const fs = require("fs");
const path = require("path");

const package = require("../package.json");
const config = require("../config.json");

const raw = fs.readFileSync(path.join(__dirname, `../${package.main}`)).toString();

let build = raw.split("__PLUGIN_NAME__").join(config.name);
build = build.split("__PLUGIN_AUTHOR__").join(config.author);
build = build.split("__PLUGIN_DESCRIPTION__").join(config.description);
build = build.split("__PLUGIN_VERSION__").join(config.version);
build = build.split("__PLUGIN_AUTHORID__").join(config.authorId);
build = build.split("__PLUGIN_AUTHORLINK__").join(config.authorLink);
build = build.split("__PLUGIN_PAGE__").join(config.page);
build = build.split("__PLUGIN_RAW__").join(config.raw);

const pluginInfo = {
    version: config.version
}

build = build.split("__PLUGIN_INFO__").join(`${Buffer.from(JSON.stringify(pluginInfo)).toString("base64")}`);

if(!fs.existsSync(path.join(__dirname, `../build`))){
    fs.mkdirSync(path.join(__dirname, `../build`))
}

fs.writeFileSync(path.join(__dirname, `../build/${package.main}`), build)