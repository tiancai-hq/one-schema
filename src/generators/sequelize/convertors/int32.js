export default function int32ToSequelize(Sequelize, field) {
  return {
    type: Sequelize.INTEGER,
    primaryKey: !!field.settings.primaryKey,
    autoIncrement: !!field.settings.autoIncrement,
  };
}
