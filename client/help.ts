'use strict';

import {ExtensionContext, commands, workspace, Uri} from "coc.nvim";
import FSAC from "./fsac";

export default class Help {

    private static async getHelp() {
        var helpKey = await FSAC.f1help();
        if (helpKey == null) {return;}
        helpKey = helpKey.replace("#ctor", "-ctor");
        let uri = Uri.parse (`https://docs.microsoft.com/en-us/dotnet/api/${helpKey}`);
        workspace.openResource(uri.toString());
    }

    public static async activate(context: ExtensionContext) {
        // Register commands
        context.subscriptions.push(
            commands.registerCommand('fsharp.fsdn', async () => {
                workspace.showMessage("Not implemented...", "error");
            }),
            commands.registerCommand('fsharp.f1Help', this.getHelp),
        )
    }
}
