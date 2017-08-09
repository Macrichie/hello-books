'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,

    },
  }, {
    classMethods: {
      associate: (models) => {
        Role.hasMany(models.User, {
          foreignKey: 'roleId'
        });
      }
    }
  });  
  return Role;
};