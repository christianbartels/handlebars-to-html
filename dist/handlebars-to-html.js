"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _handlebars = require("handlebars");

var _handlebars2 = _interopRequireDefault(_handlebars);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fileContents(file) {
    return _fs2.default.readFileSync(file).toString();
}

function files(directory, pattern) {
    var files = _glob2.default.sync(_path2.default.join(directory, pattern));

    if (process.env.debug) {
        console.log("Files for " + pattern, files);
    }

    return files;
}

function isDirectory(directory) {
    if (!_fs2.default.existsSync(directory) || !_fs2.default.statSync(directory).isDirectory()) {
        return false;
    }
    return true;
}

function relativePath(file, directory) {
    var extension = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

    return file.replace(directory, "").replace(_path2.default.extname(file), extension);
}

function templatePath(file, directory) {
    var extension = arguments.length <= 2 || arguments[2] === undefined ? ".html" : arguments[2];

    return relativePath(file, directory, extension);
}

function partialName(file, directory) {
    return relativePath(file, directory);
}

/**
 * Register partials for use inside your templates.
 * @param {string} directory - Directory path to use as the base of the search pattern.
 * @param {string} pattern - Glob pattern to match files on inside of the search directory.
 */
function registerPartials(directory, pattern) {
    if (!isDirectory(directory)) {
        throw Error(directory + " is not a directory");
    }

    directory = _path2.default.normalize("" + directory + _path2.default.sep);

    files(directory, pattern).forEach(function (file) {
        var source = fileContents(file),
            name = partialName(file, directory);

        _handlebars2.default.registerPartial(name, source);

        if (process.env.debug) {
            console.log("Partial registered with name", name);
        }
    });
}

/**
 * Write templates to an output directory.
 * @param {string} directory - Directory path to use as the base of the search pattern.
 * @param {string} pattern - Glob pattern to match files on inside of the search directory.
 * @param {string} outDirectory - Directory where templates will be written as HTML.
 */
function writeTemplates(directory, pattern, outDirectory) {
    if (!isDirectory(directory)) {
        throw Error(directory + " is not a directory");
    }

    directory = _path2.default.normalize("" + directory + _path2.default.sep);
    outDirectory = _path2.default.normalize("" + outDirectory + _path2.default.sep);

    files(directory, pattern).forEach(function (file) {
        var source = fileContents(file),
            template = _handlebars2.default.compile(source),
            name = templatePath(file, directory),
            out = _path2.default.join(outDirectory, name);

        _mkdirp2.default.sync(_path2.default.dirname(out));
        _fs2.default.writeFileSync(out, template());

        if (process.env.debug) {
            console.log("Template written to", out);
        }
    });
}

exports.default = { registerPartials: registerPartials, writeTemplates: writeTemplates };