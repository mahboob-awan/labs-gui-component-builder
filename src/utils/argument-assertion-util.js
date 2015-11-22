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

/*
 * Private
 */

function shouldBe(o, typeName, name) {

    var type = (typeof o);

    if (typeof o !== typeName) {
        throw new Error(name + " is not a \"" + typeName + "\" but a \"" + type + "\".");
    }

}

/*
 * Public functions
 */

exports.isObject = function (o, name) {

    if (o === undefined) {
        throw new Error(name + " is undefined.");
    }

    shouldBe(o, "object", name);

};

exports.isArray = function isArray(object, objectName) {

    exports.isObject(object, objectName);

    var type = Object.prototype.toString.call(object);

    if (type !== "[object Array]") {
        throw new Error(objectName + " is not an array but a \"" + type + "\".");
    }

};

exports.isString = function (s, name) {

    if (s === undefined) {
        throw new Error(name + " is undefined.");
    }

    shouldBe(s, "string", name);

};

exports.isFunction = function (f, name) {

    if (f === undefined) {
        throw new Error(name + " is undefined.");
    }

    shouldBe(f, "function", name);

};

exports.expect = function (object, objectName) {

    function getObjectName() {

        return objectName ? objectName : "An argument";

    }

    function toBeType(expectedType) {

        var isSameType = object instanceof expectedType;

        if (!isSameType) {
            throw new Error(getObjectName() + " is not the expected type \"" + expectedType.name + "\".");
        }

    }

    function toBeAnArray() {

        exports.isObject(object, objectName);

        var type = Object.prototype.toString.call(object);

        if (type !== "[object Array]") {
            throw new Error(getObjectName() + " is not an array but a \"" + type + "\".");
        }

    }

    return {
        toBeType: toBeType,
        toBeAnArray: toBeAnArray
    }

};