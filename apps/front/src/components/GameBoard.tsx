import React, {FC} from "react";

import {TicTacMap} from "../models";
import {useBoardState} from "../use/board_state";
import {ClearGameBoard} from "./ClearGameBoard";
import {ListOfCell} from "./ListOfGameBoardCell";

export const GameBoard: FC = () => {
  const {ws, board, isWs} = useBoardState();

  const handleGetBoardState = () => {
    if (ws && isWs) {
      ws.send(JSON.stringify({type: 'getBoardState'}))
    }
  }

  return (
    <>
      <ClearGameBoard />
      <br />
      {board.length > 0 ?
        <ul className="grid grid-cols-3 gap-2">
          <ListOfCell map={board as TicTacMap}/>
        </ul>
        : <button onClick={handleGetBoardState}>No Map</button>
      }
    </>
  )
};
