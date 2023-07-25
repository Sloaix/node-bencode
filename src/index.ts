export * from './decoder'
export * from './encoder'
export * from './type'

import { Command } from 'commander'
import { existsSync, readFileSync } from 'fs'
import { description, name, version } from '../package.json'
import { Bdecoder } from './decoder'
import { disableDebug } from './log'

// require.main is the module that was originally executed
// if this module is executed directly, run the CLI
if (require.main === module) {
  disableDebug()
  const program = new Command()
  program.name(name).description(description).version(version)

  program
    .command('decode')
    .description('decode bencode-formatted data')
    .argument('<string>', 'string or file to decode')
    .option('-f, --file', 'bencoded file', false)
    .option('-p, --pretty', 'pretty output', false)
    .action((argument, options) => {
      const { file, pretty } = options
      const textEncoder = new TextEncoder()
      let buffer: Uint8Array

      if (file) {
        // check if file exists
        if (!existsSync(argument)) {
          console.log(`File ${argument} does not exist.`)
          return
        }
        // readable = createReadStream(argument)
        buffer = readFileSync(argument)
      } else {
        buffer = textEncoder.encode(argument)
      }
      const decoder = new Bdecoder()
      const data = decoder.decode(buffer)
      const json = JSON.stringify(data, null, pretty ? 2 : 0)
      console.log(json)
    })

  program.parse()
}
