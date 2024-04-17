'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Car.init({
    type: DataTypes.STRING,
    model: DataTypes.STRING,
    manufacture: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.TEXT,
    createdBy: DataTypes.INTEGER,
    deletedBy: DataTypes.INTEGER,
    lastUpdatedBy: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Car',
  });
  return Car;
};