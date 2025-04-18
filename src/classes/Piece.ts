export default class Piece {
   private className: string
   public hasMoved: boolean = false
   readonly id: string
   constructor(
      public x: number,
      public y: number,
      readonly imageSrc: string | undefined,
      readonly owner: string
   ) {
      this.x = x
      this.y = y
      this.id = `${x}${y}`
      this.className = 'piece ' + owner
      this.imageSrc = imageSrc
      this.owner = owner
   }

   renderPiece(cell: HTMLElement) {
      if (!this.imageSrc) {
         return
      }
      const pieceElement = document.createElement('img')
      pieceElement.className = this.className
      pieceElement.draggable = true
      pieceElement.src = this.imageSrc
      pieceElement.alt = 'piece'
      pieceElement.id = this.id
      cell.appendChild(pieceElement)
   }
   isValidMove(x: number, y: number): boolean {
      // Check if the move is within the bounds of the board
      if (x < 0 || x > 7 || y < 0 || y > 7) {
         return false
      }
      // Check if the cell is occupied by a friendly piece
      const cell = document.getElementById(`cell-${x}-${y}`)

      const targetPiece = cell?.querySelector('.piece')

      if (targetPiece) {
         const targetOwner = targetPiece.className.split(' ')[1]
         if (targetOwner === this.owner) {
            return false
         }
      }
      return true
   }
}