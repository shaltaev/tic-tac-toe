import React, {FC, useEffect} from "react";

import {useGameWS} from "../use/game_ws";

export const TryConnect: FC<{ num: number }> = ({ num }) => {
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
    <div className="flex flex-row h-12">
      <span className="h-full p-2">ws: { isWs ? 'true' : 'false'}</span>
      <button className="h-full p-2" onClick={() => ws?.send('ping')} disabled={!isWs}>ping</button>
      <button className="h-full p-2" onClick={() => ws?.send('hm')} disabled={!isWs}>hm</button>
    </div>
  )
}
