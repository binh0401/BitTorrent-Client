import { getPeers } from "./tracker";
import { open } from "./torrentParser";

//Decode the torrent file:
const decodedTorentFile = open("puppy.torrent")
console.log(`Decoded torrent file:`, decodedTorentFile)

getPeers(decodedTorentFile, peers => {
  console.log(`List of peers: ${peers}`)
})







