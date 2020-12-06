import React, {FC, useCallback} from "react";

import {CellValues} from "../models";
import {useBoardState} from "../use/board_state";

const CellButton: FC<{ onClick: React.DOMAttributes<HTMLButtonElement>["onClick"] }> = ({onClick}) => <button onClick={onClick}
                                                                                                              className="block cursor-pointer bg-blue-200 w-full h-full border border-blue-400"/>

export const Cell: FC<{ cell: CellValues, field: number }> = ({cell, field}) => {
  const {ws, isWs, currentStepId} = useBoardState();

  const handleStep = useCallback(() => {
    if (ws && isWs) {
      if (currentStepId === null) {
        ws.send(JSON.stringify({type: 'firstStep', payload: {field}}))
      } else {
        ws.send(JSON.stringify({type: 'newStep', payload: {field, prevStepId: currentStepId}}))
      }
    }
  }, [currentStepId, ws, isWs])

  return (
    <li className="w-12 h-12 align-middle">
      {cell === CellValues.None ?
        <CellButton onClick={handleStep}/> :
        <div className="block bg-red-50 w-full h-full border border-red-200 text-center center">{cell}</div>}
    </li>
  );
}
;
