import {useWS} from "../use/ws";

export function PingButton() {
    const {ws, isWs} = useWS()

    function handleClick() {
        ws?.send(JSON.stringify({ type: 'ping' }))
    }

    return (
        <button onClick={handleClick} disabled={!isWs}>Ping</button>
    )
}
