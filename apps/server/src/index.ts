import { readFileSync } from 'fs';
import { createServer, Server } from 'https';
import { join } from 'path';
import { createServer as WSServer, Connection } from 'sockjs';

const httpsServer: Server = createServer({
    cert: readFileSync(join(__dirname, '../ssl/cert.pem')),
    key: readFileSync(join(__dirname, '../ssl/key.pem')),
});

const wsServer = WSServer();

wsServer.on('connection', (connection: Connection) => {
    connection.on('data', message => {
        try {
            console.log(message, typeof message, message.length);
            switch (message) {
                case 'ping':
                    connection.write('pong');
                    break;
                case 'hello':
                    connection.write('hi!');
                    break;
                default:
                    connection.write('I\'m not understand you');
            }
        } catch (_e) {}
    });

    connection.on('close', () => {
        connection.write('close');
    });
});

wsServer.installHandlers(httpsServer);

httpsServer.listen(5000);
