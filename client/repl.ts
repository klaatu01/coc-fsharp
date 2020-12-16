'use strict';

import {ExtensionContext, commands, workspace} from "coc.nvim";
import {REPLProvider} from "coc-utils";

export default class Repl {

    private static registerREPL(context: ExtensionContext, title: string) {

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
                name: `FSI`,
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

    public static async activate(context: ExtensionContext) {
        this.registerREPL(context, "FSI");
    }
}
