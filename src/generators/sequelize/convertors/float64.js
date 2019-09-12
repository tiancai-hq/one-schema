export default function float64ToSequelize(Sequelize, field) {
  return {
    type: Sequelize.DOUBLE,
  };
}