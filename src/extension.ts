'use strict';

import * as vscode from 'vscode';
import * as copypaste from 'copy-paste';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'extension.generateTranslationString',
    async () => {
      // Get the active editor window
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('Select text to translate');
        return;
      }
      // Fetch the selected text
      const selection = editor.document.getText(editor.selection);
      if (!selection) {
        vscode.window.showInformationMessage('Select text to translate');
        return;
      }
      let key = await vscode.window.showInputBox();
      if (!key) {
        return;
      }
      // Uppercase the key
      key = key.toUpperCase();
      // Replace the spaces with underscores
      key = key.replace(' ', '_');
      // Generate a json key/value pair
      const value = `"${key}": "${selection}"`;
      // Copy the translation json to the clipboard
      copypaste.copy(value);
    },
  );
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
