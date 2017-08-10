'use strict';
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        // associations is defined here
        admin.belongsToMany(models.Role, {
          through: 'AdminRole',
          foreignKey: 'adminId',
          otherKey: 'roleId',
        });
      },
    }, 
  });
  return Admin;
};