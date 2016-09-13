#!/usr/bin/env node
"use strict";

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _handlebarsToHtml = require("./handlebars-to-html");

var _handlebarsToHtml2 = _interopRequireDefault(_handlebarsToHtml);

var _package = require("../package.json");

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = _commander2.default.command("handlebars-to-html");

program.version(_package2.default.version).usage("-t <path> -T <pattern> -p [path] -P [pattern] -d <directory>").description("Write handlebars templates to a directory as static html.").option("-d, --directory <path>", "output directory").option("-P, --partial-directory <path>", "directory to prepend to pattern").option("-p, --partial-pattern <pattern>", "glob pattern to match partial files").option("-T, --template-directory <path>", "directory to prepend to pattern").option("-t, --template-pattern <path>", "glob pattern to match template files in template path").option("-v, --verbose", "output more information to console").parse(process.argv);

if (program.verbose) {
    process.env.debug = true;
}

if (program.partialDirectory && program.partialPattern) {
    _handlebarsToHtml2.default.registerPartials(program.partialDirectory, program.partialPattern);
} else if (program.partialDirectory && !program.partialPattern) {
    console.error('  Supplied partial directory with no pattern');
} else if (!program.partialDirectory && program.partialPattern) {
    console.error('  Supplied partial patern with no directory');
}

if (program.templateDirectory && program.templatePattern && program.directory) {
    _handlebarsToHtml2.default.writeTemplates(program.templateDirectory, program.templatePattern, program.directory);
} else {
    console.error('  Missing required argument');
    program.help();
}