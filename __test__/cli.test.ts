import { spawnSync } from 'child_process'
import { join } from 'path'
describe('cli', () => {
  const cli = (args: string[]) => spawnSync('node', [join(__dirname, '../dist/index.cjs'), ...args])
  test('decode string', () => {
    const result = cli(['decode', '5:hello'])
    expect(result.stdout.toString()).toContain(`"hello"`)
  })

  test('decode integer', () => {
    const result = cli(['decode', 'i123e'])
    expect(result.stdout.toString()).toContain(`123`)
  })

  test('decode list', () => {
    const result = cli(['decode', 'li1ei2ei3ee'])
    expect(result.stdout.toString()).toContain(`[1,2,3]`)
  })

  test('decode dict', () => {
    const result = cli(['decode', 'd3:bar4:spam3:fooi42ee'])
    expect(result.stdout.toString()).toContain(`{"bar":"spam","foo":42}`)
  })

  test('decode unbuntu torrent', () => {
    const result = cli(['decode', '-f', join(__dirname, './torrent/ubuntu-22.04.2-live-server-amd64.iso.torrent')])
    expect(result.stdout.toString()).toContain(`"announce":"https://torrent.ubuntu.com/announce"`)
  })
})
