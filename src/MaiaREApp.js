/**
 * @license
 * Copyright 2020 Roberto Luiz Souza Monteiro,
 *                Renata Souza Barreto,
 *                Hernane Borges de Barros Pereira.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * MaiaRE virtual machine.
 * @class
 */
function MaiaREApp() {
    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
        compiledCode = {
            'xml': '',
            'mil': '',
            'js': ''
        }
    }

    /**
     * Compiles MaiaRE code, contained in <script> tags for JavaScript
     * and inserts the compiled code in a new <script> tag in the <body> tag
     * of the document.
     * 
     * MaiaRE codes must be in <script> tags of type 'text/MaiaRE',
     * as in the following example:
     * 
     * <script type='text/MaiaRE'> ... </script>
     * 
     * This method must be called from the onLoad event of the document's
     * <body> tag, as in the following example:
     * 
     * <body onload='MaiaREApp.compile()'> ... </body>
     */
    this.compile = function() {
        var scripts = document.querySelectorAll('script[type="text/MaiaRE"]');
        for (index in scripts) {
            if (typeof scripts[index].getAttribute != 'undefined') {
                var fileName = scripts[index].getAttribute('src');
                if (typeof fileName != 'undefined') {
                    if (fileName) {
                        compiledCode.maia = '';
                        fetch(fileName)
                            .then(response => response.text())
                            .then(data => {
                                var code = data;
                                if (typeof code != 'undefined') {
                                    if (typeof code == 'string') {
                                        compiledCode.xml = '';

                                        function getXml(data) {
                                            compiledCode.xml += data;
                                        }
                                        var s = new EBNF.XmlSerializer(getXml, true);
                                        var languageParser = new EBNF(code, s);
                                        try {
                                            languageParser.parse_Grammar();
                                        } catch (pe) {
                                            if (!(pe instanceof languageParser.ParseException)) {
                                                throw pe;
                                            } else {
                                                var parserError = languageParser.getErrorMessage(pe);
                                                console.log(parserError);
                                                throw parserError;
                                            }
                                        }
                                        var parser = new DOMParser();
                                        var xml = parser.parseFromString(compiledCode.xml, 'text/xml');
                                        var compiler = new MaiaRECompiler();
                                        compiledCode.js = compiler.compile(xml);
                                        try {
                                            var script = document.createElement('script');
                                            script.type = 'text/javascript';
                                            script.text = compiledCode.js;
                                            document.body.appendChild(script);
                                        } catch (se) {
                                            var scriptError = se.message;
                                            console.log(scriptError);
                                            throw scriptError;
                                        }
                                    }
                                }
                            });
                    }
                }
            }
            var code = scripts[index].innerHTML;
            if (typeof code != 'undefined') {
                if (typeof code == 'string') {
                    compiledCode.xml = '';

                    function getXml(data) {
                        compiledCode.xml += data;
                    }
                    var s = new MaiaRE.XmlSerializer(getXml, true);
                    var languageParser = new MaiaRE(code, s);
                    try {
                        languageParser.parse_Grammar();
                    } catch (pe) {
                        if (!(pe instanceof languageParser.ParseException)) {
                            throw pe;
                        } else {
                            var parserError = languageParser.getErrorMessage(pe);
                            console.log(parserError);
                            throw parserError;
                        }
                    }
                    var parser = new DOMParser();
                    var xml = parser.parseFromString(compiledCode.xml, 'text/xml');
                    var compiler = new MaiaRECompiler();
                    compiledCode.js = compiler.compile(xml);
                    try {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.text = compiledCode.js;
                        document.body.appendChild(script);
                    } catch (se) {
                        var scriptError = se.message;
                        console.log(scriptError);
                        throw scriptError;
                    }
                }
            }
        }
    }

    /**
     * Compiles the MaiaRE code passed as a command line argument
     * and executes the code in the JavaScript interpreter from which
     * this method was invoked.
     */
    this.run = function() {
        // Supports only the Node.js interpreter.
        if (typeof process !== 'undefined') {
            var command = 'node';
            var argv = process.argv.slice();
            compiledCode.xml = '';
            var fs = require('fs');
            var readTextFile = fs.readFileSync;

            function getXml(data) {
                compiledCode.xml += data;
            }

            function read(input) {
                if (/^{.*}$/.test(input)) {
                    return input.substring(1, input.length - 1);
                } else {
                    var content = readTextFile(input, 'utf-8');
                    return content.length > 0 && content.charCodeAt(0) == 0xFEFF ? content.substring(1) : content;
                }
            }

            var justCompile = false;
            var inputFile;
            var outputFile;
            var outputFileType = 'js';
            var outputContents = '';
            if (argv.length > 2) {
                var i = 2;
                while (i < argv.length) {
                    if (argv[i] == '-c') {
                        justCompile = true;
                        outputFileType = 'js';
                    } else if (argv[i] == '-m') {
                        justCompile = true;
                        outputFileType = 'mil';
                    } else if (argv[i] == '-x') {
                        justCompile = true;
                        outputFileType = 'xml';
                    } else if ((argv[i] == '-h') || (argv[i] == '--help')) {
                        console.log('MaiaRE Command Line Interface (CLI)');
                        console.log('Usage: maiare [options] [script.maia] [--] [arguments]');
                        console.log('Options:');
                        console.log('-c                          Just compile to JS, don\'t run the script;');
                        console.log('-m                          Just compile to MIL, don\'t run the script;');
                        console.log('-x                          Just compile to XML, don\'t run the script;');
                        console.log('-h     --help               Displays this help message;');
                        console.log('-o     <script.js>          Output file name;');
                        console.log('       --                   End of compiler options.\n');

                        process.exit()
                    } else if (argv[i] == '-o') {
                        i++;
                        outputFile = argv[i];
                    } else if (argv[i] == '--') {
                        break;
                    } else {
                        inputFile = argv[i];
                        break;
                    }
                    i++;
                }

                if (typeof inputFile != 'undefined') {
                    var code = read(String(inputFile));
                    var s = new EBNF.XmlSerializer(getXml, false);
                    var languageParser = new EBNF(code, s);
                    try {
                        languageParser.parse_Grammar();
                    } catch (pe) {
                        if (!(pe instanceof languageParser.ParseException)) {
                            throw pe;
                        } else {
                            var parserError = languageParser.getErrorMessage(pe);
                            console.log(parserError);
                            throw parserError;
                        }
                    }
                    var parser = new DOMParser();
                    var xml = parser.parseFromString(compiledCode.xml, 'text/xml');
                    var compiler = new MaiaRECompiler();
                    compiledCode.mil = compiler.xmlToMil(xml);
                    compiledCode.js = compiler.compile(xml);
                    if (justCompile) {
                        if (typeof outputFile == 'undefined') {
                            var fileName = inputFile.split('.').shift();
                            if (outputFileType == 'js') {
                                outputFile = fileName + '.js';
                                outputContents = compiledCode.js;
                            } else if (outputFileType == 'mil') {
                                outputFile = fileName + '.mil';
                                outputContents = JSON.stringify(compiledCode.mil);
                            } else if (outputFileType == 'xml') {
                                outputFile = fileName + '.xml';
                                outputContents = compiledCode.xml;
                            } else {
                                outputFile = fileName + '.js';
                                outputContents = compiledCode.js;
                            }
                        } else {
                            outputContents = compiledCode.js;
                        }
                        fs.writeFile(outputFile, outputContents, function(err) {
                            if (err) {
                                throw err;
                            }
                        });
                    } else {
                        try {
                            const vm = require('vm');
                            const script = new vm.Script(compiledCode.js);
                            script.runInThisContext();
                        } catch (e) {
                            var evalError = e.message;
                            console.log(evalError);
                        }
                    }
                } else {
                    console.log('MaiaRE Command Line Interface (CLI)');
                    console.log('Usage: maiare [options] [script.maia] [--] [arguments]');
                }
            } else {
                var options = {
                    input: process.stdin,
                    output: process.stdout
                }

                // Command prompt.
                const readline = require('readline');
                const rl = readline.createInterface(options);

                rl.setPrompt(': ');
                rl.prompt();

                function runCommand(commandLine) {
                    var res;
                    if (commandLine.trim() == 'exit') {
                        process.exit(0);
                    }
                    try {
                        res = core.eval(commandLine);
                    } catch (e) {
                        var evalError = e.message;
                        console.log(evalError);
                    }
                    if (typeof res != 'undefined') {
                        console.log(res);
                    }
                    rl.prompt();
                }

                rl.on('line', runCommand);
            }
        }
    }
}

maiaREApp = new MaiaREApp();

/*
 * Run MaiaRE code if this script has been invoked
 * from the command line.
 */
if (typeof process !== 'undefined') {
    // Emulate DOM.
    const jsdom = require("jsdom");
    const {JSDOM} = jsdom;
    var doc = new JSDOM();
    var DOMParser = doc.window.DOMParser;

    maiaREApp.run();
}