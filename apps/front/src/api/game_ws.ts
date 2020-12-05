import SockJsClient from 'sockjs-client';

const GAME_SERVER_URL = "https://localhost:5000";

type Listen<T> = (eventData: T) => void;

interface IConnectConfig {
    handleOpen: Listen<Event>;
    handleClose: Listen<CloseEvent>;
    handleMessage: Listen<MessageEvent>;
    handleError: Listen<Event>;
}

class GameWS {
    private wsConnect: WebSocket | null = null;
    private currentConnectionConfig: IConnectConfig | null = null;

    constructor() {
    }

    setConfig(config: IConnectConfig): boolean {
        if (!this.wsConnect) {
            this.currentConnectionConfig = config;
            return true;
        }
        return false;
    }

    get(): WebSocket | null {
        return this.wsConnect
    }

    connect() {
        if (this.currentConnectionConfig) {
            const gameWebSocketTemp = new SockJsClient(GAME_SERVER_URL);
            let openEv: Event | null = null;

            gameWebSocketTemp.onopen = (ev: Event) => {
                openEv = ev;
            };
            gameWebSocketTemp.onclose = this.currentConnectionConfig.handleClose;
            gameWebSocketTemp.onmessage = this.currentConnectionConfig.handleMessage;
            gameWebSocketTemp.onerror = this.currentConnectionConfig.handleError;

            this.waitSocketIsReady(gameWebSocketTemp, openEv);
        }
    }

    send(message: any) {
        if (this.wsConnect) {
            this.wsConnect.send(message);
        }
    }

    close() {
        if (this.wsConnect) {
            this.wsConnect.close()
            this.wsConnect = null
            this.currentConnectionConfig = null
        }
    }

    private waitSocketIsReady(gameWebSocketTemp: WebSocket, openEv: Event | null) {
        setTimeout(() => {
            if(gameWebSocketTemp.readyState === 1) {
                this.wsConnect = gameWebSocketTemp;
                if(openEv && this.currentConnectionConfig) {
                    this.currentConnectionConfig.handleOpen(openEv);
                }
            } else {
                this.waitSocketIsReady(gameWebSocketTemp, openEv);
            }
        }, 5)
    }

}

export { GameWS, IConnectConfig }
