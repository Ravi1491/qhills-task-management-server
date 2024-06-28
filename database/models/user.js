'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsToMany(models.task,{
        through: 'taskuser',
        id: 'userId'
      })
    }
  }
  user.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING,
      field: "hashed_password"
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};