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
   options.tableName = 'Reviews';
   return queryInterface.bulkInsert(options, [
    {
      userId: 2,
      spotId: 1,
      review: 'This place was the worst. Bees were everywhere',
      stars: 1
    },
    {
      userId: 3,
      spotId: 2,
      review: 'This place was meh. Bees were very kind tho',
      stars: 3
    },
    {
      userId: 1,
      spotId: 3,
      review: 'This place was the best. Bees made me honey every morning',
      stars: 5
    },
    {
      userId: 2,
      spotId: 1,
      review: 'Testing this out',
      stars: 2
    },
    {
      userId: 3,
      spotId: 2,
      review: 'Give me toast',
      stars: 2
    },
    {
      userId: 1,
      spotId: 3,
      review: 'I am thirsty',
      stars: 2
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [2, 3, 1] }
    }, {})
  }
};
