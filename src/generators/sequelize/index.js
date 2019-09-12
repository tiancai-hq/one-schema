import SEQUELIZE_TYPE_MAP from './convertors';

function convertFieldToSequelize(Sequelize, field) {
  const typeConvertor = SEQUELIZE_TYPE_MAP[field.settings.type];
  if(
    !SEQUELIZE_TYPE_MAP.hasOwnProperty(field.settings.type) ||
    typeof typeConvertor !== 'function'
  ){
    throw new Error("Missing type '"+field.settings.type+"' for sequelize!");
  }
  return typeConvertor(Sequelize, field);
}

export function generateSequelizeSchema(Sequelize, fieldValidator) {
  
  const fvSchema = fieldValidator.settings.schema;
  if(fieldValidator.settings.type !== "object" || !fvSchema) {
    throw new Error("Can not generate schema from fieldValidator unless type is object!");
  }



  if (fieldValidator.settings.type !== "object" || !fieldValidator.settings.schema ) {
    throw new Error("Can not generate schema from fieldValidator!");
  }
  const sequelizeSchema = {};

  Object.keys(fvSchema)
  .forEach(k=>{
    sequelizeSchema[k] = convertFieldToSequelize(Sequelize, fvSchema[k]);
  });
  return sequelizeSchema;
}