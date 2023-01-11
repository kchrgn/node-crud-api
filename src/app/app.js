// import Database from "../database/database.js";
import { createServer } from 'http';
import { router } from "./router.js";

// TODO - delete mock data from database
// TODO - need check data for update and create records in DB 

export default class App {
  start() {
    // console.log('App started', this.inMemoryDatabase.updateUser('22', { username: ';lkj;lk;', age: '23', hobbies: [ 'sport2', 'books' ] }));
    // console.log('App started', this.database.deleteUser('11'));
    // console.log('UUser 2: ', this.inMemoryDatabase.getUserByID('22'));
    // console.log(this.database.getAllUsers());
    // console.log(process.env.HTTP_PORT);
    const server = createServer(router);
    server.listen(process.env.HTTP_PORT, () => {
      console.log(`Server has been starter on port ${process.env.HTTP_PORT}`);
    })
  }
}