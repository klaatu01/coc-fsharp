module ProjectCrackerMain

open System
open System.IO
open System.Collections.Generic
open ProjectCracker

[<EntryPoint>]
let main(argv: array<string>): int = 
  let proj = new FileInfo("../../src/ProjectCracker/ProjectCracker.fsproj")
  printfn "%A" (crack proj)
  0
