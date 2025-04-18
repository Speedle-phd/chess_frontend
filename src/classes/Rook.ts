import Piece from "./Piece";

export default class Rook extends Piece {
   constructor(
      public x: number,
      public y: number,
      public imageSrc: string | undefined,
      public owner: string
   ) {
      super(x, y, imageSrc, owner)
   }
   getValidMoves(): Array<{ x: number; y: number }> {
      const moves = []
      // Rook can move in straight lines (horizontally and vertically)
      for (let i = 1; i < 8; i++) {
         // Horizontal moves
         if (this.isValidMove(this.x + i, this.y)) {
            moves.push({ x: this.x + i, y: this.y })
         }
         if (this.isValidMove(this.x - i, this.y)) {
            moves.push({ x: this.x - i, y: this.y })
         }
         // Vertical moves
         if (this.isValidMove(this.x, this.y + i)) {
            moves.push({ x: this.x, y: this.y + i })
         }
         if (this.isValidMove(this.x, this.y - i)) {
            moves.push({ x: this.x, y: this.y - i })
         }
      }
      return moves
   }
}