'use strict';
module.exports = (sequelize, DataTypes) => {
  const borrowedBooks = sequelize.define('borrowedBooks', {
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    returnedDate: {
      type: DataTypes.DATE,
    },
    toReturn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

  }, {
    classMethods: {
      associate: (models) => {
        borrowedBooks.belongsTo(models.User, {
          foreignKey: 'borrowerId',
          onDelete: 'SET NULL'
        });
      }
    }
  });
  return borrowedBooks;
};