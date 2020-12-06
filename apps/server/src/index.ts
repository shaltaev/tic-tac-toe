import {readFileSync} from 'fs';
import {createServer, Server} from 'https';
import {join} from 'path';
import {createServer as WSServer, Connection} from 'sockjs';

import {Board} from './lib/board';

const ticTacToeBoard = Board.getInstance();

const httpsServer: Server = createServer({
  cert: readFileSync(join(__dirname, '../ssl/cert.pem')),
  key: readFileSync(join(__dirname, '../ssl/key.pem')),
});

const wsServer = WSServer();

let connPool: Connection[] = [];

const handleFirstStep = (payload, connection) => {
  const data = ticTacToeBoard.firstStep(payload);
  const serialized = JSON.stringify({type: 'firstStepIsHappen', payload: data.payload})
  if (data.result) {
    connPool.forEach(c => c.write(serialized))
  } else {
    connection.write(JSON.stringify({type: 'yourFirstStepIsFailed', payload: data.payload}))
  }
}

const handleStep = (payload, connection) => {
  const data = ticTacToeBoard.newStep(payload);
  const serialized = JSON.stringify({type: 'stepIsHappen', payload: data.payload})
  if (data.result) {
    connPool.forEach(c => c.write(serialized))
  } else {
    connection.write(JSON.stringify({type: 'yourStepIsFailed', payload: data.payload}))
  }
}

const handleClear = () => {
  const data = ticTacToeBoard.clear()
  if (data.result) {
    const serialized = JSON.stringify({type: 'mapIsCleared', payload: data.payload})
    connPool.forEach(c => c.write(serialized))
  }
}

const handleGetBoardState = (connection) => {
  connection.write(JSON.stringify(getCurrentMapState()))
}

const getCurrentMapState = () => ({type: 'currentMap', payload: {map: ticTacToeBoard.getMap(), step: ticTacToeBoard.getLastStep()}})

wsServer.on('connection', (connection: Connection) => {
  connPool = [...connPool, connection];

  connection.write(JSON.stringify(getCurrentMapState()))

  connection.on('data', message => {
    try {
      const parsedData = message[0] === '{' ? JSON.parse(message) : message;
      if (typeof parsedData === 'string') {
        switch (message) {
          case 'ping':
            connection.write('pong');
            break;
          default:
            connection.write('I\'m not understand you');
        }
      } else {
        switch (parsedData.type) {
          case 'firstStep':
            handleFirstStep(parsedData.payload, connection)
            break;
          case 'newStep':
            handleStep(parsedData.payload, connection);
            break;
          case 'clearBoard':
            handleClear();
            break;
          case 'getBoardState':
            handleGetBoardState(connection);
            break;
          default:
            connection.write(JSON.stringify({ type: 'error', payload: { message: 'Unknown request' } }));
        }
      }
    } catch (e) {
      console.log(e)
    }
  });

  connection.on('close', () => {
    connPool = connPool.filter(c => c !== connection)
  });
});

wsServer.installHandlers(httpsServer);

httpsServer.listen(5000);
