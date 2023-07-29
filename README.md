# node-bencode [![npm version](https://badge.fury.io/js/sloaix-node-bencode.svg)](https://badge.fury.io/js/sloaix-node-bencode)

Bencode encoding and decoding, with both library and CLI versions available.

The bencode cli can decode bencode-formatted data from files or strings and output the result in JSON format.

## Installtion

```bash
# use as a cli tool
npm i -g sloaix-node-bencode

pnpm i -g sloaix-node-bencode

yarn add global sloaix-node-bencode

# use as a libary
npm i -D sloaix-node-bencode

pnpm i -D sloaix-node-bencode

yarn add -D sloaix-node-bencode
```

## Usage

### CLI

option `-f` means argument is a file path, otherwise it will be treated as a string.

option `-p` means output will be pretty json, otherwise it will be a single line.

```bash
  # base usage

  # will out put "hello"
  bencode decode '5:hello' 

  # will output 123
  bencode decode 'i123e'

  # will output [1, 2, 3]
  bencode decode 'li1ei2ei3ee'

  # will output { a: 1, b: 2, c: 3 }
  bencode decode 'd1:ai1e1:bi2e1:ci3ee'

  # decode from file and print compressed json
  bencode decode -f ./ubuntu-22.04.2-live-server-amd64.iso.torrent

  # decode from file and print pretty json, output to file
  bencode decode -fp ./ubuntu-22.04.2-live-server-amd64.iso.torrent > ./ubuntu.json
```

### Encode

```typescript
  import { Bencoder } from 'sloaix-node-bencode'

  const data = 'hello'
  // const data = 123
  // const data = [1, 2, 3]
  // const data = { a: 1, b: 2, c: 3 }
  // const data = { a: [1, 2, 3], b: { c: 1, d: 2, e: 3 } }

  // create encoder
  const encoder = new Bencoder()

  // encode result is a Unit8Array
  // if encode a 'hello' string, result is [53, 58, 104, 101, 108, 108, 111], whitch is '5:hello' ascii code array
  const result = await encoder.encode(data)

  // write to file
  writeFileSync('./bencode', result)

  // open with text editor, you will see '5:hello' string.

```

### Decode

```typescript
  import { Bdecoder } from 'sloaix-node-bencode'

  // decode bitTorrent file
  const torrent = './ubuntu-22.04.2-live-server-amd64.iso.torrent'

  // create decoder
  const decoder = new Bdecoder()

  // if string is valid utf-8 string, it will be decoded to string, like 'hello'
  // or it will be decoded to Uint8Array, like [number, number, number, ...], such as pieces in torrent file
  const result = decoder.decode(readFileSync(torrent))

  // result is a object, like this:

  // {
  // "announce": "https://torrent.ubuntu.com/announce",
  // "announce-list": [
  //   [
  //     "https://torrent.ubuntu.com/announce"
  //   ],
  //   [
  //     "https://ipv6.torrent.ubuntu.com/announce"
  //   ]
  // ],
  // "comment": "Ubuntu CD releases.ubuntu.com",
  // "created by": "mktorrent 1.1",
  // "creation date": 1677174459,
  // "info": {
  //   "length": 1975971840,
  //   "name": "ubuntu-22.04.2-live-server-amd64.iso",
  //   "piece length": 262144,
  //   "pieces": [
  //     42,
  //     56,
  //     162,
  //     55,
  // ....
```

## Test

```bash
npm i && npm run build && npm run test

# output:
# PASS  __test__/encode.test.ts
# RUNS  __test__/decoder.test.ts
# RUNS  __test__/encode.test.ts
# RUNS  __test__/cli.test.ts

# Test Suites: 0 of 3 total
# Tests:       3 passed, 3 total
# Test Suites: 3 passed, 3 total
# Tests:       35 passed, 35 total
# Snapshots:   0 total
# Time:        3.17 s
# Ran all test suites.
```
