#!/bin/sh

cp ../REx/Web-C.js examples/

node examples/Web-C.js test/conditionals.c > test/conditionals.xml
node examples/Web-C.js test/functions.c > test/functions.xml
node examples/Web-C.js test/jumps.c > test/jumps.xml
node examples/Web-C.js test/loops.c > test/loops.xml
node examples/Web-C.js test/operators.c > test/operators.xml
node examples/Web-C.js test/preprocessor.c > test/preprocessor.xml
node examples/Web-C.js test/structs.c > test/structs.xml
