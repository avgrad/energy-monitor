# energy-monitor

A web-app to monitor energy consumption with smart home plugs / sockets.

## Development

- `npm install` install dependencies
- `npm run dev` run server AND client in Development mode
- `npm run server:dev` run server in development mode (default port `3001`)
- `npm run client:dev` run client in development mode (default port `3000`)

Server port is configurable with the `PORT` environment variable or an `.env` file.

### Production

- `npm run build` will build client and server to `/dist/`
- `npm run start` will start the server from `/dist/` (includes serving the client form `/dist/app`)
