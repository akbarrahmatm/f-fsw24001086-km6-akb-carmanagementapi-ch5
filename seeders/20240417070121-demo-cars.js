"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const cars = [
      {
        type: "SUV",
        model: "Fortuner",
        manufacture: "Toyota",
        price: 500000,
        createdBy: 1,
        deletedBy: null,
        lastUpdatedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        type: "Sport",
        model: "Aventador",
        manufacture: "Lamborghini",
        price: 50000000,
        createdBy: 1,
        deletedBy: null,
        lastUpdatedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        type: "SUV",
        model: "Rush",
        manufacture: "Toyota",
        price: 250000,
        createdBy: 1,
        deletedBy: null,
        lastUpdatedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];

    return await queryInterface.bulkInsert("Cars", cars);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return await queryInterface.bulkDelete("Cars", null, {});
  },
};
