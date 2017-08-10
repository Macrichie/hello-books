'use strict';
module.exports = (sequelize, DataTypes) => {
  var Client = sequelize.define('Client', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    nickname: DataTypes.STRING,
    birthdate: DataTypes.DATEONLY,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    casePlan: DataTypes.STRING(2000),
  }, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        Client.belongsTo(models.admin, {
          foreignKey: 'caseManagerId',
          as: 'caseManager',
        });
        // associations can be defined here
      },
    },
  });
  return Client;
};