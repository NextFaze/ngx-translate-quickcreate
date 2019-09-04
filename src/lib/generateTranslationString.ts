import * as copypaste from 'copy-paste';
import * as vscode from 'vscode';
import { Range, Position } from 'vscode';
var path = require("path");

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
  
  if(settings.get('autoFileModify')){
    
    const jsonfile = require('jsonfile');
    // should be used from the config of the extension!
    // settings.get('languageFrom')
    const fileSource =  settings.get('transilationDirectory')+String(settings.get('languageFrom'))+'.json';
    const fileTo =      settings.get('transilationDirectory')+String(settings.get('languageTo'))+'.json';
  
    // Find if object already in the file, and dont add to the file if key already there
    const obj = jsonfile.readFileSync(fileSource);
    if (!Object.keys(obj).includes(key!)) {
      obj[key!] = selectedText;
      jsonfile.writeFileSync(fileSource, obj);
  
      const toObj = jsonfile.readFileSync(fileTo);
      toObj[key!] = selectedText;
      jsonfile.writeFileSync(fileTo, toObj);
      // Open the transilation file and select the word and select the word
      var openPath = vscode.Uri.file(path.resolve('./'+fileTo));
      vscode.workspace.openTextDocument(openPath).then(doc => {
        const colPos = JSON.stringify(obj).indexOf(selectedText);
        vscode.window.showTextDocument(doc, {
          selection:
            new Range(
              new Position(0, colPos),
              new Position(0, colPos + selectedText.length)
            )
        }
        );
      });
    }else{
      vscode.window.showInformationMessage("Key was already found! No files was modified during the process.");
    }
  
  }
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
  caseMode: string = 'snake',
  autocapitalize: boolean = true
) {
  if (caseMode === 'camel') {
    return camelize(input);
  } else if (caseMode === 'snake') {
    if (autocapitalize) {
      return input.toUpperCase().replace(/ /g, '_');
    } else {
      return input.replace(/ /g, '_');
    }
  }
}

export function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export function getCurrentVscodeSettings() {
  return vscode.workspace.getConfiguration('ngx-translate-quickcreate');
}
