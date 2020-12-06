import {useGameWS} from "./game_ws";
import {useEffect, useState} from "react";
import {FirstStep, Step, TicTacMap} from "../models";

export const useBoardState = () => {
    const {ws, isWs} = useGameWS();
    const [board, setBoard] = useState<TicTacMap | null>(null)
    const [steps, setSteps] = useState<(FirstStep | Step)[] | null>(null)
    const [currentStepId, setCurrentStepId] = useState<number | null>(null)

    useEffect(() => {
      if(ws && isWs) {
        ws.send(JSON.stringify({type: 'getBoardState'}))
      }
    }, [ws, isWs])

    useEffect(() => {
      if(steps) {
        steps.length === 0 ?
          setCurrentStepId(() => null) :
          setCurrentStepId(() => steps.slice(-1)[0].id)
      }
    }, [steps])

    useEffect(() => {
        let unsubscribe = () => {
        }

        function listen(ev: MessageEvent) {
            try {
                const parsedData = ev.data[0] === '{' ? JSON.parse(ev.data) : ev.data;
                if (parsedData.payload?.map) {
                    setBoard(() => parsedData.payload?.map)
                }
                if (parsedData.payload?.steps) {
                    setSteps(() => parsedData.payload?.steps)
                }
            } catch (e) {
                console.log(e)
            }
        }

        if (ws && isWs) {
            unsubscribe = ws.subscribeMessage(listen)
        }

        return unsubscribe;
    }, [isWs, steps])

    return {ws, isWs, board, steps, currentStepId}
}
