import {useWS} from "../use/ws";

export function ConnectButton() {
    const {ws, isWs} = useWS()

    function handleClick() {
        ws?.connect()
    }
    
    return (
        <button onClick={handleClick} disabled={isWs}>Connect</button>
    )
}
