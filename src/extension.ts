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
      const selectedText = editor.document.getText(editor.selection);
      if (!selectedText) {
        vscode.window.showInformationMessage('Select text to translate');
        return;
      }
      let input = (await vscode.window.showInputBox()) || selectedText;
      const key = input.toUpperCase().replace(' ', '_');
      // Generate a json key/value pair
      const value = `"${key}": "${selectedText}"`;
      // Copy the translation json to the clipboard
      copypaste.copy(value);
      // Replace the selection text with the translated key
      const translation = `{{ ${key} | translate }}`;
      editor.edit(builder => {
        builder.replace(editor.selection, translation);
      });
    },
  );
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
