import React, {useState, useEffect, useCallback, FC} from "react";

import {GameWS} from "../api/game_ws";
import {useInterval} from "../../use/interval";

const useGameWS = () => {
  const [ws, setWs] = useState<GameWS | null>(null);
  const [isWs, setIsWs] = useState<boolean>(false);

  useEffect(() => {
    if (ws) {
      return;
    }

    setWs(GameWS.getInstance());
  }, [])

  useInterval(() => {
    if(ws && isWs !== ws.isWsReady) {
      setIsWs(ws.isWsReady)
    }
  }, 5)


  return {ws, isWs}
}

export const GamePage: FC<{ num: number }> = ({ num }) => {
  const {ws, isWs} = useGameWS();

  useEffect(() => {
    let unsubscribe = () => {}
    function listen (ev: MessageEvent) {
      console.log({num, data: ev.data })
    }

    if(ws && isWs) {
      unsubscribe = ws.subscribeMessage(listen)
    }

    return unsubscribe;
  }, [isWs, num])

  return (
    <>
      <h1>Game</h1>
      { isWs ? 'true' : 'false'}
      <br/>
      <button onClick={() => ws?.send('ping')} disabled={!isWs}>ping</button>
      <button onClick={() => ws?.send('hm')} disabled={!isWs}>hm</button>
    </>
  )
}
