'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('taskusers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      userId: {
        type: Sequelize.UUID,
        field: "user_id",
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      taskId: {
        type: Sequelize.UUID,
        field: "task_id",
        references: {
          model: 'tasks',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('taskusers');
  }
};