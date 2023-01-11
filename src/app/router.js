import { database } from "../database/database.js";
import { STATUS_CODES } from 'http'

export const router = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  switch (req.url) {
    case '/api/users':
      const data = JSON.stringify(database.getAllUsers()); 
      res.writeHead(200);
      res.end(data);
      break;
    default:
      res.writeHead(404);
      res.end(JSON.stringify(STATUS_CODES[404]));
  }
}