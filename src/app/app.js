// import Database from "../database/database.js";
import { createServer } from 'http';
import { router } from './router.js';
import { resolve } from 'path'
import { fork } from 'child_process'
import cluster from 'cluster'

// TODO - delete mock data from database
// TODO - need check data for update and create records in DB 
// TODO - error handler on clientRequest in App
// TOFIX - uniq records in db (there is not uniq uuid)


export default class App {
  start() {
    if (cluster.isPrimary) {
      const DBProcess = fork(new URL('../database/db_process.js', import.meta.url));
    }
    const server = createServer(router);
    server.listen(process.env.HTTP_PORT, () => {
      console.log(`Server has been starter on port ${process.env.HTTP_PORT}`);
    })
  }
}