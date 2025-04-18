import Piece from "./Piece";

export default class Knight extends Piece{
   constructor(
      public x: number,
      public y: number,
      public imageSrc: string | undefined,
      public owner: string,
   ){
      super(x, y, imageSrc, owner)
   }
   getValidMoves(): Array<{x: number, y: number}> {
      const moves = []

      const knightMoves = [
         { x: 2, y: 1 },
         { x: 2, y: -1 },
         { x: -2, y: 1 },
         { x: -2, y: -1 },
         { x: 1, y: 2 },
         { x: 1, y: -2 },
         { x: -1, y: 2 },
         { x: -1, y: -2 },
      ]

      for (const move of knightMoves) {
         const newX = this.x + move.x
         const newY = this.y + move.y
         if (this.isValidMove(newX, newY)) {
            moves.push({ x: newX, y: newY })
         }
      }

      return moves
   }


}