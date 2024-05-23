"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        id: 1,
        name: "Akbar Rahmat Mulyatama",
        age: 20,
        address: "Jakarta Selatan",
        role: "superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Staff",
        age: 22,
        address: "Jakarta Utara",
        role: "staff",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const auths = [
      {
        id: 1,
        email: "akbarrahmatmulyatama@gmail.com",
        password:
          "$2a$10$19qoEHK2vEUXGIOYIhARZ.pha31AXRY2EeEhkK0ntGsgBz3wgNgq6", // admin12345678
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        email: "staff@staff.com",
        password:
          "$2a$10$sAq57uyEAxoUZ3KynulZPedhuFIwDgDsPkHUZe6ZGy49PBUg2MZiG", // user12345678
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Users", users);
    return queryInterface.bulkInsert("Auths", auths);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Users", null, {});

    return queryInterface.bulkDelete("Auths", null, {});
  },
};
