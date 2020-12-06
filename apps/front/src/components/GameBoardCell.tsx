import React, {FC} from "react";

import {CellValues} from "../models";
import {useBoardState} from "../use/board_state";

export const Cell: FC<{ cell: CellValues, field: number }> = ({cell, field}) => {
    const {ws, board, step, isWs} = useBoardState();


    const handleStep = () => {
        const isMapEmpty = board.every(f => f === CellValues.None);

        if (ws && isWs) {
            if (isMapEmpty) {
                ws.send(JSON.stringify({type: 'firstStep', payload: {field}}))
            } else {
                if (step) {
                    ws.send(JSON.stringify({type: 'newStep', payload: {field, prevStepId: step.id}}))
                }
            }
        }
    }

    return (
        <li className="w-12 h-12 align-middle">
            {cell === CellValues.None ?
                <button onClick={handleStep}
                        className="block cursor-pointer bg-blue-200 w-full h-full border border-blue-400"/> :
                <div className="block bg-red-50 w-full h-full border border-red-200 text-center center">{cell}</div>}
        </li>
    );
};
