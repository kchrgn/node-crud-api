import { database } from "../database/database.js";
import { STATUS_CODES } from 'http';
import { validate as uuidValidate } from 'uuid';

export const router = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const reqMethodUrl = `${req.method}:${req.url}`;

  if (req.method === 'GET') {
    if (req.url === '/api/users') {
      const data = JSON.stringify(database.getAllUsers());
      const responseCode = 200; 
      res.writeHead(responseCode);
      res.end(data);
      return;
    }

    if (req.url.match(/\/api\/users\/\.*/)) {
      const uuidFromUrl = req.url.split('/').slice(3).join('/');

      if (!uuidValidate(uuidFromUrl)) {
        const responseCode = 400;
        res.writeHead(responseCode);
        res.end(JSON.stringify(STATUS_CODES[responseCode]));
        return;
      }
      
      const data = JSON.stringify(database.getUserByID(uuidFromUrl));

      if (!data) {
        const responseCode = 404;
        res.writeHead(responseCode);
        res.end(JSON.stringify(STATUS_CODES[responseCode]));
        return;
      }

      const responseCode = 200;
      res.writeHead(responseCode);
      res.end(data);
      return;
    }

    
  }

  if (req.method === 'POST' && req.url === '/api/users') {
    let body = [];
    req.on('data', (chunk) => body.push(chunk));
    req.on('end', () => {
      body = Buffer.concat(body).toString();
      if (!body) {
        const responseCode = 400;
        res.writeHead(responseCode);
        res.end(JSON.stringify(STATUS_CODES[responseCode]));
        return;
      }

      const user = JSON.parse(body);

      if (!user.username || !user.age || !user.hobbies || !Array.isArray(user.hobbies)) {
        const responseCode = 400;
        res.writeHead(responseCode);
        res.end(JSON.stringify(STATUS_CODES[responseCode]));
        return;
      }

      const responseCode = 201;
      res.writeHead(responseCode);
      res.end(JSON.stringify(database.createUser(user)));
    });

    return;
  }

  if (req.method === 'PUT' && req.url.match(/\/api\/users\/\.*/)) {

    const uuidFromUrl = req.url.split('/').slice(3).join('/');

    if (!uuidValidate(uuidFromUrl)) {
      const responseCode = 400;
      res.writeHead(responseCode);
      res.end(JSON.stringify(STATUS_CODES[responseCode]));
      return;
    }

    if (!database.getUserByID(uuidFromUrl)) {
      const responseCode = 404;
      res.writeHead(responseCode);
      res.end(JSON.stringify(STATUS_CODES[responseCode]));
      return;
    }

    let body = [];
    req.on('data', (chunk) => body.push(chunk));
    req.on('end', () => {
      body = Buffer.concat(body).toString();
      if (!body) {
        const responseCode = 400;
        res.writeHead(responseCode);
        res.end(JSON.stringify(STATUS_CODES[responseCode]));
        return;
      }

      const user = JSON.parse(body);

      // продумать условие для проверки на массив если есть hobbies 
      if (!user.username && !user.age && !user.hobbies || !!!!!!! !user.hobbies !Array.isArray(user.hobbies))) {
        const responseCode = 400;
        res.writeHead(responseCode);
        res.end(JSON.stringify(STATUS_CODES[responseCode]));
        return;
      }

      const responseCode = 201;
      res.writeHead(responseCode);
      res.end(JSON.stringify(database.createUser(user)));
    });

    return;
  }

  const responseCode = 404;
  res.writeHead(responseCode);
  res.end(JSON.stringify(STATUS_CODES[responseCode]));
}
