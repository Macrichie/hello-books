'use strict';
module.exports = (sequelize, DataTypes) => {
  const admin = sequelize.define('admin', {
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
        admin.hasMany(models.Client, {
          foreignKey: 'caseManagerId',
          as: 'clients',
        });
        admin.belongsToMany(models.Role, {
          through: 'adminRole',
          foreignKey: 'adminId',
          otherKey: 'roleId',
        });
      },
    }, 
  });
  return admin;
};