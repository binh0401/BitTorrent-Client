import bencode from "bencode"
import fs from "fs"

export const infoHash = () => {

}

export const size = () => {
  
}

export const open = (filepath) => {
  return bencode.decode(fs.readFileSync(filepath))
}