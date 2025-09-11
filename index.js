import fs from "fs"
import bencode from "bencode"

import dgram from "dgram"
import { Buffer } from "buffer";
import { URL } from "url";
//Read torrent file
const torrentFile = fs.readFileSync("puppy.torrent"); //Return a buffer = sequence of raw bytes

console.log(`Torrent file: ${torrentFile.toString("utf8")}`) //Convert to a string using utf-8 encoding scheme

const decodedTorentFile = bencode.decode(torrentFile)
console.log(`Decoded torrent file:`, decodedTorentFile)

//Extract announce URL
const announceUrl = Buffer.from(decodedTorentFile.announce).toString("utf8")
console.log(`Announce URL: ${announceUrl}`)

//Create an URL Object to use properties
const url = new URL(announceUrl)

//Create a socket
const socket = dgram.createSocket("udp4")

//Create a message
const msg = Buffer.from("hello?", "utf8")

//Send the message in the form of Buffer
socket.send(msg, 0, msg.length, Number(url.port), url.hostname, () => {

} )

socket.on("message", msg => {
  console.log(`Message received: ${msg}`)
})





