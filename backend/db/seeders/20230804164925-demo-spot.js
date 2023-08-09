'use strict';
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'Ann Arbor',
        state: 'MI',
        country: 'USA',
        lat: 42.270602,
        lng: -83.733883,
        name: 'Test House',
        description: 'This is my favorite house. Pls stay here',
        price: 156.54
      },
      {
        ownerId: 2,
        address: '345 Division St',
        city: 'Ann Arbor',
        state: 'MI',
        country: 'USA',
        lat: 42.272406,
        lng: -83.744867,
        name: 'Test Apartment',
        description: 'This is my favorite apartment. Pls stay here',
        price: 284.12
      },
      {
        ownerId: 3,
        address: '789 State St',
        city: 'Ann Arbor',
        state: 'MI',
        country: 'USA',
        lat: 42.272774,
        lng: -83.740539,
        name: 'Test Condo',
        description: 'This is my favorite condo. Pls stay here',
        price: 345.79
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Test House', 'Test Apartment', 'Test Condo'] }
    }, {});
  }
};
