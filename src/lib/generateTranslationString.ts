import * as copypaste from 'copy-paste';
import * as vscode from 'vscode';

export async function generateTranslationString() {
  const settings = getCurrentVscodeSettings();

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
  let input =
    (await vscode.window.showInputBox({
      prompt: 'Enter a key for this translation or leave blank to use value',
      placeHolder: 'e.g. "hello world" will generate a key named "HELLO_WORLD"'
    })) || selectedText;
  const key = getTranslationKeyFromString(
    input,
    settings.get('caseMode'),
    settings.get('autocapitalize')
  );
  // Generate a json key/value pair
  const value = `"${key}": "${selectedText}"`;
  // Copy the translation json to the clipboard
  copypaste.copy(value);

  if (settings.get('replaceOnTranslate')) {
    // Replace the selection text with the translated key
    const padding = settings.padding ? ' ' : '';
    const quote = settings.quote;
    const translation = `{{${padding}${quote}${key}${quote} | ${
      settings.translatePipeName
    }${padding}}}`;
    editor.edit(builder => {
      builder.replace(editor.selection, translation);
    });
  }
}

export function getTranslationKeyFromString(
  input: string,
  caseMode?: string,
  autocapitalize?: boolean
) {
  if (caseMode === 'camel') {
    return camelize(input);
  } else if (caseMode === 'snake') {
    if (autocapitalize) {
      return input.toUpperCase().replace(/ /g, '_');
    } else {
      return input.replace(/ /g, '_');
    }
  } else {
    return input;
  }
}

export function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export function getCurrentVscodeSettings() {
  return vscode.workspace.getConfiguration('ngx-translate-quickcreate');
}
