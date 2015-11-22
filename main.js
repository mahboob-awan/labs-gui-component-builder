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

var EOL = require("os").EOL;

var fileService = require("./src/services/file-service.js");
var lessService = require("./src/services/less-service.js");
var mustacheService = require("./src/services/mustache-service.js");

var componentsLib = "components/";

function getComponentData(componentDirectoryName) {

    var dataString = fileService.readFile(fileService.join(componentsLib, componentDirectoryName, componentDirectoryName + ".json"));
    var component = JSON.parse(dataString);

    // Add the base component CSS class
    component.class = componentDirectoryName;

    // Add the template
    var template = fileService.readFile(fileService.join(componentsLib, componentDirectoryName, componentDirectoryName + ".mustache"));
    //console.log("template", template);
    component.template = template;

    // Adding LESS source code
    var less = fileService.readFile(fileService.join(componentsLib, componentDirectoryName, componentDirectoryName + ".less"));
    console.log(less);
    component.less = less;

    // Return the component
    return component;

}


function buildTemplateWithClasses(component, theme, state) {
    return mustacheService.build(component.template, {
        classes: createClasses(component.class, theme, state)
    })
}

function createClasses(componentBaseClass, theme, state) {

    var classes = componentBaseClass;

    if (theme) {
        classes += " " + componentBaseClass + "-" + theme;
    }

    if (state) {
        classes += " " + componentBaseClass + "-" + state;
    }

    return classes;

}

function generateOverviewPage(components) {

    var html = "";

    html += "<!doctype html>";
    html += "<html lang=\"en\">";
    html += "<head>";
    html += "<meta charset=\"utf-8\">";
    html += "<title>overview</title>";
    html += "<link rel=\"stylesheet\" href=\"components.css\">";
    html += "<style>";
    html += "table td {";
    html += "padding: 10px;";
    html += "}";
    html += "</style>";
    html += "</head>";
    html += "<body>";

    components.forEach(function (component) {

        html += "<h1>" + component.label + "</h1>";
        html += "<p>" + component.description + "</p>";

        html += "<table border=\"1\">";
        html += "<thead>";
        html += "<tr>";
        html += "<th>theme / state</th>";
        html += "<th>default</th>";

        if (component.states) {
            component.states.forEach(function (state) {
                html += "<th>" + state + "</th>";
            });
        }

        html += "</tr>";
        html += "</thead>";


        html += "<tbody>";
        {

            // Default theme
            html += "<tr>";
            html += "<td>default</td>";
            {

                // Default theme
                html += "<td>" + buildTemplateWithClasses(component) + "</td>";

                // For all other states
                if (component.states) {
                    component.states.forEach(function (state) {
                        // Default state
                        html += "<td>" + buildTemplateWithClasses(component, undefined, state) + "</td>";
                    });
                }

            }
            html += "</tr>";

            // All other themes
            if (component.themes) {
                component.themes.forEach(function (theme) {

                    html += "<tr>";

                    html += "<td>" + theme + "</td>";

                    // Default state
                    html += "<td>" + buildTemplateWithClasses(component, theme) + "</td>";
                    if (component.states) {
                        component.states.forEach(function (state) {
                            html += "<td>" + buildTemplateWithClasses(component, theme, state) + "</td>";
                        });
                    }
                    html += "</tr>";

                });
            }

        }
        html += "</tbody>";
        html += "</table>";

    });

    html += "</body>";
    html += "</html>";

    fileService.writeFile("output/overview.html", html);

}


function main() {

    var timestarted = new Date().getTime();

    var files = fileService.getAllDirectories(componentsLib);


    var allLESS = "";
    var components = [];

    files.forEach(function (componentDirectoryName) {

        console.log("Found component folder \"" + componentDirectoryName + "\".");

        var component = getComponentData(componentDirectoryName);
        components.push(component);

        allLESS += component.less + EOL;

    });


    // Generate the overview page
    generateOverviewPage(components);


    fileService.writeFile("output/components.less", allLESS);

    lessService.build(allLESS).then(function (results) {
        fileService.writeFile("output/components.css", results.css);

        var buildDuration = new Date().getTime() - timestarted;
        console.log("Building complete after \"" + buildDuration + "\" milliseconds.");
        console.log("Have a great day! <(^_^)>");

    }, function (error) {
        console.log(error);
        throw new Error(error);
    });


}

main();


