import dgram from "dgram"
import { Buffer } from "buffer"
import { URL } from "url"
import crypto from 'crypto'
import { infoHash, size, torrentParser } from "./torrentParser"
import { genId } from "./util"

export const getPeers = (torrent, cb) => {
  const socket = dgram.createSocket("udp4")
  const announceUrl = Buffer.from(torrent.announce).toString("utf8")

  const url = new URL(announceUrl)

  //1. Send connect request
  udpSend(socket, buildConnReq(), url)

  socket.on("message", response => {
    if (resType(response) === 'connect'){

      //2. Parse connect response
      const connRes = parseConnRes(response)

      //3. Send announce request
      const announceReq = buildAnnounceReq(connRes.connectionId, torrent)

      udpSend(socket, announceReq, url)
    }else if(resType(response) === "announce"){
      //4. Parse announce response
      const announceRes = parseAnnounceReq(response)

      //5. Pass peers data into callback
      cb(announceRes.peers)
    }
  })
}

const udpSend = (socket, message, rawUrl, cb=() => {}) => {
  const url = new URL(rawUrl)
  socket.send(message, 0, message.length, url.port, url.hostname, cb)
}

const buildConnReq = () => {
  const buffer = Buffer.alloc(16) //Create a buffer 16 bytes long
  
  //connection_id, action, transaction_id
  //8 bytes, 4 bytes, 4 bytes

  //Connection id
  buffer.writeUInt32BE(0x417, 0)
  buffer.writeUInt32BE(0x27101980, 4)

  //Action
  buffer.writeUInt32BE(0, 8)

  //Transaction id
  crypto.randomBytes(4).copy(buffer, 12)

  return buffer
}

const resType = (res) => {

}

const parseConnRes = (res) => {
  //action, transaction_id, connection_id
  //4 bytes, 4 bytes, 8 bytes
  return {
    action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    connectionId: res.slice(8)
  }
}

const buildAnnounceReq = (connId, torrent, port=6881) => {
  const buffer = Buffer.allocUnsafe(98)

  //Connection id - 8 bytes
  connId.copy(buffer, 0)

  //Action - 4 bytes
  buffer.writeUInt32BE(1, 8)

  //Transaction id - 4 bytes
  crypto.randomBytes(4).copy(buffer, 12)

  //Info hash - 20 bytes
  infoHash(torrent).copy(buffer, 16)

  //Peer id - 20 bytes
  genId().copy(buffer, 36)

  //Downlaaded - 8 bytes
  Buffer.alloc(8).copy(buffer, 56)

  //Left - 8 bytes
  size(torrent).copy(buffer, 64)

  //Uploaded - 8 bytes
  Buffer.alloc(8).copy(buffer, 72)

  //Event - 4 bytes
  buffer.writeUInt32BE(0, 80)

  //Ip Address - 4 bytes
  buffer.writeInt32BE(0, 84)

  //Key -  4 bytes
  crypto.randomBytes(4).copy(buffer, 88)

  //Num want - 4 bytes
  buffer.writeInt32BE(-1, 92)

  //Port - 2 bytes
  buffer.writeUInt32BE(port, 96)

  return buffer

}

const parseAnnounceReq = (res) => {
  //Peers come in IP Address (4 bytes) + TCP Port (2 bytes)
  //This function helps group Peers' bytes
  let groups = [] //This array stores array of bytes of each peer
  const group = (iterable, groupSize) => {
    for (let i = 0; i < iterable.length; i+=groupSize) {
      groups.push(iterable.slice(i, i+groupSize))
    }
    return groups
  }

  return {
    action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    leechers: res.readUInt32BE(8),
    seeders: res.readUInt32BE(12),
    peers: group(res.slice(20), 6).map(address => ({
      address: address.slice(0, 4).join('.'), //address is stored as raw 4 bytes, each byte is the number in address it self
      port: address.readUInt32BE(4) //ports are stored as a 16 bit interger separated into 2 bytes, so we need to combine them
    }))
  }
}