New-Item -ItemType Directory -Force -Name out
New-Item -ItemType Directory -Force -Name publish
New-Item -ItemType Directory -Force -Name bin
Remove-Item bin/* -Recurse -Force
Remove-Item out/* -Recurse -Force
Remove-Item publish/* -Recurse -Force

# client

npm install
npm run compile
npm pack --silent
Move-Item *.tgz publish/

