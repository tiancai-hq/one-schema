export default function stringToSequelize(Sequelize, field) {
  return {
    type: field.settings.max ? Sequelize.STRING(field.settings.max) : Sequelize.STRING,
    primaryKey: !!field.settings.primaryKey,
    autoIncrement: !!field.settings.autoIncrement,
  };
}
