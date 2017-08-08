'use strict';
module.exports = (sequelize, DataTypes) => {
  const BorrowedBook = sequelize.define('BorrowBook', {
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    borrowerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    returnedDate: {
      type: DataTypes.DATE,
    },
    toReturned: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    return: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

  }, {
    freezeTableName: true,
  
    classMethods: {
      associate: (models) => {
        BorrowBook.belongsTo(models.User, {
          foreignKey: 'borrowerId',
          onDelete: 'SET NULL'
        });
      }
    }
  });
  return BorrowedBook;
};