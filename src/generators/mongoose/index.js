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
  if (field.settings.uuid) {
    return {
      type: 'Buffer',
      required: true,
    };
  }

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
  const crypto = require('crypto');
  function genUUIDSequential(){
    const dateBuffer = Buffer.from(("0"+Date.now().toString(16)).substr(-12), 'hex');
    const randBuffer = crypto.randomBytes(16);
    randBuffer[0] = dateBuffer[0];
    randBuffer[1] = dateBuffer[1];
    randBuffer[2] = dateBuffer[2];
    randBuffer[3] = dateBuffer[3];
    randBuffer[4] = dateBuffer[4];
    randBuffer[5] = dateBuffer[5];
  

    randBuffer[6] = (randBuffer[6] & 0x0f) | 0x40;
    randBuffer[8] = (randBuffer[8] & 0x3f) | 0x80;
  
    return Mongoose.Types.Buffer(randBuffer).toObject(4);
  }

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
    if (k !== 'id') {
      mongooseSchema[k] = convertFieldToMongoose(Mongoose, fvSchema[k]);
    }
  });

  mongooseSchema._id = {
    type: 'Buffer',
    default: genUUIDSequential,
    required: true,
  };
  return mongooseSchema;
}