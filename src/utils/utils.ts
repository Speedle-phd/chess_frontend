import Cell from '../classes/Cell.ts'
import Piece from '../classes/Piece.ts'
import { board, setupBoard } from '../main.ts'
import { resetDragStartEvent } from './drag_drop.ts'
import SessionStorageUtil, { ChessMove, CHESS_MOVES_KEY } from './sessionStorage.ts'

//get a specific cell from the board

export function getCell(x: number, y: number): Cell | undefined {
   const cell = board.cells.find((cell) => {
      return cell.x === x && cell.y === y
   })
   return cell
}

export function getPiece(x: number, y: number): Piece | undefined {
   const cell = getCell(x, y)
   return cell?.piece ?? undefined
}

export function handleCellOccupation(movingPiece: Piece, targetPiece: Piece) {
   if (!targetPiece || !movingPiece) return false
   if (movingPiece?.owner === targetPiece?.owner) {
      console.log('same owner')
      return true
   }
   // remove the target piece from the board
   const cellDom = document.getElementById(
      `cell-${targetPiece?.x}-${targetPiece?.y}`
   )
   if (cellDom) {
      cellDom.innerHTML = ''
      // remove the target piece from the board array
      const mergingCell = board.cells.find((cell) => {
         return !(cell.x === targetPiece?.x && cell.y === targetPiece?.y)
      })
      if (mergingCell) {
         mergingCell.piece = undefined
      }
   }
}

export function reassessBoardCells(
   oldCell: Cell,
   newCell: Cell,
   movingPiece: Piece,
   x: number,
   y: number,
   newCellDom: HTMLElement
) {
   newCell.piece = movingPiece
   oldCell.piece = undefined
   movingPiece.renderPiece(newCellDom)
   movingPiece.x = x
   movingPiece.y = y
   movingPiece.hasMoved = true
}

export function switchPlayers() {
   const display = document.querySelector('#turn') as HTMLElement
   const currentPlayer = display.innerText.toLowerCase().split("'")[0]
   const nextPlayer = currentPlayer === 'white' ? 'Black' : 'White'
   display.querySelector('span')!.innerText = `${nextPlayer}'s turn`
   const colorValue = nextPlayer === 'Black' ? '#000' : '#fff'
   console.log(colorValue)
   display.style.setProperty('--turn-color', colorValue)
}

export function restartGame(root: HTMLElement) {
   setupBoard(root)
   const display = document.querySelector('#turn') as HTMLElement
   display.querySelector('span')!.innerText = `White's turn`
   display.style.setProperty('--turn-color', '#fff')
   resetDragStartEvent()
}

export function flipBoard() {
   const board = document.querySelector('.board') as HTMLElement
   console.log([...board.classList])
   board.classList.toggle('reverse_board')
}

export function fillSessionStorage(pieceObj: Piece, targetCell: Cell, oldCell: Cell, pieceBeaten: Piece | undefined) {
   const oldSessionData =
      SessionStorageUtil.getData<ChessMove[]>(CHESS_MOVES_KEY) ?? []
   const newMove: ChessMove = {
      from: { x: oldCell.x, y: oldCell.y },
      to: { x: targetCell.x, y: targetCell.y },
      piece: pieceObj,
      pieceId: pieceObj.id,
      pieceBeaten
   }
   SessionStorageUtil.saveData<ChessMove[]>(CHESS_MOVES_KEY, [
      ...oldSessionData,
      newMove,
   ])
   console.log(SessionStorageUtil.getData<ChessMove[]>(CHESS_MOVES_KEY))
}
