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

for i in $plat
do
    dotnet publish -f netcoreapp3.1 -c Release --self-contained \
        -r $i src/FSharpLanguageServer -o ./bin/$i
    pushd ./bin/$i
    zip ../../publish/coc-fsharp-$i.zip ./*
    popd
done
 
