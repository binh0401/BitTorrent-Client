import bencode from "bencode"
import fs from "fs"
import crypto from "crypto"
import bignum from "bignum"

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