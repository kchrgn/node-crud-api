import { createServer } from 'http';
import { router } from './router.js';
import { balancer } from './balancer.js';
import { fork } from 'child_process';
import cluster from 'cluster';
import { cpus } from 'os';

export default class App {
  start() {
    switch (process.argv[2]) {
      case 'multi':
        if (cluster.isPrimary) {
          const DBProcess = fork(new URL('../database/db_process.js', import.meta.url), [process.env.HTTP_PORT]);
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
        const DBProcess = fork(new URL('../database/db_process.js', import.meta.url), [process.env.HTTP_PORT]);
        const server = createServer(router);
        server.listen(process.env.HTTP_PORT, () => {
          console.log(`Server has been starter on port ${process.env.HTTP_PORT}`);
        })
        break;
    }
  }
}