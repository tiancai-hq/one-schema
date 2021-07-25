import { IFieldValidatorSerialized } from "../../types/core";
type TMongooseLibrary = any;


function float64ToMongoose(Mongoose: any, _field: IFieldValidatorSerialized) {
  return {
    type: Mongoose.Schema.Types.Number,
  };
}

function boolToMongoose(Mongoose: TMongooseLibrary, _field: IFieldValidatorSerialized) {
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
function objectToMongoose(Mongoose: TMongooseLibrary, _field: IFieldValidatorSerialized) {
  return {
    type: Mongoose.Schema.Types.Mixed,
  };
}

function arrayToMongoose(Mongoose: TMongooseLibrary, _field: IFieldValidatorSerialized) {
  return {
    type: Mongoose.Schema.Types.Mixed,
  };
}

function int32ToMongoose(Mongoose: TMongooseLibrary, _field: IFieldValidatorSerialized) {
  return {
    type: Mongoose.Schema.Types.Number,
  };
}

function stringToMongoose(Mongoose: TMongooseLibrary, field: IFieldValidatorSerialized) {
  if (field.settings.type === "string" && field.settings.uuid) {
    return {
      type: 'Buffer',
      required: true,
    };
  }

  if (field.settings.validator && field.settings.validator.id === 'datetime') {
    return {
      type: Mongoose.Schema.Types.Date,
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

function convertFieldToMongoose(Mongoose: TMongooseLibrary, field: IFieldValidatorSerialized) {
  if(!field.settings.type){
    throw new Error("Error converting field to mongoose, undefined type for field validator!");
  }
  const typeConvertor = MONGOOSE_TYPE_MAP[field.settings.type];
  if (
    !MONGOOSE_TYPE_MAP.hasOwnProperty(field.settings.type) ||
    typeof typeConvertor !== 'function'
  ) {
    throw new Error(`Missing type '${field.settings.type}' for mongoose!`);
  }
  return typeConvertor(Mongoose, field);
}

export function generateMongooseSchema(Mongoose: TMongooseLibrary, fieldValidator: IFieldValidatorSerialized) {
  /* eslint-disable global-require */
  /* eslint-disable @typescript-eslint/no-var-requires */
  const crypto = require('crypto');
  /* eslint-enable global-require */
  /* eslint-enable @typescript-eslint/no-var-requires */

  function genUUIDSequential() {
    const dateBuffer = Buffer.from((`0${Date.now().toString(16)}`).substr(-12), 'hex');
    const randBuffer = crypto.randomBytes(16);
    /* eslint-disable prefer-destructuring */
    randBuffer[0] = dateBuffer[0];
    randBuffer[1] = dateBuffer[1];
    randBuffer[2] = dateBuffer[2];
    randBuffer[3] = dateBuffer[3];
    randBuffer[4] = dateBuffer[4];
    randBuffer[5] = dateBuffer[5];
    /* eslint-enable prefer-destructuring */


    randBuffer[6] = (randBuffer[6] & 0x0f) | 0x40;
    randBuffer[8] = (randBuffer[8] & 0x3f) | 0x80;

    return Mongoose.Types.Buffer(randBuffer).toObject(4);
  }

  if (fieldValidator.settings.type !== 'object') {
    throw new Error(
      'Can not generate schema from fieldValidator unless type is object!'
    );
  }
  const fvSchema = fieldValidator.settings.schema;
  if (typeof fvSchema !== 'object' || !fvSchema) {
    throw new Error(
      'Can not generate mongoose schema from a fieldValidator unless it has a schema!'
    );
  }

  if (
    fieldValidator.settings.type !== 'object' ||
    !fieldValidator.settings.schema
  ) {
    throw new Error('Can not generate schema from fieldValidator!');
  }
  const mongooseSchema: {[key: string]: any} = {};

  Object.keys(fvSchema).forEach((k) => {
    if (k !== 'id') {
      mongooseSchema[k] = convertFieldToMongoose(Mongoose, fvSchema[k]);
    }
  });

  /* eslint-disable no-underscore-dangle */
  mongooseSchema._id = {
    type: 'Buffer',
    default: genUUIDSequential,
    required: true,
  };
  /* eslint-enable no-underscore-dangle */
  return mongooseSchema;
}
