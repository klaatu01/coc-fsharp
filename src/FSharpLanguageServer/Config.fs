module FSharpLanguageServer.Config 
open FSharp.Data

type FSharpLanguageServerConfig = JsonProvider<"""
[{
      "fsharp": {
        "trace": {
          "server": "off"
        },
        "project": {
          "define": [ "USE_SOME_FLAG" ],
          "includeCompileBefore": false,
          "otherFlags": [ "--some-compiler-flags" ],
          "overrideReferences": [ "-r:/home/yatli/foo/bar.dll" ],
          "additionalSourceFiles": [ "foo.fs" ]
        },
        "codelens": {
          "references": true
        },
        "analysis": {
          "unusedDeclaration": true
        }
      }
}]""", SampleIsList=true>
