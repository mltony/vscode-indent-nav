// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { setFlagsFromString } from 'v8';
//import * as qqq from 'typescript/lib/lib.es5.d';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let indentNav = new IndentNav();
	console.log('indent-nav is now active!');

	let wordRight = vscode.commands.registerCommand('extension.wordRight', () => {
		indentNav.moveByWord(1);
	});
	context.subscriptions.push(wordRight);
	let wordLeft = vscode.commands.registerCommand('extension.wordLeft', () => {
		indentNav.moveByWord(-1);
	});
	context.subscriptions.push(wordLeft);

	let nextSibling = vscode.commands.registerCommand('extension.nextSibling', () => {
		indentNav.jumpToIndent(1, 0);
	});
	context.subscriptions.push(nextSibling);
	let previousSibling = vscode.commands.registerCommand('extension.previousSibling', () => {
		indentNav.jumpToIndent(-1, 0);
	});
	context.subscriptions.push(previousSibling);
	let nextSiblingForce = vscode.commands.registerCommand('extension.nextSiblingForce', () => {
		indentNav.jumpToIndent(1, 0, true);
	});
	context.subscriptions.push(nextSiblingForce);
	let previousSiblingForce = vscode.commands.registerCommand('extension.previousSiblingForce', () => {
		indentNav.jumpToIndent(-1, 0, true);
	});
	context.subscriptions.push(previousSiblingForce);
	let lastSibling = vscode.commands.registerCommand('extension.lastSibling', () => {
		indentNav.jumpToIndent(1, 0, false, true);
	});
	context.subscriptions.push(lastSibling);
	let firstSibling = vscode.commands.registerCommand('extension.firstSibling', () => {
		indentNav.jumpToIndent(-1, 0, false, true);
	});
	context.subscriptions.push(firstSibling);

	let nextChild = vscode.commands.registerCommand('extension.nextChild', () => {
		indentNav.jumpToIndent(1, 1);
	});
	context.subscriptions.push(nextChild);
	let previousChild = vscode.commands.registerCommand('extension.previousChild', () => {
		indentNav.jumpToIndent(-1, 1);
	});
	context.subscriptions.push(previousChild);
	let previousParent = vscode.commands.registerCommand('extension.previousParent', () => {
		indentNav.jumpToIndent(-1, -1, true);
	});
	context.subscriptions.push(previousParent);
	let nextParent = vscode.commands.registerCommand('extension.nextParent', () => {
		indentNav.jumpToIndent(1, -1, true);
	});
	context.subscriptions.push(nextParent);
	let startSelection = vscode.commands.registerCommand('extension.startSelection', () => {
		indentNav.startSelection();
	});
	context.subscriptions.push(startSelection);
	let finishSelection = vscode.commands.registerCommand('extension.finishSelection', () => {
		indentNav.finishSelection();
	});
	context.subscriptions.push(finishSelection);

}

export function deactivate() {}

class IndentNav {
	protected jumpTo(line:number, column:number) {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		let newPosition = editor.selection.active.with(line, column);
		editor.selection = new vscode.Selection(newPosition, newPosition);
		editor.revealRange(new vscode.Range(newPosition, newPosition));
	}
	public getLevel(line: any) {
		if (line.text.toString().trimRight().length === 0) {
			return -1;
		} else {
			return line.firstNonWhitespaceCharacterIndex;
		}
	}

	public jumpToIndent(lineIncrement: number, levelSign: number, unbounded:boolean = false, jumpToLast:boolean=false) {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		let n = editor.document.lineCount;
		let i = editor.selection.start.line;
		let line = editor.document.lineAt(i);
		let originalLevel = this.getLevel(line);
		let isBlank = ( originalLevel < 0);
		if (isBlank) {
			return;
		}
		let found:boolean = false;
		let result:number = -1;
		while (true) {
			i += lineIncrement;
			if ((i >= n) || (i < 0)) {
				// Hit the end of the document - Not found
				break;
			}
			let line = editor.document.lineAt(i);
			let level = this.getLevel(line);
			isBlank = ( level < 0);
			if (isBlank) {
				continue;
			}
			if ((level < originalLevel) && (!unbounded)) {
				// Hit the end of this indentation block - not found
				break;
			}
			if (Math.sign(level - originalLevel) == Math.sign(levelSign)) {
				result = i;
				found = true;
				if (!jumpToLast) {
					break;
				}
				//vscode.window.showInformationMessage('Jumping to line ' + i);
				//let newPosition = editor.selection.active.with(i, 0);
				//editor.selection = new vscode.Selection(newPosition, newPosition);
				//editor.revealRange(new vscode.Range(newPosition, newPosition));
				//editor.show();
				//vscode.window.showInformationMessage('Hello World!' + __dirname);
				//home/tony/test
				//return;
			}
		}
		if (found) {
			this.jumpTo(result, 0);
		} else {
			let message = '';
			if (lineIncrement > 0) {
				message = 'No next';
			} else {
				message = 'No previous';
			}
			vscode.window.showWarningMessage(message);
		}
	}

	public moveByWord(increment:number) {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		let lineCount = editor.document.lineCount;
		let lineIndex = editor.selection.start.line;
		let charIndex = editor.selection.start.character
		let regexp: RegExp = /(?!_\b)\w+/g;
		while (true) {
			let line = editor.document.lineAt(lineIndex).text.toString();
		
			let words = new Array();
			while(true) {
				let m = regexp.exec(line);
				if (!m) {
					break;
				}
				words.push(m.index);
			}
			let currentWordIndex:number = -1;
			let newWordIndex = currentWordIndex + increment;
			for (let i=0; i < words.length; i++) {
				if (words[i] == charIndex) {
					currentWordIndex = i;
					newWordIndex = currentWordIndex + increment;
					break;
				} else if (words[i] < charIndex) {
					currentWordIndex = i;
					if (increment > 0) {
						newWordIndex = i+1;
					} else {
						newWordIndex = i;
					}
				} else {
					break;
				}
			}
			if ((newWordIndex >= 0) && (newWordIndex < words.length)) {
				this.jumpTo(lineIndex, words[newWordIndex]);
				return;
			}
			let newLineIndex = lineIndex + increment;
			if ((newLineIndex < 0) || (newLineIndex >= lineCount)) {
				if (increment > 0) {
					this.jumpTo(lineIndex, line.length);
				} else {
					this.jumpTo(lineIndex, 0);
				}
				return;
			}
			lineIndex = newLineIndex;
			if (increment > 0) {
				charIndex = -1;
			} else {
				charIndex = 999999;
			}
		}
	}

	selectionLineIndex: number = -1;

	public startSelection() {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		this.selectionLineIndex = editor.selection.start.line;
		vscode.window.showInformationMessage('Selection start marked.');
	}

	public finishSelection() {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		let lineIndex = editor.selection.start.line;
		let line1 = -1, line2 = -1;
		if (lineIndex > this.selectionLineIndex) {
			line1 = this.selectionLineIndex;
			line2 = lineIndex;
		} else {
			line2 = this.selectionLineIndex;
			line1 = lineIndex;
		}
		let position1 = editor.document.lineAt(line1).range.start;
		let position2 = editor.document.lineAt(line2).range.end;
		editor.selection = new vscode.Selection(position1, position2);
		editor.revealRange(new vscode.Range(position1, position2));

	}
}
