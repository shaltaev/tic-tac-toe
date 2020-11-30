import React, { useRef, useEffect } from 'react';

import { GameWSConnector } from "../api/gameWS";

export const GamePage = () => {
    const ws = useRef<GameWSConnector | null>(null);

    useEffect(() => {
        ws.current = new GameWSConnector();
        ws.current?.connect({
            handleOpen: () => {},
            handleClose: () => {},
            handleError: () => {},
            handleMessage: (msgEv) => {
                console.log(msgEv)
            },
        })

        return () => {
            ws.current?.close();
        }
    }, [])

    const handleClickPing = () => {
        ws.current?.sendMessage('ping');
    }

    const handleClickHello = () => {
        ws.current?.sendMessage('hello');
    }

    return <>
        <h1>Game</h1>
        <button onClick={handleClickPing}>ping</button>
        <button onClick={handleClickHello}>hello</button>
    </>
}
