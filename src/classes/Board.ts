import Cell from "./Cell";
import Piece from './Piece'
import pawn_b from '../assets/pawn_b.png'
import pawn_w from '../assets/pawn_w.png'
import knight_b from '../assets/knight_b.png'
import knight_w from '../assets/knight_w.png'
import bishop_b from '../assets/bishop_b.png'
import bishop_w from '../assets/bishop_w.png'
import rook_b from '../assets/rook_b.png'
import rook_w from '../assets/rook_w.png'
import queen_b from '../assets/queen_b.png'
import queen_w from '../assets/queen_w.png'
import king_b from '../assets/king_b.png'
import king_w from '../assets/king_w.png'
import Pawn from "./Pawn";
import Knight from "./Knight";
import Bishop from "./Bishop";
import Rook from "./Rook";
import Queen from "./Queen";
import King from "./King";

export default class Board{
   public cells: Cell[];
   constructor(){
      this.cells = [];
   }

   renderBoard(root: HTMLElement){
      this.cells = [] // Reset cells array
      const board = document.createElement('div')
      board.className = 'board reverse_board'
      root.appendChild(board)

      for (let i = 0; i < 8; i++) {
         for (let j = 0; j < 8; j++) {
            const owner = i < 4 ? 'white' : 'black'

            let pieceQuality: string | undefined = this.getPieceStartingPosition(
               owner,
               i,
               j
            )
            //distinguish pieces
         
            const piece = this.distinguishPieces(i, j, pieceQuality, owner)

            const className = (i + j) % 2 === 0 ? 'cell white' : 'cell black'
            const cell = new Cell(i, j, className, piece)
            this.cells.push(cell)
            cell.appendToBoard(board)
         }
      }
      
   }

   distinguishPieces(x: number, y: number, pieceQuality: string | undefined, owner: string) : Piece | undefined {
      switch(pieceQuality){
         case pawn_b:
         case pawn_w:
            return new Pawn(x, y, pieceQuality, owner)
         case knight_b:
         case knight_w:
            return new Knight(x, y, pieceQuality, owner)
         case bishop_b:
         case bishop_w:
            return new Bishop(x, y, pieceQuality, owner)

         case rook_b:
         case rook_w:
            return new Rook(x, y, pieceQuality, owner)

         case queen_b:
         case queen_w:
            return new Queen(x, y, pieceQuality, owner)

         case king_b:
         case king_w:
            return new King(x, y, pieceQuality, owner)
         default:
            return undefined

      }
   }

   getPieceStartingPosition(owner: string, i: number, j: number) : string | undefined {
   if (i === 1) {
      return pawn_w
   } else if (i === 6) {
      return pawn_b
   } else if (i === 0 || i === 7) {
      if (j === 0 || j === 7) {
         return owner === 'white' ? rook_w : rook_b
      } else if (j === 1 || j === 6) {
         return owner === 'white' ? knight_w : knight_b
      } else if (j === 2 || j === 5) {
         return owner === 'white' ? bishop_w : bishop_b
      } else if (j === 4) {
         return owner === 'white' ? queen_w : queen_b
      } else if (j === 3) {
         return owner === 'white' ? king_w : king_b
      }
   } else {
      return undefined
   }
}
}