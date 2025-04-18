import Piece from "./Piece";

export default class Queen extends Piece {
   hasMoved: boolean = false
   constructor(
      public x: number,
      public y: number,
      public imageSrc: string | undefined,
      public owner: string
   ) {
      super(x, y, imageSrc, owner)
   }
   getValidMoves(): Array<{ x: number; y: number }> {
      //get valid moves for rook and bishop together
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