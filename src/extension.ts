"use strict";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    let disposable;
    
    disposable = vscode.commands.registerCommand("multiple-cursor-pattern.RemoveFirst", () => {
        RemoveFirst();
    });
    
    disposable = vscode.commands.registerCommand("multiple-cursor-pattern.RemoveLast", () => {
        RemoveLast();
    });
    
    disposable = vscode.commands.registerCommand("multiple-cursor-pattern.KeepFirst", () => {
        KeepFirst();
    });
    
    disposable = vscode.commands.registerCommand("multiple-cursor-pattern.KeepLast", () => {
        KeepLast();
    });
    
    disposable = vscode.commands.registerCommand("multiple-cursor-pattern.OrderMult", () => {
        OrderMult();
    });
    
    disposable = vscode.commands.registerCommand("multiple-cursor-pattern.SelectSurroundingMinus", () => {
        SelectSurroundingMinus();
    });
    
    disposable = vscode.commands.registerCommand("multiple-cursor-pattern.CursorEach", () => {
        CursorEach();
    });
    
    disposable = vscode.commands.registerCommand("multiple-cursor-pattern.CursorSelectionEach", () => {
        CursorSelectionEach();
    });
    
    context.subscriptions.push(disposable);
}

async function RemoveFirst() {
    // Remove first (explained)
    if(vscode.window.activeTextEditor.selections.length > 1){ /* test with has mult cursor */
        var temp = [];
        for(let index = 0; index < vscode.window.activeTextEditor.selections.length; index++){ /* iter len of mult cur */
            temp[index] = Object.values(vscode.window.activeTextEditor.selections[index]['anchor']) /* get each start pos (anchor) value - Array [L, C]*/
        };
        /* rm the first value (smallest) */
        let value = [...temp].sort((a, b) => a[0] - b[0] || a[1] - b[1])[0] // [... to not affect original]
        /* index of first value after sort */
        let index = temp.indexOf(value)
        vscode.window.activeTextEditor.selections.splice(index, 1);
        vscode.window.activeTextEditor.selections = vscode.window.activeTextEditor.selections
    }
}

async function RemoveLast() {
    // Remove Last
    if(vscode.window.activeTextEditor.selections.length > 1){
        var temp = [];
        for(let index = 0; index < vscode.window.activeTextEditor.selections.length; index++){
            temp[index] = Object.values(vscode.window.activeTextEditor.selections[index]['anchor'])
        };
        vscode.window.activeTextEditor.selections.splice(temp.indexOf([...temp].sort((a, b) => a[0] - b[0] || a[1] - b[1])[temp.length - 1]), 1); /* rm the last value (biggest) */
        vscode.window.activeTextEditor.selections = vscode.window.activeTextEditor.selections
    }
}

async function KeepFirst() {
    // Keep the first
    if(vscode.window.activeTextEditor.selections.length > 1){
        var first = [];
        first[0] = vscode.window.activeTextEditor.selections[0]
        vscode.window.activeTextEditor.selections = first;
    }
}
async function KeepFinal() {
    OrderMult()
    KeepLast()
}

async function KeepLast() {
    // Keep the last
    if(vscode.window.activeTextEditor.selections.length > 1){
        var last = [];
        last[0] = vscode.window.activeTextEditor.selections[vscode.window.activeTextEditor.selections.length - 1]
        vscode.window.activeTextEditor.selections = last;
    }
}

async function OrderMult() {
    // Order mult selection
    if(vscode.window.activeTextEditor.selections.length > 1){
        var temp = [];
        for(let index = 0; index < vscode.window.activeTextEditor.selections.length; index++){
            temp[index] = Object.values(vscode.window.activeTextEditor.selections[index]['anchor'])
        };
        
        let value = [...temp].sort((a, b) => a[0] - b[0] || a[1] - b[1]) /* array of ordenated anchors */
        var ordIndex = []
        for(let index = 0; index < value.length; index++){
            ordIndex[index] = temp.indexOf(value[index])
        };
        
        vscode.window.activeTextEditor.selections = ordIndex.map(i => vscode.window.activeTextEditor.selections[i]);
    }
}

async function SelectSurroundingMinus() {
    // Surrounding Selection
    if(vscode.window.activeTextEditor.selections.length === 1){
        var cur = vscode.window.activeTextEditor.selections[0];
        var cursors = [
            new vscode.Selection(cur.end.line, cur.end.character, cur.end.line, cur.end.character), // c1 = end
            new vscode.Selection(cur.start.line, cur.start.character - 1, cur.start.line, cur.start.character - 1) // c2 = start - 1
        ];
        vscode.window.activeTextEditor.selections = cursors;
    }
}

async function CursorEach() {
    let n;
    n = await vscode.window.showInputBox({placeHolder: "Input a number > 1"})
    n = Number(n)
    if(!Number.isInteger(n)){
        vscode.window.showInformationMessage("Not integer!");
        return(null)
    }
    await vscode.commands.executeCommand("multiple-cursor-pattern.OrderMult")
    if(vscode.window.activeTextEditor.selections.length > 1){
        let index = [];
        let size = vscode.window.activeTextEditor.selections.length
        for (let i = 0; i < size; i = i + n) {
            if (i < size)
                index.push(i)
        }
        
        vscode.window.activeTextEditor.selections = index.map(i => vscode.window.activeTextEditor.selections[i]);
    }
}

async function CursorSelectionEach() {
    let n;
    n = await vscode.window.showInputBox({placeHolder: "Input a number > 1"})
    n = Number(n)
    if(!Number.isInteger(n)){
        vscode.window.showInformationMessage("Not integer!");
        return(null)
    }
    await vscode.commands.executeCommand("editor.action.insertCursorAtEndOfEachLineSelected")
    await vscode.commands.executeCommand("multiple-cursor-pattern.OrderMult")
    if(vscode.window.activeTextEditor.selections.length > 1){
        let index = [];
        let size = vscode.window.activeTextEditor.selections.length
        for (let i = 0; i < size; i = i + n) {
            if (i < size)
                index.push(i)
        }
        
        vscode.window.activeTextEditor.selections = index.map(i => vscode.window.activeTextEditor.selections[i]);
    }
}

export function deactivate() {}
