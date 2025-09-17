import { BLOCK_LEN, blockLen, blocksPerPiece } from "./torrentParser"

export class Queue{
  constructor(torrent){
    this.__torrent = torrent
    this.__queue = []
    this.choked = true
  }

  queue(pieceIndex){
    const nBlocks = blocksPerPiece(this.__torrent, pieceIndex)
    for (let i = 0; i < nBlocks; i++) {
      const pieceBlock = {
        index: pieceIndex,
        begin: i * BLOCK_LEN,
        length: blockLen(this.__torrent, pieceIndex, i)
      }
      this.__queue.push(pieceBlock)
    }
  }

  dequeue() {
    return this.__queue.shift()
  }

  peek(){
    return this.__queue[0]
  }

  length(){
    return this.__queue.length
  }
}