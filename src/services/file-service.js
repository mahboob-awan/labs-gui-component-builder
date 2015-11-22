/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 */

var fs = require("fs");
var nodePath = require("path");
var assert = require("../utils/argument-assertion-util.js");

exports.isFile = function (file) {

    return fs.existsSync(file) && fs.lstatSync(file).isFile();

};

exports.directoryExists = function log(directory) {

    return fs.existsSync(directory) && fs.lstatSync(directory).isDirectory();

};

exports.readFile = function (file) {

    console.log("Will now read \"" + file + "\".");

    assert.isString(file, "file");

    if (!exports.isFile(file)) {
        throw new Error("\"" + file + "\" is not a file.")
    }

    if (fs.existsSync(file)) {

        var data = fs.readFileSync(file, "UTF-8");

        console.log("Read \"" + Buffer.byteLength(data, "UTF-8") + "\" bytes from the file \"" + file + "\".");

        return data;

    } else {

        throw new Error("Could not find the file \"" + file + "\".");

    }

};

exports.join = function log() {

    return nodePath.join.apply(null, arguments);

};

exports.getAllItemsInDirectory = function (directory) {

    if (!exports.directoryExists(directory)) {
        throw new Error("The directory \"" + directory + "\" does not exist.");
    }

    var items = fs.readdirSync(directory);

    return items;

};

exports.getAllFilesInDirectory = function (directory) {

    var files = [];

    var items = exports.getAllItemsInDirectory(directory);

    for (var i in items) {

        var item = items[i];

        if (exports.isFile(directory + nodePath.sep + item)) {
            files.push(item);
        }

    }

    return files;

};

exports.isDirectory = function (directory) {

    return fs.existsSync(directory) && fs.lstatSync(directory).isDirectory();

};

exports.getAllDirectories = function (directory) {

    var directories = [];

    var items = exports.getAllItemsInDirectory(directory);

    for (var i in items) {

        var item = items[i];

        if (exports.isDirectory(nodePath.join(directory, item))) {
            directories.push(item);
        }

    }

    return directories;

};

exports.writeFile = function (file, contents) {

    assert.isString(contents, "contents");

    fs.writeFileSync(file, contents);

    console.log("Wrote \"" + Buffer.byteLength(contents, "UTF-8") + "\" bytes to the file \"" + file + "\".");

};