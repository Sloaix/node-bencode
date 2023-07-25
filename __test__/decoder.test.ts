import { readFileSync } from 'node:fs'
import { Bdecoder } from '../src'
import { join } from 'node:path'

const decoder = new Bdecoder()
const textEncoder = new TextEncoder()

// 字符串解码测试
describe('string', () => {
  test('decode string', () => {
    expect(decoder.decode(textEncoder.encode('5:hello'))).toBe('hello')
  })

  test('decode empty string', () => {
    expect(decoder.decode(textEncoder.encode('0:'))).toBe('')
  })
})

// 整数解码测试
describe('integer', () => {
  test('decode number', () => {
    expect(decoder.decode(textEncoder.encode('i123e'))).toEqual(123)
  })

  test('decode negative number', () => {
    expect(decoder.decode(textEncoder.encode('i-123e'))).toStrictEqual(-123)
  })

  test('decode zero', () => {
    expect(decoder.decode(textEncoder.encode('i0e'))).toEqual(0)
  })

  test('decode max number', () => {
    expect(decoder.decode(textEncoder.encode('i9007199254740991e'))).toEqual(Number.MAX_SAFE_INTEGER)
  })

  test('decode min number', () => {
    expect(decoder.decode(textEncoder.encode('i-9007199254740991e'))).toEqual(Number.MIN_SAFE_INTEGER)
  })
})

// 列表解码测试
describe('list', () => {
  test('decode simple list', () => {
    expect(decoder.decode(textEncoder.encode('li1ei2ei3ee'))).toStrictEqual([1, 2, 3])
  })

  test('decode complex list', () => {
    expect(decoder.decode(textEncoder.encode('li1e5:helloli1ei2ei3eed1:ai1e1:bi2eee'))).toStrictEqual([
      1,
      'hello',
      [1, 2, 3],
      { a: 1, b: 2 }
    ])
  })

  test('encdoe empty list', () => {
    expect(decoder.decode(textEncoder.encode('le'))).toStrictEqual([])
  })

  test('decode list with empty string', () => {
    expect(decoder.decode(textEncoder.encode('l0:e'))).toStrictEqual([''])
  })
})

// 字典解码测试
describe('dictionary', () => {
  test('decode dictionary', () => {
    expect(decoder.decode(textEncoder.encode('d1:ai1e1:bi2ee'))).toStrictEqual({ a: 1, b: 2 })
  })

  // bencode的key排序调用的sort()方法,按照ascii码升序排序
  test('decode dictionary sort', () => {
    expect(decoder.decode(textEncoder.encode('d1:bi2e1:ai1ee'))).toStrictEqual({ a: 1, b: 2 })
  })

  test('decode empty dictionary', () => {
    expect(decoder.decode(textEncoder.encode('de'))).toStrictEqual({})
  })
})

// torrent文件解码测试
describe('torrent', () => {
  test('decode torrent', () => {
    // torrent文件路径
    const file = join(__dirname, 'torrent/ubuntu-22.04.2-live-server-amd64.iso.torrent')
    // 读取并解码torrent文件
    const torrentObj = decoder.decode(readFileSync(file))
    // 校验announce
    expect(torrentObj).toHaveProperty('announce', 'https://torrent.ubuntu.com/announce')
    // 校验pieces长度
    expect(torrentObj).toHaveProperty('info.piece length', 262144)
    // 校验pieces数量
    expect(torrentObj).toHaveProperty('info.pieces.length', 150760)
  })
})
