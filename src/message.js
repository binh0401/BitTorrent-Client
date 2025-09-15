import {Buffer} from "buffer"
import { infoHash } from "./torrentParser"
import { genId } from "./util"

export const buildHandshake = (torrent) => {
  const buffer = Buffer.alloc(68)

  //pstrlen - 1 byte
  buffer.writeUInt8(19, 0)

  //pstr String identifier
  buffer.write("BitTorrent protocol", 1)

  //reserved - 8 bytes
  buffer.writeUInt32BE(0, 20)
  buffer.writeUInt32BE(0, 24)

  //info hash
  infoHash(torrent).copy(buffer, 28)

  //peer id
  buffer.write(genId())
  return buffer
}

export const buildKeepAlive = () => Buffer.alloc(4)


export const buildChoke = () => {
  const buffer = Buffer.alloc(5)

  //length
  buffer.writeUInt32BE(1, 0)

  //id
  buffer.writeUInt8(0, 4) // 0 for choke (peer dont want to share with you)
  return buffer
}

export const buildUnchoke = () => {
  const buffer = Buffer.alloc(5)

  //length
  buffer.writeUInt32BE(1, 0) //4 bytes (32 bits)

  //id
  buffer.writeUInt8(1, 4) //1 for unchoke

  return buffer
}

//You want to get piece from peer
export const buildInterested = () => {
  const buffer = Buffer.alloc(5)

  //length
  buffer.writeUInt32BE(1, 0)

  //id
  buffer.writeUInt8(2, 4) //2 for interested ( you want to download from peer)
  return buffer
}

export const buildUninterested = () => {
  const buffer = Buffer.alloc(5)

  //length
  buffer.writeUInt32BE(1, 0)

  //id
  buffer.writeUInt8(3, 4) //not want to download from peer
  return buffer

}

//peer send back payload, which contains a piece's index (the piece that peer has)
export const buildHave = (payload) => {
  const buffer = Buffer.alloc(9)

  //length
  buffer.writeUInt32BE(5, 0)

  //id
  buffer.writeUint8(4, 4)

  //piece index
  buffer.writeUInt32BE(payload, 5)
  return buffer
}

export const buildBitfield = bitfield => {
  const buffer = Buffer.alloc(14)

  //length
  buffer.writeUInt32BE(bitfield.length + 1, 0)

  //id
  buffer.writeUInt8(5, 4)

  //bitfield
  bitfield.copy(buffer, 5)

  return buffer
}

export const buildRequest = (payload) => {
  const buffer = Buffer.alloc(17)

  //length
  buffer.writeUInt32BE(13, 0)

  //id
  buffer.writeUInt8(6, 4)

  //piece index
  buffer.writeUInt32BE(payload.index, 5)

  //begin
  buffer.writeUInt32BE(payload.begin, 9)

  //length
  buffer.writeUInt32BE(payload.length, 13)

  return buffer
}


export const buildPiece = (payload) => {
  const buffer = Buffer.alloc(payload.block.length+13)

  //length
  buffer.writeUInt32BE(payload.block.length+9, 0)

  //id
  buffer.writeUInt8(7, 4)

  //piece index
  buffer.writeUInt32BE(payload.index, 5)

  //begin
  buffer.writeUInt32BE(payload.begin, 9)

  //block
  payload.block.copy(buffer, 13)
  return buffer
}

export const buildCancel = (payload) => {
  const buffer = Buffer.alloc(17)

  //length
  buffer.writeUInt32BE(13, 0)

  //id
  buffer.writeUInt8(8, 4)

  //piece index
  buffer.writeUInt32BE(payload.index, 5)

  //begin
  buffer.writeUInt32BE(payload.begin, 9)

  //length
  buffer.writeUInt32BE(payload.length, 13)

  return buffer
}


export const buildPort = payload => {
  const buffer = Buffer.alloc(7)

  //length
  buffer.writeUInt32BE(3, 0)

  //id
  buffer.writeUInt8(9, 4)

  //listen port
  buffer.writeUInt16BE(payload, 5)
  return buffer
}

