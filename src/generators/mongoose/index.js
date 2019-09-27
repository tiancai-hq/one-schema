function float64ToMongoose(Mongoose, field) {
  return {
    type: Mongoose.Schema.Types.Number,
  };
}

function boolToMongoose(Mongoose, field) {
  return {
    type: Mongoose.Schema.Types.Boolean,
  };
}

/*
  NOTE ON MIXED TYPE:

  Since it is a schema-less type, you can change the value to anything else you like,
  but Mongoose loses the ability to auto detect and save those changes.
  To tell Mongoose that the value of a Mixed type has changed, you need to call
  doc.markModified(path), passing the path to the Mixed type you just changed.
*/
function objectToMongoose(Mongoose, field) {
  return {
    type: Mongoose.Schema.Types.Mixed,
  };
}

function arrayToMongoose(Mongoose, field) {
  return {
    type: Mongoose.Schema.Types.Mixed,
  };
}

function int32ToMongoose(Mongoose, field) {
  return {
    type: Mongoose.Schema.Types.Number,
  };
}

function stringToMongoose(Mongoose, field) {
  return {
    type: Mongoose.Schema.Types.String,
  };
}

const MONGOOSE_TYPE_MAP = {
  int32: int32ToMongoose,
  string: stringToMongoose,
  bool: boolToMongoose,
  float64: float64ToMongoose,
  object: objectToMongoose,
  array: arrayToMongoose,
};

function convertFieldToMongoose(Mongoose, field) {
  const typeConvertor = MONGOOSE_TYPE_MAP[field.settings.type];
  if (
    !MONGOOSE_TYPE_MAP.hasOwnProperty(field.settings.type) ||
    typeof typeConvertor !== 'function'
  ) {
    throw new Error(`Missing type '${field.settings.type}' for mongoose!`);
  }
  return typeConvertor(Mongoose, field);
}

export function generateMongooseSchema(Mongoose, fieldValidator) {
  const fvSchema = fieldValidator.settings.schema;
  if (fieldValidator.settings.type !== 'object' || !fvSchema) {
    throw new Error(
      'Can not generate schema from fieldValidator unless type is object!'
    );
  }

  if (
    fieldValidator.settings.type !== 'object' ||
    !fieldValidator.settings.schema
  ) {
    throw new Error('Can not generate schema from fieldValidator!');
  }
  const mongooseSchema = {};

  Object.keys(fvSchema).forEach((k) => {
    mongooseSchema[k] = convertFieldToMongoose(Mongoose, fvSchema[k]);
  });
  return mongooseSchema;
}
