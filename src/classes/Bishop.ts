import Piece from "./Piece";

export default class Bishop extends Piece {
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
      // Bishop can move diagonally in all four directions
      for (let i = 1; i < 8; i++) {
         if (this.isValidMove(this.x + i, this.y + i)) {
            moves.push({ x: this.x + i, y: this.y + i })
         }
         if (this.isValidMove(this.x - i, this.y + i)) {
            moves.push({ x: this.x - i, y: this.y + i })
         }
         if (this.isValidMove(this.x + i, this.y - i)) {
            moves.push({ x: this.x + i, y: this.y - i })
         }
         if (this.isValidMove(this.x - i, this.y - i)) {
            moves.push({ x: this.x - i, y: this.y - i })
         }
      }
      return moves
   }
}