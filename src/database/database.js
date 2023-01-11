import { v5 as uuidv5 } from 'uuid';

class Database {
  constructor () {
    this._records = [
      {
        id: 'c106a26a-21bb-5538-8bf2-57095d1976c1',
        username: 'Вася',
        age: '46',
        hobbies: [
          'sport',
          'books',
        ],
      },
      {
        id: 'c106a26a-21bb-5538-8bf2-57095d1976c2',
        username: 'Петя',
        age: '23',
        hobbies: [
          'sport',
          'books',
        ],
      },
    ]
  }

  getAllUsers() {
    return this._records;
  } 

  getUserByID(id) {
    return this._records.find((record) => record.id === id);
  }
  
  createUser(user) {
    const uuid = uuidv5('', uuidv5.URL);
    this._records.push({ id: uuid, ...user });
    return this._records[this._records.length - 1];
  }

  updateUser(id, data) {
    let user = this._records.find((record) => record.id === id );
    if (user) {
      user.username = data.username;
      user.age = data.age;
      user.hobbies = [...data.hobbies];
    };
    return user;
  }

  deleteUser(id) {
    let indexOfUser = this._records.findIndex((record) => record.id === id );
    if (indexOfUser >= 0) {
      this._records.splice(indexOfUser, 1);
    }
    return (indexOfUser === -1) ? undefined : indexOfUser;
  }
}

export const database = new Database()