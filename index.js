import { getPeers } from "/src/tracker.js";
import { open } from "./src/torrentParser.js";

//Decode the torrent file:
const decodedTorentFile = open("puppy.torrent")
console.log(`Decoded torrent file:`, decodedTorentFile)

getPeers(decodedTorentFile, peers => {
  console.log(`List of peers: ${peers}`)
})







