import { IFieldValidatorSerializedObject, IFieldValidatorSerialized } from '../../types/core';
import SEQUELIZE_TYPE_MAP from './convertors';
import { ISequelizeFieldDef, TSequelizeLibrary } from './types';
function convertFieldToSequelize(Sequelize: TSequelizeLibrary, field: IFieldValidatorSerialized) {
  if(!field.settings.type){
    throw new Error("convertFieldToSequelize error: field.settings.type undefined!");
  }
  const typeConvertor = SEQUELIZE_TYPE_MAP[field.settings.type];
  if (
    !SEQUELIZE_TYPE_MAP.hasOwnProperty(field.settings.type) ||
    typeof typeConvertor !== 'function'
  ) {
    throw new Error(`Missing type '${field.settings.type}' for sequelize!`);
  }
  return typeConvertor(Sequelize, field);
}

export function generateSequelizeSchema(Sequelize: TSequelizeLibrary, fieldValidator: IFieldValidatorSerializedObject) {
  const fvSchema = fieldValidator.settings.schema;
  if (fieldValidator.settings.type !== 'object' || !fvSchema) {
    throw new Error('Can not generate schema from fieldValidator unless type is object!');
  }


  if (fieldValidator.settings.type !== 'object' || !fieldValidator.settings.schema) {
    throw new Error('Can not generate schema from fieldValidator!');
  }
  const sequelizeSchema: {[key: string]: ISequelizeFieldDef} = {};

  Object.keys(fvSchema)
    .forEach((k) => {
      sequelizeSchema[k] = convertFieldToSequelize(Sequelize, fvSchema[k]);
    });
  return sequelizeSchema;
}
