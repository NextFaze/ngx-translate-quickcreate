# ngx-translate-quickcreate

This project contains VSCode extension `ngx-translate-quickcreate`.

## Requirements

For usage in an Angular project that uses [@ngx-translate](https://www.npmjs.com/package/@ngx-translate/core).

## Extension Commands

This extension contributes the following commands:

### Generate Translation String

Turns your selected text into a ngx-translate string and pipe.

#### Example Usage

1. Select word(s) that you want to translate
1. Open up the command palette (⇧⌘P (Windows, Linux Ctrl+Shift+P))
1. Search for `Translate: Generate Translation String`
1. Input a name you wish to refer to this value as, e.g. hello world
1. Selected text is now changed to the translation key with the pipe and translation copied to clipboard
1. Open your translations `.json` file and paste the clipboard contents

## Extension Settings

This extension contributes the following settings:

* `ngx-translate-quickcreate.replaceOnTranslate`: Replace the selected text after generating a translation string.
* `ngx-translate-quickcreate.translatePipeName`: The name of the pipe to handle the translation.
* `ngx-translate-quickcreate.quote`: Which quote to use around the inserted translation key.
* `ngx-translate-quickcreate.padding`: Add spaces inside the curly bracket pair.

## Release Notes

### 1.0.0

Initial release of `ngx-translate-quickcreate`
