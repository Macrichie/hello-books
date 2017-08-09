'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

    },
    desciption: {
      type: DataTypes.STRING,
      allowNull: false,

    },
  }, {
    freezeTableName: true,

    classMethods: {
      associate: (models) => {
        Role.hasMany(models.User, {
          foreignKey: 'roleId',
          as: 'roles',
        });
      }
    }
  });  
  return Role;
};