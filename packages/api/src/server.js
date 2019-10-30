import createDebug from 'debug';
import http from 'http';

import { PORT } from './config';
import app from './app';

app.set('port', PORT);

const debug = createDebug('vm-parse:api');
const server = http.createServer(app);

server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof PORT === 'string'
        ? `Pipe ${PORT}`
        : `Port ${PORT}`;

    switch (error.code) {
        case 'EACCES':
            debug(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            debug(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}
