require('dotenv').config();

module.exports = {

    "development": {
      username: "postgres",
      password: "Admin999",
      database: "hellobooks",
      host: "127.0.0.1",
      port: 5432,
      dialect: "postgres",
      logging: false
    },
    test: {
      username: "postgres",
      password: "Admin999",
      database: "hellobooks",
      host: "127.0.0.1",
      port: 5432,
      dialect: "postgres",
      logging: false

    }


};