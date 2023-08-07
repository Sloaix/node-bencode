import { logd } from './log'
import {
  BencodeDict,
  BencodeList,
  BencodeString,
  BencodeType,
  isBencodeDict,
  isBencodeInteger,
  isBencodeList,
  isBencodeString
} from './type'

export class Bencoder {
  private te: TextEncoder = new TextEncoder()

  encode(data: BencodeType) {
    if (isBencodeString(data)) {
      logd('start to encode string')
      return this.encodeByteString(data)
    } else if (isBencodeInteger(data)) {
      logd('start to encode integer')
      return this.encodeInt(data)
    } else if (isBencodeList(data)) {
      logd('start to encode list')
      return this.encodeList(data)
    } else if (isBencodeDict(data)) {
      logd('start to encode dict')
      return this.encodeDict(data)
    } else {
      // 不支持的数据类型
      throw new Error(`unsupported data type '${typeof data}'`)
    }
  }

  /**
   * 编码字节字符串
   * @param byteString 字节字符串
   *
   * 支持编码空字符串,例如 0:
   * 但不支持null或者undefined
   */
  private encodeByteString(byteString: BencodeString): Uint8Array {
    if (byteString === null || byteString === undefined) {
      throw new Error("undefined or null string isn't be supported to be encode")
    }

    // 将除string外非Buffer类型的数据转换为Buffer
    if (byteString instanceof Uint8Array) {
      byteString = Buffer.from(byteString)
    }

    // 将Buffer类型的数据转换为字节字符串
    if (byteString instanceof Buffer) {
      byteString = byteString.toString('utf-8')
    }

    // 字符串的编码格式为：字符串的长度 + ':' + 字符串
    // 例如：4:spam
    const buffers: Uint8Array[] = [this.te.encode(`${byteString.toString().length}:`)]

    buffers.push(Buffer.from(byteString))

    return Uint8Array.from(Buffer.concat(buffers))
  }

  /**
   * 编码数字
   * @param integer 数字
   */
  private encodeInt(integer: number): Uint8Array {
    if (!Number.isInteger(integer)) {
      throw new Error('bencode only support encode integer')
    }
    // 数字的编码格式为：'i' + 数字 + 'e'
    // 例如：i3e或者 i-5e
    return this.te.encode(`i${integer}e`)
  }

  /**
   * 编码列表
   * @param list
   */
  private encodeList(list: BencodeList): Uint8Array {
    logd(` start encodeList`)
    const buffers: Uint8Array[] = [this.te.encode('l')]
    // 遍历列表中的元素
    for (const element of list) {
      logd(` start itre ${element}`)
      // 递归调用Encode方法,编码列表中的元素
      buffers.push(this.encode(element))
    }
    logd(` end encodeList`)

    buffers.push(this.te.encode('e'))

    return Uint8Array.from(Buffer.concat(buffers))
  }

  /**
   * 编码字典
   * @param dict
   */
  private encodeDict(dict: BencodeDict): Uint8Array {
    // 字典的编码格式为：'d' + 字典中的key-value + 'e'
    const buffers: Uint8Array[] = [this.te.encode('d')]

    // 创建一个数组,用于存储字典的key
    let keys: string[] = Object.keys(dict)

    // 对数组进行排序
    keys.sort()

    // 遍历数组,将字典的key和value写入到buffer
    for (let i = 0; i < keys.length; i++) {
      let k = keys[i]

      // 写入 key:
      logd(` start encode key ${k}`)
      buffers.push(this.encodeByteString(k))

      // 写入 value
      let value = dict[k]
      buffers.push(this.encode(value))
    }

    // 写入结束符 e
    buffers.push(this.te.encode('e'))
    return Uint8Array.from(Buffer.concat(buffers))
  }
}
