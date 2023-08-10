import { dirname } from 'path';
import * as cp from 'child_process'
import * as vscode from 'vscode';
import { ReceiverInfo } from './ImplUtil';

export class QuickUtil {
  static tips = 'Enter interface you want to implement'

  quickPick: vscode.QuickPick<vscode.QuickPickItem>
  timer?: NodeJS.Timer

  constructor(receiver: ReceiverInfo) {
    this.quickPick = vscode.window.createQuickPick()
    this.quickPick.placeholder = QuickUtil.tips
    this.quickPick.onDidChangeValue(this.didChangeValue)
    this.quickPick.onDidChangeSelection((value) => {
      this.didChangeSelection(value, receiver)
    })
    this.quickPick.show()
  }

  didChangeValue = (value: string) => {
    this.timer = setTimeout(async () => {
      this.quickPick.items = await this.getInterface(value)
    }, 300)
  }

  didChangeSelection = (value: readonly vscode.QuickPickItem[], receiver: ReceiverInfo) => {
    const editor = vscode.window.activeTextEditor!
      const root = dirname(editor.document.fileName)

      // 获取结构体名称
 
      // 实现接口方法
      let interfaceName = ''
      const { label, description } = value[0]
      description?.includes('/')
        ? (interfaceName = `${description}.${label}`)
        : (interfaceName = `${label}`)
      const command = `impl "${receiver.s} ${receiver.prefixName}" ${interfaceName}`

      cp.exec(command, { cwd: root }, (err, stdout, stderr) => {
        if (err) {
          vscode.window.showErrorMessage(err.message)
          return
        }

        if (stderr) {
          vscode.window.showErrorMessage(stderr)
          return
        }

        vscode.commands
          .executeCommand('vscode.executeDocumentSymbolProvider', editor.document.uri)
          .then((obj: any) => {
            const struct = obj.filter(
              (item: vscode.SymbolInformation) => item.name === receiver.prefixName
            )
            const reg = new RegExp(
              `${receiver.s} ${receiver.prefixName}`,
              'g'
            )
            const out = stdout.replace(
              reg,
              `${receiver.s} $\{1|${receiver.prefixName},*${
                receiver.prefixName
              }|\}${receiver.suffixName}`
            )
            const snippet = new vscode.SnippetString('\n' + out)

            editor.insertSnippet(snippet, new vscode.Position(struct[0].range.e.c + 1, 0))
          })
      })
      this.quickPick.hide()
  }

  getInterface = (keyword: string): Promise<vscode.QuickPickItem[]> => {
    return new Promise((resolve, reject) => {
      vscode.commands.executeCommand('vscode.executeWorkspaceSymbolProvider', keyword).then(obj => {
        const interfaces = (obj as vscode.SymbolInformation[]).filter(
          item => item.kind === vscode.SymbolKind.Interface
        )
        console.debug(`keyword:${keyword}`)
        resolve(interfaces.map(item => ({ label: item.name, description: item.containerName })))
      })
    })
  } 

}