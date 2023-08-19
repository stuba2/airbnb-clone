'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: 'userId' });
      Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        startDateInPast(value) {
          if (new Date(value) < new Date()) {
            throw new Error('Start date must be in the future');
          }
        },
        startDateAfterEndDate() {
          if (this.startDate > this.endDate) {
            throw new Error('endDate cannot be on or before startDate')
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isBefore: "2030-01-01"
      }
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
