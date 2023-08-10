/**
 * @description: 接收者信息
 * @
 * @return {*}
 */
export interface ReceiverInfo {
  s: string 
  prefixName: string // 名称前缀
  suffixName: string // 泛型后缀，如果存在
  fullName: string // 完整名称
  shortName: string // 精简名称
}

export class ImplUtil {
  /**
   * @description: 获取结构体后缀分界最后的索引, -1表示没找到
   * @param {string} lineText
   * @return {*}
   */
  static getStructEndIndex(lineText: string): number {
    const index = lineText.indexOf("{")
    if (index == -1){
      return index
    }

    const newLineText = lineText.slice(0, index).trim()
    if (!newLineText.endsWith('struct')) {
      return -1
    }

    return lineText.lastIndexOf('struct')
  }

  static parse(lineText: string): ReceiverInfo | undefined {
    const endIndex = ImplUtil.getStructEndIndex(lineText)
    if (endIndex === -1){
      return 
    }

    const beginIndex = lineText.indexOf('type ') + 5

    const r = {} as ReceiverInfo

    r.fullName = lineText.slice(beginIndex, endIndex).trim()

    if (r.fullName.includes('[')) {

      const b = r.fullName.indexOf('[')
      r.prefixName = r.fullName.slice(0, b)

      const e = r.fullName.indexOf(']') - 1

      let result = ""

      r.fullName.slice(b+1, e).split(',').map((str, index, src) => {
        const arr = str.trim().split(' ')

        if (index === src.length - 1) {
          result = result.concat(arr[0])
        }else{
          result = result.concat(arr[0], ",")
        }
        
      })

      result.trim()
      r.suffixName = `[${result}]`
      r.shortName = `${r.prefixName}${r.suffixName}`
    }else{
      r.shortName = r.fullName
      r.prefixName = r.fullName
      r.suffixName = ''
    }

    r.s = r.prefixName.charAt(0).toLowerCase()

    return r
  }
}