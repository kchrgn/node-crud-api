// import Database from "../database/database.js";
import { createServer } from 'http';
import { router } from './router.js';
import { balancer } from './balancer.js';
import { fork } from 'child_process';
import cluster from 'cluster';
import { cpus } from 'os';

// TODO - delete mock data from database
// TODO - need check data for update and create records in DB 
// TODO - error handler on clientRequest in App
// TOFIX - uniq records in db (there is not uniq uuid)
// TODO - .env --> .env.example


export default class App {
  start() {
    switch (process.argv[2]) {
      case 'multi':
        if (cluster.isPrimary) {
          const DBProcess = fork(new URL('../database/db_process.js', import.meta.url));
          for (let i = 1; i <= cpus().length; i++) {
            cluster.fork({CLUSTER_PORT: Number(process.env.HTTP_PORT) + i, CLUSTER_INDEX: i});            
          }
          const server = createServer(balancer);
          server.listen(process.env.HTTP_PORT, () => {
            console.log(`Load balancer has been started on port ${process.env.HTTP_PORT}`);
          })
        } else {
          const server = createServer(router);
          server.listen(process.env.CLUSTER_PORT, () => {
            console.log(`Instance ${process.env.CLUSTER_INDEX} of cluster has been starter on port ${process.env.CLUSTER_PORT}`);
          })
        }
        break;
    
      default:
        const DBProcess = fork(new URL('../database/db_process.js', import.meta.url));
        const server = createServer(router);
        server.listen(process.env.HTTP_PORT, () => {
          console.log(`Server has been starter on port ${process.env.HTTP_PORT}`);
        })
        break;
    }
  }
}