import { database } from "../database/database.js";
import { STATUS_CODES } from 'http';
import { validate as uuidValidate } from 'uuid';

const responseWithError = (res, errorCode) => {
  res.writeHead(errorCode);
  res.end(JSON.stringify(STATUS_CODES[errorCode]));
}

export const router = (req, res) => {
  try {
    req.on('error', (err) => {
      responseWithError(res, 500);
    })

    
    res.setHeader('Content-Type', 'application/json');

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
          responseWithError(res, 400);
          return;
        }
        
        const data = JSON.stringify(database.getUserByID(uuidFromUrl));

        if (!data) {
          responseWithError(res, 404);
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
        try {
          body = Buffer.concat(body).toString();
          if (!body) {
            responseWithError(res, 400);
            return;
          }

          let user = JSON.parse(body);
        
          if (!user.username || !user.age || !user.hobbies || !Array.isArray(user.hobbies)) {
            responseWithError(res, 400);
            return;
          }

          const responseCode = 201;
          res.writeHead(responseCode);
          res.end(JSON.stringify(database.createUser(user)));
        } catch (error) {
          responseWithError(res, 500);
        }  
      });

      return;
    }

    if (req.method === 'PUT' && req.url.match(/\/api\/users\/\.*/)) {
      const uuidFromUrl = req.url.split('/').slice(3).join('/');

      if (!uuidValidate(uuidFromUrl)) {
        responseWithError(res, 400);
        return;
      }

      let body = [];
      req.on('data', (chunk) => body.push(chunk));
      req.on('end', () => {
        try {
          body = Buffer.concat(body).toString();
          if (!body) {
            responseWithError(res, 400);
            return;
          }

          let user = JSON.parse(body);
          if (!user.username && !user.age && !user.hobbies || !!user.hobbies && !Array.isArray(user.hobbies)) {
            responseWithError(res, 400);
            return;
          };

          const result = database.updateUser(uuidFromUrl, user);
          if (!result) {
            responseWithError(res, 404);
            return;
          }

          const responseCode = 200;
          res.writeHead(responseCode);
          res.end(JSON.stringify(result));
        } catch (err) {
          responseWithError(res, 500);
        }  
      });
      return;
    }

    if (req.method === 'DELETE' && req.url.match(/\/api\/users\/\.*/)) {
      const uuidFromUrl = req.url.split('/').slice(3).join('/');

      if (!uuidValidate(uuidFromUrl)) {
        responseWithError(res, 400);
        return;
      }
      
      const result = JSON.stringify(database.deleteUser(uuidFromUrl));

      if (!result) {
        responseWithError(res, 404);
        return;
      }

      const responseCode = 204;
      res.writeHead(responseCode);
      res.end();
      return;
    }

    // In case of requests to non-existing endpoints
    responseWithError(res, 404);
        
  } catch (err) {
    responseWithError(res, 500);
  }
}
