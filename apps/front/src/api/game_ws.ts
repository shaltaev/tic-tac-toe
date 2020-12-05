import SockJsClient from 'sockjs-client';

const GAME_SERVER_URL = "https://localhost:5000";

type Listen<T> = (eventData: T) => void;

interface IListenerRegistry {
  close: Listen<CloseEvent>[],
  message: Listen<MessageEvent>[],
}

class GameWS {
  private static instance: GameWS;
  private wsConnect: WebSocket | null = null;

  isWsReady: boolean = false;

  private listenerRegistry: IListenerRegistry = {
    close: [],
    message: [],
  }

  private constructor() {
    this.connect();
  }

  public static getInstance(): GameWS {
    if (!GameWS.instance) {
      GameWS.instance = new GameWS();
    }

    return GameWS.instance;
  }

  subscribeClose(handler: Listen<CloseEvent>): () => void {
    this.listenerRegistry.close = [...this.listenerRegistry.close, handler]
    return () => {
      this.listenerRegistry.close = this.listenerRegistry.close.filter(h => h !== handler)
    }
  }

  subscribeMessage(handler: Listen<MessageEvent>): () => void {
    this.listenerRegistry.message = [...this.listenerRegistry.message, handler]
    return () => {
      this.listenerRegistry.message = this.listenerRegistry.message.filter(h => h !== handler)
    }
  }

  private connect() {
    if (!this.wsConnect) {
      const gameWebSocketTemp = new SockJsClient(GAME_SERVER_URL);

      gameWebSocketTemp.onclose = (ev) => {
        this.listenerRegistry.close.forEach(l => l(ev))
      }
      gameWebSocketTemp.onmessage = (ev) => {
        this.listenerRegistry.message.forEach(l => l(ev))
      }

      this.waitSocketIsReady(gameWebSocketTemp);
    }
  }

  send(message: any) {
    if(this.wsConnect) {
      this.wsConnect.send(message)
    }
  }

  private waitSocketIsReady(gameWebSocketTemp: WebSocket) {
    setTimeout(() => {
      if(gameWebSocketTemp.readyState === 1) {
        this.wsConnect = gameWebSocketTemp;
        this.isWsReady = true;
      } else {
        this.waitSocketIsReady(gameWebSocketTemp);
      }
    }, 5)
  }
}

export { GameWS }
