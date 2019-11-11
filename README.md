# indent-nav README

IndentNav extension for VSCode for screenreader users.

## Features

This extension allows to navigate in any VSCode document by indentation level. For example, you can uquickly find lines having the same, greater or lesser indentation level.

It also provides some extra commands, such as navigate by word, that is optimized for screenreaders, and keystrokes that simplify selection of large amounts of text.

## Download

(IndentNav latest release)[https://github.com/mltony/vscode-indent-nav/releases/latest/download/indent-nav.vsix]

## Installation

In VSCode, Press `Control+Shift+X` to navigate to extensions manager.
Then click on the actions menu, and select `Install from vsix`.

## Keystrokes

* Alt+Up/Down - jump to previous/next line with the same indentation level
* Alt+Home - jump to parent line, that is previous line with lesser indentation level
* Alt+End - jump to next parent line, that is next line with lesser indentation level
* Alt+PageUp - jump to previous child line, that is previous line that has grater indentation level
* Alt+PageDown - jump to next child line, that is next line with greater indentation level
* Alt+Shift+Home/End - jump to the first/last line with the same indentation level within current indentation block
* Alt+Shift+PageUp/PageDown - jump to previous/next line with the same indentation level possibly outside of current indentation block
* Control+Left/Right - move word left or right, optimized for screenreaders and overrides default behavior
* Alt+F9 - mark current line as beginning of selection
* Alt+F10 - select lines from beginning mmarker until current line

## Known issues

Some screenreaders won't automatically announce new line after issuing IndentNav keystrokes.

For NVDA, please consider using [Tony's enhancements NVDA add-on](https://github.com/mltony/nvda-tonys-enhancements/) to fix this.

