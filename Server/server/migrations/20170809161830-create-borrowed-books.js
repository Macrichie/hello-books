'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('borrowedBooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      borrowedTitle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      borrowedId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      returnedDate: {
        type: Sequelize.DATE,
        allowNull: false
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
    return queryInterface.dropTable('borrowedBooks');
  }
};