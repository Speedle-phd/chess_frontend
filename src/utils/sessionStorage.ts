// /C:/Users/shank/Desktop/chess_game/client/src/utils/sessionStorage.ts

import Piece from "../classes/Piece";

export default class SessionStorageUtil {
   static saveData<T>(key: string, data: T): void {
      try {
         const jsonData = JSON.stringify(data);
         sessionStorage.setItem(key, jsonData);
      } catch (error) {
         console.error("Error saving data to sessionStorage:", error);
      }
   }

   static getData<T>(key: string): T | null {
      try {
         const jsonData = sessionStorage.getItem(key);
         if (!jsonData) return null;
         return JSON.parse(jsonData) as T;
      } catch (error) {
         console.error("Error retrieving data from sessionStorage:", error);
         return null;
      }
   }
}

// Example usage for storing chess moves
export type MoveCoords = {
   x: number;
   y: number;
}
export type ChessMove = {
   from: MoveCoords;
   to: MoveCoords;
   piece: Piece;
   pieceId: string;
   pieceBeaten: Piece | undefined;
};

export const CHESS_MOVES_KEY = "chess_moves";

// Example usage for storing and retrieving chess moves
// Save chess moves
// const moves: ChessMove[] = [
//    { from: "e2", to: "e4", piece: "pawn" },
//    { from: "g8", to: "f6", piece: "knight" },
// ];
// SessionStorageUtil.saveData<ChessMove[]>(CHESS_MOVES_KEY, moves);

// Retrieve chess moves
// const savedMoves = SessionStorageUtil.getData<ChessMove[]>(CHESS_MOVES_KEY);
