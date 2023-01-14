import { database } from "../database/database.js";
import { STATUS_CODES, request } from 'http';
import { validate as uuidValidate } from 'uuid';

const responseWithError = (res, errorCode) => {
  res.writeHead(errorCode);
  res.end(JSON.stringify(STATUS_CODES[errorCode]));
}

const requestToDB = async (payload) => {
  const options = {
    port: process.env.HTTP_PORT - 1,
    host: '127.0.0.1',
    path: '/api/db',
    method: 'POST',
  }

  let promise = new Promise((resolve, reject) =>{
      const req = request(options, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error);
      }
  
      let data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('close', () => {
        try {
          resolve(JSON.parse(Buffer.concat(data).toString()));
        } catch (error) {
          reject(new Error);
        }
      })
    })
  
    req.write(JSON.stringify(payload));
    req.end();
    req.on('error', (err) => reject(new Error));
  })

  return promise;
}

export const router = async (req, res) => {
  try {
    req.on('error', (err) => {
      responseWithError(res, 500);
    })
    
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET') {
      if (req.url === '/api/users') {
        const data = await requestToDB({action: 'getAllUsers'});
        const responseCode = 200; 
        res.writeHead(responseCode);
        res.end(JSON.stringify(data));
        return;
      }

      if (req.url.match(/\/api\/users\/\.*/)) {
        const uuidFromUrl = req.url.split('/').slice(3).join('/');

        if (!uuidValidate(uuidFromUrl)) {
          responseWithError(res, 400);
          return;
        }
        
        const DBResponse = await requestToDB({action: 'getUserByID', uuid: uuidFromUrl});
        const data = JSON.stringify(DBResponse);

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
      req.on('end', async () => {
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
          const DBResponse = await requestToDB({action: 'createUser', user: user});
          res.end(JSON.stringify(DBResponse));
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
      req.on('end', async () => {
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

          const DBResponse = await requestToDB({action: 'updateUser', uuid: uuidFromUrl, user: user});
          if (!DBResponse) {
            responseWithError(res, 404);
            return;
          }

          const responseCode = 200;
          res.writeHead(responseCode);
          res.end(JSON.stringify(DBResponse));
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
      
      const DBResponse = await requestToDB({action: 'deleteUser', uuid: uuidFromUrl});

      if (!DBResponse) {
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
