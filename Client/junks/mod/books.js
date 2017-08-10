'use strict';
module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define('Books', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    isbn: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    copies: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'technology',
      validate: {
        isIn: {
          args: [['politics', 'sciences', 'history', 'technology', 'fashion', 'languages', 'finance']],
          msg: 'Use a valid access type'
        }
      }
    },
  }, {
    freezeTableName: true,

    classMethods: {
      associate: (models) => {
        Books.belongsTo(models.User, {
            foreignKey: 'adminId',
            onDelete: 'SET NULL',
        });
      }
    },
    instanceMethods: {
      filterBookDetails() {
        const { createdAt, updatedAt, ...rest } = this.get();
        return rest;
      }
    },
  });
  return Books;
};