import SockJsClient from 'sockjs-client';

const GAME_SERVER_URL = "https://localhost:5000"

type Listener<T> = (eventData: T) => void;

interface IConfig {
    handleOpen: Listener<Event>;
    handleClose: Listener<CloseEvent>;
    handleMessage: Listener<MessageEvent>;
    handleError: Listener<Event>;
}

class GameWSConnector {
    private wsConnect: WebSocket | undefined;
    private params: IConfig | undefined;

    constructor() {
    }

    connect(params: IConfig) {
        if(this.wsConnect) {
            return this.wsConnect;
        }
        this.params = params;

        const tmpSocket = new SockJsClient(GAME_SERVER_URL);
        let openEv: Event | undefined = undefined;

        tmpSocket.onopen = (ev: Event) => {
            openEv = ev;
        };
        tmpSocket.onclose = this.params.handleClose;
        tmpSocket.onmessage = this.params.handleMessage;
        tmpSocket.onerror = (ev: Event) => {
            if (this.params) {
                this.params.handleError(ev);
            }
        };

        this.waitSocketIsReady(tmpSocket, openEv);
    }

    sendMessage(message: any) {
        if (this.wsConnect) {
            this.wsConnect.send(message);
        }
    }

    close() {
        if (this.wsConnect) {
            this.wsConnect.close();
        }
    }

    private waitSocketIsReady(tmpSocket: WebSocket, openEv: Event | undefined) {
        setTimeout(() => {
            if (tmpSocket.readyState === 1) {
                this.wsConnect = tmpSocket;
                if (openEv && this.params) {
                    this.params.handleOpen(openEv);
                }
            } else {
                this.waitSocketIsReady(tmpSocket, openEv);
            }
        }, 5);
    }
}

export { GameWSConnector, IConfig };
