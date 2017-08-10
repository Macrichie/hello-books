'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    first: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
    },

  }, {
    freezeTableName: true,

    classMethods: {
      associate: (models) => {
        User.belongsTo(models.Role, {
            foreignKey: 'roleId',
            onDelete: 'SET NULL',
        });
        User.hasMany(models.Books, {
          foreignKey: 'adminId',
        });
        User.hasMany(models.Borrowed, {
          foreignKey: 'borrowedId',
        });
      },
    },
    instanceMethods: {
      validPassword(password) {
        return bcrypt.compareSync(password, this.password);
      },

      hashPassword() {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
      },

      filterUserDetails() {
        const { password, createdAt, updatedAt, ...rest } = this.get();
        return rest;
      },
      
      filterUserList() {
        const { password, updatedAt, ...rest } = this.get();
        return rest;
      }
    },

    hooks: {
      beforeCreate(user) {
        user.hashPassword();
      },

      beforeUpdate(user) {
        /* eslint-disable no-underscore-dangle*/
        if (user._changed.password) {
          user.hashPassword();
        }
      }
    }
  });
return User;
};
