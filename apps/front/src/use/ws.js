import {useEffect, useState} from 'react'

import {WS} from "../api/ws";
import {useInterval} from "./interval";

export function useWS() {
    const [ws, setWS] = useState(null)
    const [isWs, setIsWS] = useState(null)

    useEffect(() => {
        if (ws) {
            return;
        }

        setWS(WS.getInstance())
    }, [])

    useInterval(() => {
        if(ws && isWs !== ws.isWsReady) {
            setIsWS(ws.isWsReady)
        }
    }, 5)

    return {ws, isWs}
}
