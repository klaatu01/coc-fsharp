Get-Process node | Stop-Process
npm run compile
Copy-Item -Force .\package.json ~\AppData\Local\coc\extensions\node_modules\coc-fsharp\package.json
Copy-Item -Force .\out\client\* ~\AppData\Local\coc\extensions\node_modules\coc-fsharp\out\client\
