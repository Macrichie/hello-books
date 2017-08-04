'use strict';
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Client', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      nickname: {
        type: Sequelize.STRING
      },
      birthdate: {
        type: Sequelize.DATE
      },
      email: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      casePlan: {
        type: Sequelize.STRING(2000)
      },
      caseManagerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Admin',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface /*, Sequelize*/) {
    return queryInterface.dropTable('Client');
  },
};