// A class maintaining what pieces we have requested and received

export class Pieces {
  constructor(size){
    //2 arrays, the index of each is the index of the piece
    this.requested = new Array(size).fill(false)
    this.received = new Array(size).fill(false)
  }

  addRequested(pieceIndex){
    this.requested[pieceIndex] = true
  }

  addReceived(pieceIndex){
    this.received[pieceIndex] = true
  }

  //Do we need this piece or not
  needed(pieceIndex){
    //If every pieces are requested, but the pieceIndex is not received
    //Copy the received array to requested so we can re-request the piece we need
    if(this.requested.every(i => i === true)){
      this.requested = this.received.slice()
    }

    return !this.requested[pieceIndex] 
  }

  isDone(){
    return this.requested.every(i => i === true)
  }
}