import React, {FC} from "react";

import {useGameWS} from "../use/game_ws";

export const ClearGameBoard: FC = () => {
    const {ws, isWs} = useGameWS();

    const handleClearBoard = () => {
        if (ws && isWs) {
            ws.send(JSON.stringify({type: 'clearBoard'}))
        }
    }

    return (
        <button onClick={handleClearBoard}>
            Clear
        </button>
    );
}
