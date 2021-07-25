import { IFieldValidatorSerialized } from "../../../types/core";
import { TSequelizeLibrary } from "../types";

export default function float64ToSequelize(Sequelize: TSequelizeLibrary, field: IFieldValidatorSerialized) {
  if(field.settings.type!=='float64'){
    throw new Error("float64ToSequelize called on field with type: "+field.settings.type);
  }
  return {
    type: Sequelize.DOUBLE,
  };
}
