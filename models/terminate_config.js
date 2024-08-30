"use strict";

module.exports = (sequelize, DataTypes) => {
  const TerminateConfig = sequelize.define(
    "terminate_config",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Message cannot be empty",
          },
          len: {
            args: [1, 255],
            msg: "Message must be between 1 and 255 characters",
          },
        },
      },
      countdown: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Countdown must be an integer",
          },
          min: {
            args: [0],
            msg: "Countdown must be a positive integer",
          },
        },
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "terminate_config",
      underscored: false,
    }
  );

  return TerminateConfig;
};
