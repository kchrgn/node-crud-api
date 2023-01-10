import Database from "../database/database.js";

// TODO - delete mock data from database

export default class App {
  constructor () {
    this.database = new Database();
  }

  start() {
    // console.log('App started', this.inMemoryDatabase.updateUser('22', { username: ';lkj;lk;', age: '23', hobbies: [ 'sport2', 'books' ] }));
    // console.log('App started', this.database.deleteUser('11'));
    // console.log('UUser 2: ', this.inMemoryDatabase.getUserByID('22'));
    console.log(this.database.getAllUsers());
    console.log(process.env.HTTP_PORT);
  }
}