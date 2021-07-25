import { IFieldValidatorSerialized } from "../../../types/core";
import { TSequelizeLibrary } from "../types";

export default function int32ToSequelize(Sequelize: TSequelizeLibrary, field: IFieldValidatorSerialized) {
  if(field.settings.type!=='int32'){
    throw new Error("int32ToSequelize called on field with type: "+field.settings.type);
  }
  return {
    type: Sequelize.INTEGER,
    primaryKey: !!field.settings.primaryKey,
    autoIncrement: !!field.settings.autoIncrement,
  };
}
