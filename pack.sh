# !/bin/bash
plat="win10-x64 linux-x64 osx.10.11-x64"

rm -rf ./bin
rm -rf ./out
rm -rf ./publish

npm install
npm run compile
npm pack

mkdir -p ./publish
mkdir -p ./bin
mv *.tgz ./publish/
 
