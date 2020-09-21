/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {workspace, ExtensionContext, commands} from 'coc.nvim';
import FSAC from './fsac';
import Help from './help';
import Repl from './repl';

export async function activate(context: ExtensionContext) {

    await FSAC.activate(context);
    await Help.activate(context);
    await Repl.activate(context);

    // Register commands
    context.subscriptions.push(
        commands.registerCommand('fsharp.compile', async () => {
            workspace.showMessage("Not implemented...", "error");
            //if (client.started) {
            //await client.sendRequest("fsharp/compile");
            //}
        }),
        commands.registerCommand('fsharp.loadProject', async () => {
            workspace.showMessage("Not implemented...", "error");
        }),
    )

}

