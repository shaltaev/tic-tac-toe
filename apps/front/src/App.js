import {ConnectButton} from "./components/ConnectButton";
import {PingButton} from "./components/PingButton";
import {CloseButton} from "./components/CloseButton";
import {Board} from "./components/Board";

function App() {

    return (
        <>
            <div>
                <ConnectButton/>
                <PingButton/>
                <CloseButton/>
            </div>
            <div>
                <Board />
            </div>
        </>
    );
}

export default App;
