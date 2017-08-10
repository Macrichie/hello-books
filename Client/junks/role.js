'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING,
    description: DataTypes.STRING(1023),
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        // associations can be defined here
        Role.belongsToMany(models.Admin, {
          through: 'AdminRole',
          foreignKey: 'roleId',
          otherKey: 'adminId',
        });
      },
    },
  });
  return Role;
};