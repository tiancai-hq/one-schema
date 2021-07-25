import int32Convert from './int32';
import stringConvert from './string';
import float64Convert from './float64';
import { ISequelizeFieldDef, TSequelizeLibrary } from '../types';
import { IFieldValidatorSerialized, IFieldValidatorSerializedArray } from '../../../types/core';

function boolToSequelize(Sequelize: TSequelizeLibrary, field: IFieldValidatorSerialized): ISequelizeFieldDef {
  return {
    type: Sequelize.BOOLEAN,
  };
}
function objectToSequelize(Sequelize: TSequelizeLibrary, field: IFieldValidatorSerialized): ISequelizeFieldDef {
  return {
    type: Sequelize.JSON,
  };
}
const SEQUELIZE_TYPE_MAP: {[key: string]: (Sequelize: TSequelizeLibrary, field: IFieldValidatorSerialized)=>ISequelizeFieldDef} = {
  int32: int32Convert,
  string: stringConvert,
  bool: boolToSequelize,
  float64: float64Convert,
  object: objectToSequelize,
  array: arrayToSequelize,
};

function arrayToSequelize(Sequelize: TSequelizeLibrary, field: IFieldValidatorSerialized): ISequelizeFieldDef {
  if(field.settings.type!=='array'){
    throw new Error("float64ToSequelize called on field with type: "+field.settings.type);
  }
  const element = field.settings.arrayOf;
  if(!element){
    throw new Error("Cannot convert array field to sequelize because the arrayOf schema is not defined for the array field")
  }
  const elementType = element.settings.type;
  if(!elementType){
    throw new Error("Cannot convert array field to sequelize because the arrayOf schema's type is not defined for the array field")
  }
  const convertedType = SEQUELIZE_TYPE_MAP[elementType](Sequelize, element).type;
  return {
    type: Sequelize.ARRAY(convertedType),
  };
}

export default SEQUELIZE_TYPE_MAP;
