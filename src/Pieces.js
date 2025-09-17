// A class maintaining what pieces we have requested and received

import { BLOCK_LEN, blocksPerPiece } from "./torrentParser"

export class Pieces {
  constructor(torrent){
    const buildPiecesArray = () => {
      const nPieces = torrent.info.pieces.length / 20
      const array = new Array(nPieces).fill(null)
      return array.map((_, i) => new Array(blocksPerPiece(torrent, i)).fill(false))
    }
    //2 arrays, the index of each is the index of the piece
    this._requested = buildPiecesArray()
    this._received = buildPiecesArray()
  }

  addRequested(pieceBlock){
    const blockIndex = pieceBlock.begin / BLOCK_LEN
    this._requested[pieceBlock.index][blockIndex] = true
  }

  addReceived(pieceBlock){
    const blockIndex = pieceBlock.begin / BLOCK_LEN
    this._received[pieceBlock.index][blockIndex] = true
  }

  //Do we need this piece or not
  needed(pieceBlock){
    //If every pieces are requested, but the pieceIndex is not received
    //Copy the received array to requested so we can re-request the piece we need
    if(this._requested.every(blocks => blocks.every(i => i === true))){
      this._requested = this._received.map(blocks => blocks.slice())
    }
    const blockIndex = pieceBlock.begin / BLOCK_LEN
    return !this._requested[pieceBlock.index][blockIndex] 
  }

  isDone(){
    return this._received.every(blocks => blocks.every(i => i))
  }
}