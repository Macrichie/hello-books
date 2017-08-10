'use strict';
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('AdminRole', {
      adminId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Admin',
          key: 'id',
        },
      },
      roleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Role',
          key: 'id',
        },
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down(queryInterface /* , Sequelize */) {
    return queryInterface.dropTable('AdminRole');
  },
};
