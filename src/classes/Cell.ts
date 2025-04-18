import Piece from "./Piece";

export default class Cell{
   constructor(public x: number, public y: number, public className: string, public piece: Piece | undefined){
      this.x = x;
      this.y = y;
      this.className = className;
      this.piece = piece ?? undefined;
   }

   appendToBoard(board: HTMLElement){
      const cell = document.createElement('div');
      cell.className = this.className;
      cell.id = `cell-${this.x}-${this.y}`;
      board.appendChild(cell);

      if (this.piece) {
         this.piece.renderPiece(cell);
      }
   }
}