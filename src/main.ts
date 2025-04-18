import { io } from 'socket.io-client'
import Board from './classes/Board.ts'
import './style.css'
import {
   fillSessionStorage,
   flipBoard,
   getCell,
   getPiece,
   reassessBoardCells,
   restartGame,
   switchPlayers,
} from './utils/utils.ts'
import {
   resetDragStartEvent,
   dragStartHandler,
   dropHandler,
   dragEndLeaveHandler,
   dragOverHandler,
} from './utils/drag_drop.ts'
import SessionStorageUtil, {
   CHESS_MOVES_KEY,
   ChessMove,
} from './utils/sessionStorage.ts'
import Piece from './classes/Piece.ts'

export const socket = io('http://localhost:4004', {
   withCredentials: true,
})

export const board = new Board()
const appDom = document.querySelector('#app') as HTMLElement
const restartBtn = document.querySelector('#restart') as HTMLButtonElement
const joinBtn = document.querySelector('#join') as HTMLButtonElement
const redoBtn = document.querySelector('#redo') as HTMLButtonElement
setupBoard(appDom)

export function setupBoard(root: HTMLElement) {
   SessionStorageUtil.saveData<ChessMove[]>(CHESS_MOVES_KEY, [])
   appDom.innerHTML = ''
   board.renderBoard(root)
}

window.addEventListener('load', () => {
   socket.on('game_full', (message: string) => {
      alert(message)
   })
   socket.on('flip_board', (idx) => {
      if (idx != 1) return
      flipBoard()
   })
   socket.on('move', (data) => {
      //piece =
      const { piece, targetCell } = data
      const pieceObj = getPiece(piece.x, piece.y) // get the piece object that is being moved
      const targetCellObj = getCell(targetCell.x, targetCell.y) // get the target cell object
      const targetPieceObj = targetCellObj?.piece // get the target piece object
      const possibleBeatenPiece = targetPieceObj
      const targetCellDom = document.querySelector(
         `#cell-${targetCell.x}-${targetCell.y}`
      )! as HTMLElement // get the actual DOM element of the cell that is being moved TO
      const originalCellDom = document.querySelector(
         `#cell-${piece.x}-${piece.y}`
      ) as HTMLElement // get the actual DOM element of the cell that is being moved FROM
      const originalCell = getCell(piece.x, piece.y)! // get the actual cell object of the cell that is being moved FROM

      if (!pieceObj || !targetCellObj) return

      //If the target cell is occupied we can assume that the piece is being captured since validation is done on the other client side
      targetCellDom.querySelector('img')?.remove()
      originalCellDom.querySelector('img')?.remove()

      //Update the piece position
      const mergeCell = board.cells.find((cell) => {
         return cell.x === piece.x && cell.y === piece.y
      })
      reassessBoardCells(
         mergeCell!,
         targetCellObj,
         pieceObj,
         targetCell.x,
         targetCell.y,
         targetCellDom
      )
      resetDragStartEvent()
      switchPlayers()
      fillSessionStorage(
         pieceObj,
         targetCellObj,
         originalCell,
         possibleBeatenPiece
      )
   })
   socket.on('restart', (id) => {
      restartGame(appDom)
      if (id !== socket.id) {
         console.log(id, socket.id)
         flipBoard()
      }
   })
   socket.on('success', (msg: string) => {
      alert(msg)
      ;(document.querySelector('#app') as HTMLElement)!.style.pointerEvents =
         'all'
   })
   socket.on('redo_move', (lastMove: ChessMove) => {
      const { from, piece, pieceBeaten, pieceId: _, to } = lastMove
      const oldCell = getCell(from.x, from.y)!
      const targetCell = getCell(to.x, to.y)!

      const pieceObj = getPiece(piece.x, piece.y)!
      let pieceBeatenObj: Piece | undefined
      if (pieceBeaten){
         const {imageSrc, owner, x, y} = pieceBeaten
         pieceBeatenObj = new Piece(x, y, imageSrc, owner)
      }
      oldCell.piece = pieceObj
      targetCell.piece = pieceBeatenObj

      pieceObj.x = from.x
      pieceObj.y = from.y

      const targetCellDom = document.querySelector(
         `#cell-${to.x}-${to.y}`
      )! as HTMLElement
      const oldCellDom = document.querySelector(
         `#cell-${from.x}-${from.y}`
      ) as HTMLElement
      targetCellDom.querySelector('img')?.remove()
      pieceObj?.renderPiece(oldCellDom)
      pieceBeatenObj?.renderPiece(targetCellDom)
      switchPlayers()




      //get rid of last element in session storage
      const lastMoveArray =
         SessionStorageUtil.getData<ChessMove[]>(CHESS_MOVES_KEY) ?? []
      const newMoveArray = lastMoveArray.splice(0, lastMoveArray.length - 1)
      SessionStorageUtil.saveData<ChessMove[]>(CHESS_MOVES_KEY, newMoveArray)
      resetDragStartEvent()
   })
})

//PANEL BUTTON EVENTS
restartBtn.addEventListener('click', () => {
   socket.emit('restart', socket.id)
   restartGame(appDom)
})
joinBtn.addEventListener('click', () => {
   socket.emit('join')
})
redoBtn.addEventListener('click', () => {
   const lastMoveArray =
      SessionStorageUtil.getData<ChessMove[]>(CHESS_MOVES_KEY) ?? []
   if (!lastMoveArray.length) return console.log('no moves to redo')
   socket.emit('redo_move', lastMoveArray[lastMoveArray.length - 1])
   
})

//FIRST INIT OF DRAG AND DROP
const cells = [...document.querySelectorAll('.cell')] as HTMLElement[]
const pieces = [...document.querySelectorAll('.piece')] as HTMLElement[]
pieces.forEach((piece) => {
   piece.addEventListener('dragstart', dragStartHandler)
})
cells.forEach((cell) => {
   cell.addEventListener('dragover', dragOverHandler)
   cell.addEventListener('dragleave', dragEndLeaveHandler)
   cell.addEventListener('dragend', dragEndLeaveHandler)
   cell.addEventListener('drop', dropHandler)
})
