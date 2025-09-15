import net from "net"
import { Buffer } from "buffer"
import {getPeers} from "./tracker.js"

export default downloadFromPeers = (torrent) => {
  //Get list of peers, then download from each of them
  getPeers(torrent, peers => {
    peers.forEach(download)
  })
}

const download = (peer) => {
  //Create a TCP connection with each peer
  const socket = new net.Socket()
  socket.on("error", console.log)
  socket.connect(peer.port, peer.ip, () => {

  })

  //Handle responses from peer
  onWholeMsg(socket, data => {

  })
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