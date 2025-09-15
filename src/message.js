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

//peer send back payload 
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
