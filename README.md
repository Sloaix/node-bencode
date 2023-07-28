# node-bencode

Bencode encoding and decoding, with both library and CLI versions available.

The CLI version can decode bencode-formatted data from files or strings and output the result in JSON format.

## Installtion

```bash
# use as a cli tool
npm i -g sloaix-node-bencode

pnpm i -g sloaix-node-bencode

yarn add gloabl sloaix-node-bencode

# use as a libary
npm i -D sloaix-node-bencode

pnpm i -D sloaix-node-bencode

yarn add -D sloaix-node-bencode
```

## Usage

### Encode

```typescript
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
