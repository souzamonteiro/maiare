#!/bin/sh

rm -rf build/*
rm -rf docs/*

# Creates uncompressed versions of the library.
cat src/Shebang.js src/REx.js src/MaiaRECompiler.js src/MaiaREApp.js > build/maiare.js
cat src/REx.js src/MaiaRECompiler.js > build/libmaiare.js

cp build/maiare.js bin/
cp build/maiare.js js/
cp build/libmaiare.js js/

chmod 755 bin/*

jsdoc -d ./docs ./package.json ./src

mkdir docs/grammar
cp -r grammar/REx.xhtml docs/grammar
