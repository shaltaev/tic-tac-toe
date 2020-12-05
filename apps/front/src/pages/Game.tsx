import React, {useRef, useEffect} from 'react';

import {GameWS} from "../api/game_ws";

export const GamePage = () => {
    const ws = useRef<GameWS | null>(null);

    useEffect(() => {
        ws.current = new GameWS();
        ws.current?.setConfig({
            handleOpen: () => {
            },
            handleClose: () => {
            },
            handleError: () => {
            },
            handleMessage: (msgEv) => {
                console.log(msgEv)
            }
        })
        ws.current?.connect()

        return () => {
            ws.current?.close();
        }
    }, [])

    const handleClickPing = () => {
        ws.current?.send('ping');
    }

    return (
        <>
            <h1>Game</h1>
            <button onClick={handleClickPing}>ping</button>
        </>
    )
}
