import { Bencoder } from '../src'

const encoder = new Bencoder()
const textEncoder = new TextEncoder()

// 字符串编码测试
describe('string', () => {
  test('encode string', () => {
    expect(encoder.encode('hello')).toStrictEqual(textEncoder.encode('5:hello'))
  })

  test('encode empty string', () => {
    expect(encoder.encode('')).toStrictEqual(textEncoder.encode('0:'))
  })

  test('encode buffer string', () => {
    const buffer = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f])
    expect(encoder.encode(buffer)).toStrictEqual(textEncoder.encode('5:hello'))
  })

  test('encode Uint8Array string', () => {
    const u8 = new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f])
    expect(encoder.encode(u8)).toStrictEqual(textEncoder.encode('5:hello'))
  })
})

// 整数编码测试
describe('integer', () => {
  test('encode number', () => {
    expect(encoder.encode(123)).toStrictEqual(textEncoder.encode('i123e'))
  })

  test('encode negative number', () => {
    expect(encoder.encode(-123)).toStrictEqual(textEncoder.encode('i-123e'))
  })

  test('encode zero', () => {
    expect(encoder.encode(0)).toStrictEqual(textEncoder.encode('i0e'))
  })

  test('encode max number', () => {
    expect(encoder.encode(Number.MAX_SAFE_INTEGER)).toStrictEqual(textEncoder.encode('i9007199254740991e'))
  })

  test('encode min number', () => {
    expect(encoder.encode(Number.MIN_SAFE_INTEGER)).toStrictEqual(textEncoder.encode('i-9007199254740991e'))
  })

  test('encode float number will throw error', () => {
    expect(() => encoder.encode(1.23)).toThrow('unsupported data type')
  })
})

// 列表编码测试
describe('list', () => {
  test('encode simple list', () => {
    console.log(encoder.encode([1, 2, 3]))
    expect(encoder.encode([1, 2, 3])).toStrictEqual(textEncoder.encode('li1ei2ei3ee'))
  })

  test('encode complex list', () => {
    expect(encoder.encode([1, 'hello', [1, 2, 3], { a: 1, b: 2 }])).toStrictEqual(
      textEncoder.encode('li1e5:helloli1ei2ei3eed1:ai1e1:bi2eee')
    )
  })

  test('encdoe empty list', () => {
    expect(encoder.encode([])).toStrictEqual(textEncoder.encode('le'))
  })

  test('encode list with empty string', () => {
    expect(encoder.encode([''])).toStrictEqual(textEncoder.encode('l0:e'))
  })
})

// 字典编码测试
describe('dictionary', () => {
  test('encode dictionary', () => {
    expect(encoder.encode({ a: 1, b: 2 })).toStrictEqual(textEncoder.encode('d1:ai1e1:bi2ee'))
  })

  // bencode的key排序调用的sort()方法,按照ascii码升序排序
  test('encode dictionary sort', () => {
    expect(encoder.encode({ a: 1, b: 2 })).not.toStrictEqual(textEncoder.encode('d1:bi2e1:ai1ee'))
  })

  test('encode empty dictionary', () => {
    expect(encoder.encode({})).toStrictEqual(textEncoder.encode('de'))
  })

  // bittorrent 编码测试
  test('encode complex dictionary', () => {
    const torrentStructure = {
      pieces: new Uint8Array([
        170, 244, 198, 29, 220, 197, 232, 162, 218, 190, 222, 15, 59, 72, 44, 217, 174, 169, 67, 77
      ])
    }

    const expectValue = new Uint8Array([
      100, 54, 58, 112, 105, 101, 99, 101, 115, 50, 48, 58, 170, 244, 198, 29, 220, 197, 232, 162, 218, 190, 222, 15,
      59, 72, 44, 217, 174, 169, 67, 77, 101
    ])

    expect(encoder.encode(torrentStructure)).toStrictEqual(expectValue)
  })
})
