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
  socket.on("data", data => {

  })
}
/* 
1, Let peers know which file you want to download
2, If peers dont have the file they close connection, if they have they send back a confirm message
3, Peer tells you which pieces they have
4, Peer can reject you, once you and peer are ready you can send "request" messages


*/