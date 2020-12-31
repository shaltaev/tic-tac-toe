import {useWS} from "../use/ws";

export function CloseButton() {
    const {ws, isWs} = useWS()

    function handleClick() {
        ws?.close()
    }

    return (
        <button onClick={handleClick} disabled={!isWs}>Close</button>
    )
}
