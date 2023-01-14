import { database } from "./database.js";
import { createServer } from 'http';

const actions = {
  'getAllUsers': () => database.getAllUsers(),
  'getUserByID': (request) => database.getUserByID(request.uuid),
  'createUser' : (request) => database.createUser(request.user),
  'updateUser' : (request) => database.updateUser(request.uuid, request.user),
  'deleteUser' : (request) => database.deleteUser(request.uuid),
}

const DBRequestHandler = (req, res) => {

  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'POST' && req.url === '/api/db') {
    let body = [];
    req.on('data', (chunk) => body.push(chunk));
    req.on('end', () => {
      try {
        body = Buffer.concat(body).toString();
        const request = JSON.parse(body);
        const action = actions[request.action];
        const data = action(request);

        res.writeHead(200);
        res.end(JSON.stringify(data));
      } catch(err) {
        res.writeHead(500);
        res.end();
      }
    })
  }
}

const DBProcess = () => {
  const server = createServer(DBRequestHandler);
  const port = process.env.HTTP_PORT - 1;
  server.listen(port, () => {
    console.log(`Database has been started on port ${port}`);
  })
}

DBProcess();
