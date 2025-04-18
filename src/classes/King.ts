import Piece from "./Piece";
import {board} from "../main";
import Rook from "./Rook";
export default class King extends Piece {
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
      // King can move one square in any direction
      const directions = [
         { x: 1, y: 0 },
         { x: -1, y: 0 },
         { x: 0, y: 1 },
         { x: 0, y: -1 },
         { x: 1, y: 1 },
         { x: -1, y: -1 },
         { x: 1, y: -1 },
         { x: -1, y: 1 },
      ]

      for (const direction of directions) {
         const newX = this.x + direction.x
         const newY = this.y + direction.y
         if (this.isValidMove(newX, newY)) {
            moves.push({ x: newX, y: newY })
         }
      }
      // King can castle if it hasn't moved and the rook hasn't moved
      if (!this.hasMoved) {
         //get the Board class and check for rooks in that hasnt moved yet and have the same owner
         const boardPieces = board.cells
         //find the rooks in the same row as the king
         const rooks = boardPieces.filter(
            (cell) =>
               
               cell.piece instanceof Rook &&
               cell.piece.owner === this.owner &&
               cell.piece.constructor.name === "Rook" &&
               cell.piece.x === this.x &&
               cell.piece.y !== this.y &&
               !cell.piece.hasMoved
               
         )
         // now we can check for left side castling and right side castling
         for (const rook of rooks) {
            if (!rook) continue
            // const rookX = rook.x
            // const rookY = rook.y
            // check if the path between the king and the rook is clear
            // const pathClear = this.isPathClear(this.x, this.y, rookX, rookY)
            if (true) {
               // check if the king is not in check after castling
               const newKingX = this.owner === "white" ? this.x + 2 : this.x - 2
               const newKingY = this.y
               if (this.isValidMove(newKingX, newKingY)) {
                  moves.push({ x: newKingX, y: newKingY })
               }
            }
         }
         


      }

      return moves
   }

}