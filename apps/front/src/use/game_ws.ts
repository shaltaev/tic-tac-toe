import {useEffect, useState} from "react";

import {GameWS} from "../api/game_ws";
import {useInterval} from "./interval";

export const useGameWS = () => {
    const [ws, setWs] = useState<GameWS | null>(null);
    const [isWs, setIsWs] = useState<boolean>(false);

    useEffect(() => {
        if (ws) {
            return;
        }

        setWs(GameWS.getInstance());
    }, [])

    useInterval(() => {
        if (ws && isWs !== ws.isWsReady) {
            setIsWs(ws.isWsReady)
        }
    }, 5)


    return {ws, isWs}
}
