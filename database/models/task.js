'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      // define association here
      task.belongsToMany(models.user, {
        through: 'taskuser',
        id: 'taskId'
      })
    }
  }
  task.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    priority: {
      allowNull: false,
      type: DataTypes.ENUM('high', 'medium', 'low')
    },
    dueDate: {
      allowNull: false,
      field: "due_date",
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'task',
  });
  return task;
};