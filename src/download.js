import net from "net"
import { Buffer } from "buffer"
import {getPeers} from "./tracker.js"
import {buildHandshake, buildInterested, buildRequest, messageParser} from './message.js'
import { Pieces } from "./Pieces.js"

export default downloadFromPeers = (torrent) => {

  //Get list of peers, then download from each of them
  getPeers(torrent, peers => {

    const pieces = new Pieces(torrent.info.pieces.length / 20)//Each piece is a buffer 20-byte long ==> Number of pieces = Total bytes length / 20

    peers.forEach(peer => download(peer, torrent, pieces))
  })
}

const download = (peer, torrent, pieces) => {
  //Create a TCP connection with each peer
  const socket = new net.Socket()
  socket.on("error", console.log)
  socket.connect(peer.port, peer.ip, () => {

    //1. Build handshake when connect
    socket.write(buildHandshake(torrent))
  })

  //Handle responses from peer
  const queue = {choked: true, queue: []}
  onWholeMsg(socket, msg => msgHandler(msg, socket, pieces, queue))
}

const msgHandler = (msg, socket, pieces, queue) => {
  if(isHandshake(msg)){
    socket.write(buildInterested())
  }else{
    const m = messageParser(msg)

    if(m.id === 0) chokeHandler(socket)
    if(m.id === 1) unChokeHandler(socket, pieces, queue)
    if(m.id === 4) haveHandler(m.payload)
    if(m.id === 5) bitfieldHandler(m.payload)
    if(m.id === 7) pieceHandler(m.payload)
  }
}

const chokeHandler = (socket) => {
  //Peer dont want to talk with you --> end connection
  socket.end()
}

const unChokeHandler = (socket, pieces, queue) => {
  queue.choked = false

  requestPiece(socket, pieces, queue)
}

const haveHandler = (payload, socket, requested, queue) => {
  const pieceIndex = payload.readUInt32BE(32)
  queue.push(pieceIndex)
  if(queue.length === 1){
    requestPiece(socket, requested, queue)
  }
  if(!requested[pieceIndex]){
    socket.write(buildRequest())
  }
  requested[pieceIndex] = true
}

const bitfieldHandler = (payload) => {

}

const pieceHandler = (payload, socket, requested, queue) => {

  queue.shift()
  requestPiece(socket, requested, queue)
}

const requestPiece = (socket, pieces, queue) => {
  if(queue.choked) return null

  while(queue.queue.length){
    const pieceIndex = queue.shift()
    if(pieces.needed(pieceIndex)){
      socket.write(buildRequest(pieceIndex))
      pieces.addRequested(pieceIndex)
      break
    }
  }
}



const isHandshake = (msg) => {
  return msg.length === msg.readUInt8(0) + 49 && msg.toString("utf8", 1) === "BitTorrent protocol"
}

//Handshake: <1 byte pstrlen><pstrlen bytes (19) pstr><8 bytes reserved><20 bytes info_hash><20 bytes peer_id>
//Normal message: <4-byte length prefix><message_id + payload>

//TCP send bytes in order, but does not guarantee the bytes of the same message are placed in a chunk.
//We have to write a function to group bytes of a message 
const onWholeMsg = (socket, cb) => {
  let savedBuffer = Buffer.alloc(0)
  let handshake = true //Dedicate if the data receive is from the handshake or not

  socket.on("data", receivedBuffer => {
    //Calculate the length of the whole message: 
    const mgsLen = () => handshake ? savedBuffer.readUInt8(0) + 49 : savedBuffer.readInt32BE(0) + 4
    savedBuffer = Buffer.concat([savedBuffer, receivedBuffer])

    while(savedBuffer.length >=4 && savedBuffer.length >= mgsLen()){
      cb(savedBuffer.slice(0, mgsLen()))
      savedBuffer = savedBuffer.slice(mgsLen())
      handshake = false
    }
  })
}
/* 
1, Let peers know which file you want to download
2, If peers dont have the file they close connection, if they have they send back a confirm message
3, Peer tells you which pieces they have
4, Peer can reject you, once you and peer are ready you can send "request" messages


*/