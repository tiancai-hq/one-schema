import int32Convert from './int32';
import stringConvert from './string';
import float64Convert from './float64';

function boolToSequelize(Sequelize, field) {
  return {
    type: Sequelize.BOOLEAN,
  }
}
function objectToSequelize(Sequelize, field) {
  return {
    type: Sequelize.JSON,
  }
}
function arrayToSequelize(Sequelize, field) {
  return {
    type: Sequelize.ARRAY,
  }
}

const SEQUELIZE_TYPE_MAP = {
  "int32": int32Convert,
  "string": stringConvert,
  "bool": boolToSequelize,
  "float64": float64Convert,
  "object": objectToSequelize,
  "array": arrayToSequelize
};

export default SEQUELIZE_TYPE_MAP;