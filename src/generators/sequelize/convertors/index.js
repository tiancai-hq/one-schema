import int32Convert from './int32';
import stringConvert from './string';
import float64Convert from './float64';

function boolToSequelize(Sequelize, field) {
  return {
    type: Sequelize.BOOLEAN,
  };
}
function objectToSequelize(Sequelize, field) {
  return {
    type: Sequelize.JSON,
  };
}
const SEQUELIZE_TYPE_MAP = {
  int32: int32Convert,
  string: stringConvert,
  bool: boolToSequelize,
  float64: float64Convert,
  object: objectToSequelize,
};

function arrayToSequelize(Sequelize, field) {
  const element = field.settings.arrayOf;
  const elementType = element.settings.type;
  const convertedType = SEQUELIZE_TYPE_MAP[elementType](Sequelize, element).type;
  return {
    type: Sequelize.ARRAY(convertedType),
  };
}

SEQUELIZE_TYPE_MAP.array = arrayToSequelize;
export default SEQUELIZE_TYPE_MAP;
