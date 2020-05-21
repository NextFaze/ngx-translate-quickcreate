import * as vscode from 'vscode';

import { generateTranslationString, generateTranslationStringCodeOnly, generateStringOnly } from './lib';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'extension.generateTranslationString',
    generateTranslationString,
  );
  let disposable2 = vscode.commands.registerCommand(
    'extension.generateTranslationStringCodeOnly',
    generateTranslationStringCodeOnly,
  );
  let disposable3 = vscode.commands.registerCommand(
    'extension.generateStringOnly',
    generateStringOnly,
  );
  context.subscriptions.push(disposable);
  context.subscriptions.push(disposable2);
  context.subscriptions.push(disposable3);
}

// this method is called when your extension is deactivated
export function deactivate() { }
