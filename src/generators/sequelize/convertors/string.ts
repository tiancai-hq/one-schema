import { IFieldValidatorSerialized } from "../../../types/core";
import { TSequelizeLibrary } from "../types";

export default function stringToSequelize(Sequelize: TSequelizeLibrary, field: IFieldValidatorSerialized) {
  if(field.settings.type!=='string'){
    throw new Error("stringToSequelize called on field with type: "+field.settings.type);
  }
  return {
    type: field.settings.max ? Sequelize.STRING(field.settings.max) : Sequelize.STRING,
    primaryKey: !!field.settings.primaryKey,
    autoIncrement: !!field.settings.autoIncrement,
  };
}
