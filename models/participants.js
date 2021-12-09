'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Participants.init({
    Name: DataTypes.STRING,
    University: DataTypes.STRING,
    Email: DataTypes.STRING,
    Gender: DataTypes.STRING,
    Workshops: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Participants',
  });
  return Participants;
};