import http from 'http';
import { cpus } from 'os';

const roudRobin = function () {
  let index = 1;
  return () => {
    if (index > cpus().length) index = 1;
    const port = Number(process.env.HTTP_PORT) + index++;
    return port;
  }
}();

export const balancer = (req, res) => {

  const options = {
    port: roudRobin(),
    host: '127.0.0.1',
    path: req.url,
    method: req.method,
    headers: req.headers
  }
  
  res.setHeader('Content-Type', 'application/json');
  const reqToInstance = http.request(options, (clusterResponse) => clusterResponse.pipe(res));
  req.pipe(reqToInstance);
}