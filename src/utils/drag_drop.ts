import { socket } from "../main"
import { fillSessionStorage, getCell, getPiece, handleCellOccupation, reassessBoardCells, switchPlayers } from "./utils"

export function dropHandler(e: DragEvent) {
   e.preventDefault()
   //getting the data from the drag event
   const data = (e as DragEvent).dataTransfer?.getData('text')
   const { x: oldX, y: oldY, piece } = JSON.parse(data!)
   console.log(oldX, oldY)
   const [x, y] = (e.target as HTMLElement)!
      .closest('.cell')!
      .id.split('-')
      .slice(1)
      .map(Number) //coords of the (new) target cell

   //same cell
   if (x === oldX && y === oldY) return

   //DECLARATIONS
   const targetCell = getCell(x, y) // get the new target cell object
   const targetPieceObj = getPiece(x, y) // get the new target piece object
   const targetCellDom = document.querySelector(
      `#cell-${x}-${y}`
   )! as HTMLElement //getting the new target cell DOM element
   targetCellDom.classList.remove('hover') // removing the hover class
   // getting the old cell object and piece object and DOM element
   const oldCellObj = getCell(oldX, oldY)
   const oldPieceObj = getPiece(oldX, oldY)
   const oldCellDom = document.querySelector(
      `#cell-${oldX}-${oldY}`
   )! as HTMLElement //getting the old cell DOM element
   
   const possibleBeatenPiece = targetCell?.piece // get the possible beaten piece object
   //Check if the target cell is occupied and handle the occupation
   if (possibleBeatenPiece) {
      console.log('cell occupied')
      const isOwnPiece = handleCellOccupation(oldPieceObj!, targetPieceObj!)
      if (isOwnPiece) return
   }
   


   oldCellDom?.querySelector('img')?.remove()
   if (!targetCell || !oldCellObj || !oldPieceObj) return

   reassessBoardCells(oldCellObj, targetCell, oldPieceObj, x, y, targetCellDom)
   resetDragStartEvent()
   switchPlayers()

   fillSessionStorage(oldPieceObj, targetCell, oldCellObj, possibleBeatenPiece)


   socket.emit('move', { piece, targetCell })
}

export function dragStartHandler(e: DragEvent) {
   console.log("dragStart")
   const underlyingCell = (e.target as HTMLElement)?.closest('.cell')!
   const [x, y] = underlyingCell?.id.split('-').slice(1).map(Number)
   const cell = getCell(x, y)
   const piece = cell?.piece
   e.dataTransfer?.setData('text/plain', JSON.stringify({ x, y, piece }))
}

export function dragEndLeaveHandler(e: DragEvent) {
   e.preventDefault()
   ;(e.target as HTMLElement)?.closest('.cell')!.classList.remove('hover')
}

export function dragOverHandler(e: DragEvent) {
   e.preventDefault()
   ;(e.target as HTMLElement)?.closest('.cell')!.classList.add('hover')
}

export function resetDragStartEvent() {
   const pieces = [...document.querySelectorAll('.piece')] as HTMLElement[]
   const cells = [...document.querySelectorAll('.cell')] as HTMLElement[]
   pieces.forEach((p) => {
      p.removeEventListener('dragstart', dragStartHandler)
      p.addEventListener('dragstart', dragStartHandler)
   })
   cells.forEach((c) => {
      c.removeEventListener('drop', dropHandler)
      c.addEventListener('drop', dropHandler)
      c.removeEventListener('dragover', dragOverHandler)
      c.removeEventListener('dragleave', dragEndLeaveHandler)
      c.removeEventListener('dragend', dragEndLeaveHandler)
      c.addEventListener('dragover', dragOverHandler)
      c.addEventListener('dragleave', dragEndLeaveHandler)
      c.addEventListener('dragend', dragEndLeaveHandler)
   })
}

