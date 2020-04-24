// import * as copypaste from 'copy-paste';
import * as vscode from "vscode";
import { Position } from "vscode";
// import { Range, Position } from 'vscode';
// var path = require("path");

export async function generateTranslationString() {
  const settings = getCurrentVscodeSettings();
  // Get the active editor window
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Select text to translate");
    return;
  }



  let pathTranslations = editor.document.uri.fsPath;
  pathTranslations = pathTranslations.split("src")[0] + "src/assets/i18n/";

  // Fetch the selected text
  const selectedText = editor.document.getText(editor.selection);
  if (!selectedText) {
    vscode.window.showInformationMessage("Select text to translate");
    return;
  }
  let input =
    (await vscode.window.showInputBox({
      prompt: "Enter a key for this translation or leave blank to use value",
      placeHolder: 'e.g. "hello world" will generate a key named "HELLO_WORLD"',
    })) || selectedText;

  const keyRefined = getTranslationKeyFromString(
    input,
    settings.get("caseMode"),
    settings.get("autocapitalize")
  );

  const key = (<string>keyRefined).replace(/\W*/g, "");
  // Generate a json key/value pair
  // const value = `"${key}": "${selectedText}"`;
  // Copy the translation json to the clipboard
  if (settings.get("autoFileModify")) {
    // copypaste.copy(value);
  }
  if (settings.get("autoFileModify")) {
    const jsonfile = require("jsonfile");
    // Directories of the transilation files
    const fileSource =
      pathTranslations + String(settings.get("languageFrom")) + ".json";
    const fileTo =
      pathTranslations + String(settings.get("languageTo")) + ".json";

    // Find if object already in the file, and dont add to the file if key already there
    const obj = jsonfile.readFileSync(fileSource);
    if (!Object.keys(obj).includes(key!)) {
      obj[key!] = selectedText;
      jsonfile.writeFileSync(fileSource, obj);

      const toObj = jsonfile.readFileSync(fileTo);
      var googleTranslate = require("google-translate")(
        settings.get("googleAPIKey")
      );
      if (settings.get("googleAPIKey") !== "") {
        googleTranslate.translate(
          selectedText,
          String(settings.get("languageTo")),
          (err: any, translation: any) => {
            if (err) {
              toObj[key!] = selectedText;
              jsonfile.writeFileSync(fileTo, toObj);
              const apiErrorMessage =
                err &&
                err.body &&
                JSON.parse(err.body) &&
                JSON.parse(err.body).error &&
                JSON.parse(err.body).error.message;
              return vscode.window.showErrorMessage(apiErrorMessage);
            }
            // console.log(translation.translatedText);
            toObj[key!] = translation.translatedText;
            jsonfile.writeFileSync(fileTo, toObj);
            vscode.window.showInformationMessage("Text translated successfully!");
            // Openning the document to highlight the arabic word
            // var openPath = vscode.Uri.file(path.resolve('./'+fileTo));
            // vscode.workspace.openTextDocument(openPath).then(doc => {
            //   const colPos = JSON.stringify(toObj).indexOf(selectedText);
            //   vscode.window.showTextDocument(doc, {
            //     selection:
            //       new Range(
            //         new Position(0, colPos),
            //         new Position(0, colPos + selectedText.length)
            //       )
            //   }
            //   );
            // });
          }
        );
      } else {
        toObj[key!] = selectedText;
        jsonfile.writeFileSync(fileTo, toObj);
        vscode.window.showInformationMessage("Google Key was not set.");
      }// Key not set
    } else {
      vscode.window.showInformationMessage(
        "Key was already found! No files was modified during the process."
      );
    }
  }
  if (settings.get("replaceOnTranslate")) {
    // Replace the selection text with the translated key
    const padding = settings.padding ? " " : "";
    const quote = settings.quote;
    const translation = `{{${padding}${quote}${key}${quote} | ${settings.translatePipeName}${padding}}}`;
    editor.edit((builder) => {
      builder.replace(editor.selection, translation);
    });
  }
}
function getNumberofLine(sourceString: string, string: string): number {
  const pos = sourceString.indexOf(string);
  const tempString = sourceString.substring(0, pos);
  return tempString.split("\n").length;
}
export async function generateTranslationStringCodeOnly() {
  const settings = getCurrentVscodeSettings();
  // Get the active editor window
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Select text to translate");
    return;
  }
  // Fetch the selected text
  let selectedText = editor.document.getText(editor.selection);
  if (!selectedText) {
    vscode.window.showInformationMessage("Select text to translate");
    return;
  }
  let input =
    (await vscode.window.showInputBox({
      prompt: "Enter a key for this translation or leave blank to use value",
      placeHolder: 'e.g. "hello world" will generate a key named "HELLO_WORLD"',
    })) || selectedText;

  const keyRefined = getTranslationKeyFromString(
    input,
    settings.get("caseMode"),
    settings.get("autocapitalize")
  );

  const key = (<string>keyRefined).replace(/\W*/g, "");
  // Generate a json key/value pair
  // const value = `"${key}": "${selectedText}"`;
  // Copy the translation json to the clipboard
  if (settings.get("autoFileModify")) {
    // copypaste.copy(value);
  }
  if (settings.get("autoFileModify") /* Test the editing things! */) {
    const jsonfile = require("jsonfile");
    // Directories of the transilation files
    let pathTranslations = editor.document.uri.fsPath;
    pathTranslations = pathTranslations.split("src")[0] + "src/assets/i18n/";

    const fileSource =
      pathTranslations + String(settings.get("languageFrom")) + ".json";
    const fileTo =
      pathTranslations + String(settings.get("languageTo")) + ".json";

    // Find if object already in the file, and dont add to the file if key already there
    const obj = jsonfile.readFileSync(fileSource);
    selectedText = selectedText.replace(/["']*/g, "");
    if (!Object.keys(obj).includes(key!)) {
      obj[key!] = selectedText;
      jsonfile.writeFileSync(fileSource, obj);

      const toObj = jsonfile.readFileSync(fileTo);

      var googleTranslate = require("google-translate")(
        settings.get("googleAPIKey")
      );
      if (settings.get("googleAPIKey") !== "") {
        googleTranslate.translate(
          selectedText,
          String(settings.get("languageTo")),
          (err: any, translation: any) => {
            if (err) {
              toObj[key!] = selectedText;
              jsonfile.writeFileSync(fileTo, toObj);
              const apiErrorMessage =
                err &&
                err.body &&
                JSON.parse(err.body) &&
                JSON.parse(err.body).error &&
                JSON.parse(err.body).error.message;
              return vscode.window.showErrorMessage(apiErrorMessage);
            }
            // console.log(translation.translatedText);
            toObj[key!] = translation.translatedText;
            jsonfile.writeFileSync(fileTo, toObj);
            vscode.window.showInformationMessage("Text translated successfully!");
            // Openning the document to highlight the arabic word
            // var openPath = vscode.Uri.file(path.resolve('./'+fileTo));
            // vscode.workspace.openTextDocument(openPath).then(doc => {
            //   const colPos = JSON.stringify(toObj).indexOf(selectedText);
            //   vscode.window.showTextDocument(doc, {
            //     selection:
            //       new Range(
            //         new Position(0, colPos),
            //         new Position(0, colPos + selectedText.length)
            //       )
            //   }
            //   );
            // });
          }
        );
      } else {
        toObj[key!] = selectedText;
        jsonfile.writeFileSync(fileTo, toObj);
        vscode.window.showInformationMessage("Google Key was not set.");
      }// Key not set
    } else {
      vscode.window.showInformationMessage(
        "Key was already found! No files was modified during the process."
      );
    }
  }
  if (settings.get("replaceOnTranslate")) {
    // Replace the selection text with the translated key
    // const padding = settings.padding ? ' ' : '';
    // const quote = settings.quote;
    const translation = `${key}`;
    editor.edit((builder) => {
      const documentText = editor.document.getText();

      const outsideConstructor =
        getNumberofLine(documentText, "constructor") - 2;
      builder.replace(editor.selection, "this." + translation); // Replace the string with the variable
      // Add subscription array for unsubscribing later on.
      if (documentText.indexOf("TranslationSubArray") === -1) {
        builder.insert(
          new Position(outsideConstructor, 0),
          "\nTranslationSubArray = [];\n"
        ); // Insert the variable
      }

      if (documentText.indexOf("TranslateService") === -1) {
        builder.insert(
          new Position(getNumberofLine(documentText, "constructor"), 0),
          "private translationService: TranslateService,\n"
        ); // Insert the variable
        builder.insert(
          new Position(getNumberofLine(documentText, "@Component({") - 1, 0),
          "import { TranslateService } from '@ngx-translate/core';\n"
        ); // Insert the variable
      }
      // Add ngOndestroy() for unsubbing later on.
      if (documentText.indexOf("ngOnDestroy()") === -1) {
        // implements OnInit
        // builder.insert(new Position(
        //   getNumberofLine(documentText, "} from '@angular/core'") - 1,
        //   documentText.indexOf("} from '@angular/core'") - 1), " ,OnDestroy ");
        let matchesImplements = documentText.match(
          /export class [\w]+ implements /g
        );
        let matchLengthImplements = 0;
        if (matchesImplements && matchesImplements.length) {
          matchLengthImplements = matchesImplements[0].length;
        }

        builder.insert(
          new Position(
            getNumberofLine(documentText, "} from '@angular/core';") - 1,
            "import {".length
          ),
          "OnDestroy, "
        );
        builder.insert(
          new Position(
            getNumberofLine(documentText, "implements ") - 1,
            matchLengthImplements
          ),
          "OnDestroy, "
        );
        builder.insert(
          new Position(
            getNumberofLine(documentText, "ngOnInit") - 2,
            documentText.indexOf("ngOnInit")
          ),
          `
        ngOnDestroy() {
          this.TranslationSubArray.forEach((value,index)=>{
            value.unsubscribe();
          });
        }
        `
        ); // Insert the variable
      } else {
        // Ng on destroy exist, therefore add to it.
        if (
          documentText.indexOf(
            "this.TranslationSubArray.forEach((value,index)=>{"
          ) === -1
        ) {
          builder.insert(
            new Position(
              getNumberofLine(documentText, "ngOnDestroy"),
              documentText.indexOf("ngOnDestroy")
            ),
            `
          this.TranslationSubArray.forEach((value,index)=>{
            value.unsubscribe();
          });
        `
          ); // Insert the variable
        }
      }
      // Don't add any additional code if the code is already added to the same page!
      if (
        documentText.indexOf(
          translation + " = this.translationService.instant"
        ) === -1
      ) {
        builder.insert(
          new Position(
            getNumberofLine(documentText, "ngOnInit"),
            documentText.indexOf("ngOnInit")
          ),
          "\nthis.TranslationSubArray.push(this.translationService.stream('" +
          translation +
          "').subscribe((result)=>{ this." +
          translation +
          " = result; }));\n"
        ); // Insert the variable
        builder.insert(
          new Position(getNumberofLine(documentText, "class"), 0),
          "\n" +
          translation +
          " = this.translationService.instant('" +
          translation +
          "');\n"
        ); // Insert the variable
      }
    });
  }
}

export async function generateStringOnly() {
  const settings = getCurrentVscodeSettings();
  // Get the active editor window
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Select text to translate");
    return;
  }
  // Fetch the selected text
  let selectedText = editor.document.getText(editor.selection);
  if (!selectedText) {
    vscode.window.showInformationMessage("Select text to translate");
    return;
  }
  let input =
    (await vscode.window.showInputBox({
      prompt: "Enter a key for this translation or leave blank to use value",
      placeHolder:
        'e.g. "hello world" will generate a key named "hellow world"',
    })) || selectedText;

  const keyRefined = getTranslationKeyFromString(
    input,
    settings.get("caseMode"),
    settings.get("autocapitalize")
  );

  const key = (<string>keyRefined).replace(/\W*/g, "");
  // Generate a json key/value pair
  // const value = `"${key}": "${selectedText}"`;
  // Copy the translation json to the clipboard
  if (settings.get("autoFileModify")) {
    // copypaste.copy(value);
  }
  if (settings.get("autoFileModify") /* Test the editing things! */) {
    const jsonfile = require("jsonfile");
    // Directories of the transilation files

    let pathTranslations = editor.document.uri.fsPath;
    pathTranslations = pathTranslations.split("src")[0] + "src/assets/i18n/";

    const fileSource =
      pathTranslations + String(settings.get("languageFrom")) + ".json";
    const fileTo =
      pathTranslations + String(settings.get("languageTo")) + ".json";

    // Find if object already in the file, and dont add to the file if key already there
    const obj = jsonfile.readFileSync(fileSource);
    selectedText = selectedText.replace(/["']*/g, "");
    if (!Object.keys(obj).includes(key!)) {
      obj[key!] = selectedText;
      jsonfile.writeFileSync(fileSource, obj);

      const toObj = jsonfile.readFileSync(fileTo);

      var googleTranslate = require("google-translate")(
        settings.get("googleAPIKey")
      );
      if (settings.get("googleAPIKey") !== "") {
        googleTranslate.translate(
          selectedText,
          String(settings.get("languageTo")),
          (err: any, translation: any) => {
            if (err) {
              toObj[key!] = selectedText;
              jsonfile.writeFileSync(fileTo, toObj);
              const apiErrorMessage =
                err &&
                err.body &&
                JSON.parse(err.body) &&
                JSON.parse(err.body).error &&
                JSON.parse(err.body).error.message;
              return vscode.window.showErrorMessage(apiErrorMessage);
            }
            // console.log(translation.translatedText);
            toObj[key!] = translation.translatedText;
            jsonfile.writeFileSync(fileTo, toObj);
            vscode.window.showInformationMessage("Text translated successfully!");
            // Openning the document to highlight the arabic word
            // var openPath = vscode.Uri.file(path.resolve('./'+fileTo));
            // vscode.workspace.openTextDocument(openPath).then(doc => {
            //   const colPos = JSON.stringify(toObj).indexOf(selectedText);
            //   vscode.window.showTextDocument(doc, {
            //     selection:
            //       new Range(
            //         new Position(0, colPos),
            //         new Position(0, colPos + selectedText.length)
            //       )
            //   }
            //   );
            // });
          }
        );
      } else {
        toObj[key!] = selectedText;
        jsonfile.writeFileSync(fileTo, toObj);
        vscode.window.showInformationMessage("Google Key was not set.");
      }// Key not set
    } else {
      vscode.window.showInformationMessage(
        "Key was already found! No files was modified during the process."
      );
    }
  }
  if (settings.get("replaceOnTranslate")) {
    // Replace the selection text with the translated key
    const translation = `${key}`;
    editor.edit((builder) => {
      builder.replace(editor.selection, translation);
    });
  }
}

export function getTranslationKeyFromString(
  input: string,
  caseMode: string = "snake",
  autocapitalize: boolean = true
) {
  if (caseMode === "camel") {
    return camelize(input);
  } else if (caseMode === "snake") {
    if (autocapitalize) {
      return input.toUpperCase().replace(/ /g, "_");
    } else {
      return input.replace(/ /g, "_");
    }
  }
}

export function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, "");
}

export function getCurrentVscodeSettings() {
  return vscode.workspace.getConfiguration("ngx-translate-quickcreate");
}
