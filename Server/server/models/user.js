'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        User.hasMany(models.Books, {
          foreignKey: 'userId',
          as: 'book',
        });
      },
    },
  });
  return User;
};