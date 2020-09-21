/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { workspace, ExtensionContext, commands, Uri, } from 'coc.nvim';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'coc.nvim';
import { LanguageServerProvider, LanguageServerRepository, ILanguageServerPackages } from 'coc-utils'
import { REPLProvider } from 'coc-utils';
import {sleep, getCurrentSelection} from 'coc-utils';
import { TextDocumentPositionParams, TextDocumentIdentifier } from 'vscode-languageserver-protocol';

function registerREPL(context: ExtensionContext, title: string) { 

    let replProvider = new REPLProvider({
        title: title,
        command: "dotnet",
        args: ['fsi', '--readline+', '--utf8output', '--nologo'],
        commit: ';;',
        filetype: 'fsharp'
    })

    let cmdEvalLine = commands.registerCommand("fsharp.evaluateLine", async () => await replProvider.eval('n'));
    let cmdEvalSelection = commands.registerCommand("fsharp.evaluateSelection", async () => await replProvider.eval('v'));
    let cmdExecFile = commands.registerCommand("fsharp.run", async (...args: any[]) => {
        let root = workspace.rootPath

        let argStrs = args
            ? args.map(x => `${x}`)
            : []

        let term = await workspace.createTerminal({
            name: `F# console`,
            shellPath: "dotnet",
            cwd: root,
            shellArgs: ['run'].concat(argStrs)
        })

        // switch to the terminal and steal focus
        term.show(false)
    })

    // Push the disposable to the context's subscriptions so that the 
    // client can be deactivated on extension deactivation
    // TODO push the repl provider
    context.subscriptions.push(cmdExecFile, cmdEvalLine, cmdEvalSelection);
}

export async function activate(context: ExtensionContext) {

    const fsac_pkgs: ILanguageServerPackages = {
        "win-x64": {
            executable: "fsautocomplete.dll",
            platformPath: "fsautocomplete.netcore.zip"
        },
        "linux-x64": {
            executable: "fsautocomplete.dll",
            platformPath: "fsautocomplete.netcore.zip"
        },
        "osx-x64": {
            executable: "fsautocomplete.dll",
            platformPath: "fsautocomplete.netcore.zip"
        }
    }

    const fsac_repo: LanguageServerRepository = {
        kind: "github",
        repo: "fsharp/FsAutoComplete",
        channel: "latest"
    }

    // The server is packaged as a standalone command
    const lsprovider = new LanguageServerProvider(context, "FSAC server", fsac_pkgs, fsac_repo)
    const languageServerExe = await lsprovider.getLanguageServer()

    let serverOptions: ServerOptions = { 
        command: "dotnet", 
        args: [languageServerExe, "--background-service-enabled"], 
        transport: TransportKind.stdio
    }

    // Options to control the language client
    let clientOptions: LanguageClientOptions = {
        // Register the server for F# documents
        documentSelector: [{scheme: 'file', language: 'fsharp'}],
        synchronize: {
            // Synchronize the setting section 'FSharp' to the server
            configurationSection: 'FSharp',
            // Notify the server about file changes to F# project files contain in the workspace
            fileEvents: [
                workspace.createFileSystemWatcher('**/*.fsproj'),
                workspace.createFileSystemWatcher('**/*.fs'),
                workspace.createFileSystemWatcher('**/*.fsi'),
                workspace.createFileSystemWatcher('**/*.fsx'),
                workspace.createFileSystemWatcher('**/project.assets.json')
            ]
        },
        initializationOptions: {
          // setting it to true will start Workspace Loading without need to run fsharp/workspacePeek and fsharp/workspaceLoad commands. 
          // It will always choose top workspace from the found list - all projects in workspace if 0 .sln files are found, .sln file 
          // if 1 .sln file was found, .sln file with most projects if multiple .sln files were found. It's designed to be used in clients 
          // that doesn't allow to create custom UI for selecting workspaces.
          AutomaticWorkspaceInit: true
        }
    }

    // Create the language client and start the client.
    let client = new LanguageClient('fsharp', 'FsAutoComplete Language Server', serverOptions, clientOptions);
    let disposable = client.start();

    // Push the disposable to the context's subscriptions so that the 
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);

    // Register commands
    context.subscriptions.push(
        commands.registerCommand('fsharp.fsdn', async () => {
          workspace.showMessage("Not implemented...", "error");
        }),
        commands.registerCommand('fsharp.f1Help', async () => {
          if (!client.started) return;
          let cursor = await workspace.getCursorPosition();
          let doc = await workspace.document;
          let id = TextDocumentIdentifier.create(doc.uri);
          let uri = await client.sendRequest<any>('fsharp/f1Help', {
            textDocument: id,
            position: cursor
          });
          workspace.showMessage(JSON.parse(uri.content).Data);
        }),
        commands.registerCommand('fsharp.compile', async () => {
          workspace.showMessage("Not implemented...", "error");
          //if (client.started) {
            //await client.sendRequest("fsharp/compile");
          //}
        }),
        commands.registerCommand('fsharp.loadProject', async () => {
          workspace.showMessage("Not implemented...", "error");
        }),
        commands.registerCommand('fsharp.downloadLanguageServer', async () => {
            if (client.started) {
                await client.stop()
                disposable.dispose()
                await sleep(1000)
            }
            await lsprovider.downloadLanguageServer();
            disposable = client.start()
            context.subscriptions.push(disposable);
        }),
    )

    registerREPL(context, "F# REPL")
}

