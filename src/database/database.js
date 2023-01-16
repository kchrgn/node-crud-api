import { v4 as uuidv4 } from 'uuid';

class Database {
  constructor () {
    this._records = [];
  }

  getAllUsers() {
    return this._records;
  } 

  getUserByID(id) {
    const result = this._records.find((record) => record.id === id);
    return result ? result : false;
  }
  
  createUser(user) {
    const uuid = uuidv4();
    this._records.push({ id: uuid, ...user });
    return this._records[this._records.length - 1];
  }

  updateUser(id, data) {
    let user = this._records.find((record) => record.id === id );
    if (user) {
      if (data.username) user.username = data.username;
      if (data.age) user.age = data.age;
      if (data.hobbies) user.hobbies = [...data.hobbies];
      return user;
    };
    return false
  }

  deleteUser(id) {
    let indexOfUser = this._records.findIndex((record) => record.id === id );
    if (indexOfUser >= 0) {
      this._records.splice(indexOfUser, 1);
    }
    return (indexOfUser === -1) ? false : true;
  }
}

export const database = new Database()