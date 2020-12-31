import {useState, useEffect, useCallback} from 'react';

import {useWS} from "./ws";

export function useBoard() {
    const {ws, isWs} = useWS()

    const [map, setMap] = useState(null)
    const [steps, setSteps] = useState([])

    useEffect(() => {
        let unsubscribe;

        function listenMessage(ev) {
            try {
                const parsedData = JSON.parse(ev.data);

                console.log(parsedData)
                if (parsedData.payload?.map) {
                    setMap(() => parsedData.payload.map)
                }

                if (parsedData.payload?.steps) {
                    setSteps(() => parsedData.payload.steps)
                }
            } catch (e) {
                console.log(e)
            }
        }

        if (ws && isWs) {
            unsubscribe = ws.subscribeMessage(listenMessage)
            ws.send(JSON.stringify({type: 'getBoardState'}))
        }

        return unsubscribe
    }, [ws, isWs, setSteps, setMap])

    const handleClear = useCallback(() => {
        if (ws && isWs) {
            ws.send(JSON.stringify({ type: 'clearBoard' }))
        }
    }, [ws, isWs])

    const handleStep = useCallback((field) => {
        if (ws && isWs) {
            if(steps.length === 0) {
                ws.send(JSON.stringify({type: 'firstStep', payload: { field }}))
            } else {
                ws.send(JSON.stringify({type: 'step', payload: { field, prevStepId: steps.slice(-1)[0]?.id }}))
            }
        }
    }, [ws, isWs, steps])

    return {map, steps, handleClear, handleStep}
}
