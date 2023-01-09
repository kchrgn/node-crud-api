export default class App {
  constructor () {
    console.log('App constructor executed');
  }

  start() {
    console.log('App started');
    console.log(process.env);
  }
}