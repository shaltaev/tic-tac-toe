import { createServer } from 'http'
import { createServer as createSocketServer } from 'sockjs'

import { Board } from './lib/board.mjs'

const httpServer = createServer()
const socketServer = createSocketServer()

let poolOfClient = []

socketServer.on('connection', connection => {
    poolOfClient = [...poolOfClient, connection]

    connection.on('close', () => {
        poolOfClient = poolOfClient.filter(c => c !== connection)
    })

    connection.on('data', msg => {
        try {
            const parsedData = JSON.parse(msg)
            switch (parsedData.type) {
                case 'ping':
                    handlePing(connection);
                    break;
                case 'firstStep':
                    handleFirstStep(connection, parsedData.payload);
                    break;
                case 'step':
                    handleStep(connection, parsedData.payload);
                    break;
                case 'clearBoard':
                    handleClear();
                    break;
                case 'getBoardState':
                    handleGetBoardState(connection);
                    break;
                default:
                    handleDefault(connection);
            }
        } catch (e) {
            console.log(e)
        }
    })
})

socketServer.installHandlers(httpServer)

httpServer.listen(5000)

function handlePing(connection) {
    connection.write(JSON.stringify({ type: 'pong' }))
}

function handleDefault(connection) {
    connection.write(JSON.stringify({ type: 'UNKNOWN' }))
}

function handleFirstStep(connection, payload) {
    const board = Board.getInstance()

    const { result } = board?.firstStep(payload)

    const boardStatus = board?.getCurrentGameState();

    if(result) {
        const message = JSON.stringify({ type: 'firstStepIsHappen', payload: boardStatus })
        poolOfClient.forEach(conn => conn.write(message))
    } else {
        const message = JSON.stringify({ type: 'yourFirstStepIsFailed', payload: boardStatus })
        connection.write(message)
    }
}

function handleStep(connection, payload) {
    const board = Board.getInstance()

    const { result } = board?.step(payload)

    const boardStatus = board?.getCurrentGameState();

    if(result) {
        const message = JSON.stringify({ type: 'stepIsHappen', payload: boardStatus })
        poolOfClient.forEach(conn => conn.write(message))
    } else {
        const message = JSON.stringify({ type: 'yourStepIsFailed', payload: boardStatus })
        connection.write(message)
    }
}

function handleClear() {
    const board = Board.getInstance()

    board?.clear();

    const message = JSON.stringify({ type: 'mapIsCleared', payload: board?.getCurrentGameState() })
    poolOfClient.forEach(conn => conn.write(message))
}

function handleGetBoardState(connection) {
    const board = Board.getInstance()

    connection.write(JSON.stringify({ type: 'boardState', payload: board?.getCurrentGameState() }))
}
