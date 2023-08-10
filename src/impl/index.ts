import * as vscode from 'vscode';
import { ImplUtil, ReceiverInfo } from './ImplUtil';
import { QuickUtil } from './QuickUtil';

export class ImplProvider implements vscode.CodeActionProvider{

  private receiver? : ReceiverInfo
  static tips = 'Enter interface you want to implement'

  public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

  // 提示 Provider
  provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    const startLine = range.start.line
    // console.debug("startLine: " + startLine)
    const lineText = document.lineAt(startLine).text
    // console.debug("line: " + lineText)
    this.receiver = ImplUtil.parse(lineText)

    if (this.receiver){

      console.debug('receiver:', JSON.stringify(this.receiver))

      return [new vscode.CodeAction("implements interface (🌟gopher🌟)", vscode.CodeActionKind.QuickFix)] 
    }
    
    console.debug("no struct define in this line")
  }

  // 真正执行逻辑
  resolveCodeAction?(codeAction: vscode.CodeAction, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeAction> {
    console.debug("in resolveCodeAction")

    new QuickUtil(this.receiver!)

    return
  }

  // 将符合条件的parse为对应类型


  // 获取当前工程的 symbol

  // 处理当前行，
  
  
}