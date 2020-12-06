import {useGameWS} from "./game_ws";
import {useEffect, useState} from "react";
import {FirstStep, Step, TicTacMap} from "../models";

export const useBoardState = () => {
    const {ws, isWs} = useGameWS();
    const [board, setBoard] = useState<TicTacMap | []>([])
    const [step, setStep] = useState<Step | FirstStep | null>(null)

    useEffect(() => {
        let unsubscribe = () => {
        }

        function listen(ev: MessageEvent) {
            try {
                const parsedData = ev.data[0] === '{' ? JSON.parse(ev.data) : ev.data;
                if (parsedData.payload?.map) {
                    setBoard(parsedData.payload?.map)
                }
                if (parsedData.payload?.step) {
                    setStep(parsedData.payload?.step)
                }
            } catch (e) {
                console.log(e)
            }
        }

        if (ws && isWs) {
            unsubscribe = ws.subscribeMessage(listen)
        }

        return unsubscribe;
    }, [isWs, step])

    return {ws, isWs, board, step}
}
