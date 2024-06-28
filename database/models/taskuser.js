'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class taskuser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  taskuser.init({
    userId: {
      type: DataTypes.UUID,
      field: "user_id",
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    taskId: {
      type: DataTypes.UUID,
      field: "task_id",
      references: {
        model: 'tasks',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  }, {
    sequelize,
    modelName: 'taskuser',
  });
  return taskuser;
}; 