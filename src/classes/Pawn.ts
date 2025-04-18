import Piece from "./Piece";

export default class Pawn extends Piece {
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
      // Pawn can move forward one square
      // Pawn can move in one direction depending on owner
      const direction = this.owner === "white" ? -1 : 1
      const forwardMove = this.isValidMove(this.x, this.y + direction)
      if (forwardMove) {
         moves.push({ x: this.x, y: this.y + direction })
      }
      // Pawn can move forward two squares from starting position
      if (!this.hasMoved && this.isValidMove(this.x, this.y + direction * 2)) {
         moves.push({ x: this.x, y: this.y + direction * 2 })
      }
      // Pawn can capture diagonally
      const diagonalLeft = this.isValidMove(this.x - 1, this.y + direction)
      const diagonalRight = this.isValidMove(this.x + 1, this.y + direction)
      if (diagonalLeft) {
         moves.push({ x: this.x - 1, y: this.y + direction })
      }
      if (diagonalRight) {
         moves.push({ x: this.x + 1, y: this.y + direction })
      }
      return moves
   }
}