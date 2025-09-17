import bencode from "bencode"
import fs from "fs"
import crypto from "crypto"
import bignum from "bignum"

export const BLOCK_LEN = Math.pow(2, 14)

export const pieceLen = (torrent, pieceIndex) => {
  const totalLength = bignum.fromBuffer(size(torrent)).toNumber()
  const pieceLength = torrent.info['piece length']

  const lastPieceLength = totalLength % pieceLength
  const lastPieceIndex = Math.floor(totalLength/pieceLength)

  return lastPieceIndex === pieceIndex ? lastPieceLength : pieceLength
}

export const blocksPerPiece = (torrent, pieceIndex) => {
  const pieceLength = pieceLen(torrent, pieceIndex)
  return Math.ceil(pieceLength/BLOCK_LEN)
}

export const blockLen = (torrent, pieceIndex, blockIndex) => {
  const pieceLength = pieceLen(torrent, pieceIndex)

  const lastBlockLength = pieceLength % BLOCK_LEN
  const lastBlockIndex = Math.floor(pieceLength / BLOCK_LEN)

  return blockIndex === lastBlockIndex ? lastBlockLength : BLOCK_LEN
}




export const infoHash = (torrent) => {
  //Extract the info from the decoded torrent file
  const info = bencode.decode(torrent.info)

  //Pass the info through SHA1 hashsing function
  return crypto.createHash("sha1").update(info).digest() // return a Buffer 
}

export const size = (torrent) => {
  //Size of files: Multi-files or Single-file
  const size = torrent.info.files ? 
    torrent.info.files.map(file => file.length).reduce((a, b) => a+b) : torrent.info.length

  return bignum.toBuffer(size, {size: 8}) //Serialized into a 8-byte Buffer
}

export const open = (filepath) => {
  return bencode.decode(fs.readFileSync(filepath))
}