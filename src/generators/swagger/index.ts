import {
  IFieldValidatorSerialized,
  IFieldValidatorSerializedArray,
  IFieldValidatorSerializedBool,
  IFieldValidatorSerializedFloat64,
  IFieldValidatorSerializedInt32,
  IFieldValidatorSerializedObject,
  IFieldValidatorSerializedString
} from "../../types/core";

 interface ISwaggerField {
  type: string;
  format?: string;
  example?: any;
  description?: string;
  default?: any;
  enum?: any[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  
  minItems?: number;
  maxItems?: number;
  required?: string[];
  items?: ISwaggerField;
  properties?: {[key: string]: ISwaggerField};
}

function primitiveField(field: IFieldValidatorSerialized, swaggerType: string, swaggerFormat?: string): ISwaggerField {
  if(field.settings.type !== "bool" && field.settings.type !== "int32" && field.settings.type !== "string" && field.settings.type !== "float64"){
    throw new Error("primitiveField called on non primitive field!");
  }
  const swaggerField: ISwaggerField = {type: swaggerType};
  if(typeof swaggerFormat === 'string'){
    swaggerField.format = swaggerFormat;
  }
  if (typeof field.settings.example !== 'undefined') {
    swaggerField.example = field.settings.example;
  }
  if (typeof field.settings.description === 'string') {
    swaggerField.description = field.settings.description;
  }
  if (typeof field.settings.defaultValue !== 'undefined') {
    swaggerField.default = field.settings.defaultValue;
  }
  if (Array.isArray(field.settings.oneOf)) {
    const oneOfArr: any[] = field.settings.oneOf;
    swaggerField.enum = oneOfArr.concat([]);
  }
  return swaggerField;
}

function int32ToSwagger(field: IFieldValidatorSerializedInt32) {
  const swaggerField = primitiveField(field, 'integer', 'int32');
  if (typeof field.settings.min !== 'undefined') {
    swaggerField.minimum = field.settings.min;
  }
  if (typeof field.settings.max !== 'undefined') {
    swaggerField.maximum = field.settings.max;
  }
  return swaggerField;
}

function float64ToSwagger(field: IFieldValidatorSerializedFloat64) {
  const swaggerField = primitiveField(field, 'number', 'double');
  if (typeof field.settings.min !== 'undefined') {
    swaggerField.minimum = field.settings.min;
  }
  if (typeof field.settings.max !== 'undefined') {
    swaggerField.maximum = field.settings.max;
  }
  return swaggerField;
}

function boolToSwagger(field: IFieldValidatorSerializedBool) {
  const swaggerField = primitiveField(field, 'boolean');
  return swaggerField;
}

function stringToSwagger(field: IFieldValidatorSerializedString) {
  const swaggerField = primitiveField(field, 'string');
  if (typeof field.settings.min !== 'undefined') {
    swaggerField.minLength = field.settings.min;
  }
  if (typeof field.settings.max !== 'undefined') {
    swaggerField.maxLength = field.settings.max;
  }
  if (
    field.settings.validator &&
    typeof field.settings.validator === 'object'
  ) {
    if (field.settings.validator.id === 'datetime') {
      swaggerField.format = 'date-time';
    }
  }
  return swaggerField;
}

function arrayToSwagger(field: IFieldValidatorSerializedArray) {
  const swaggerField: ISwaggerField = { type: 'array' };
  if (typeof field.settings.description === 'string') {
    swaggerField.description = field.settings.description;
  }
  if (typeof field.settings.min !== 'undefined') {
    swaggerField.minItems = field.settings.min;
  }
  if (typeof field.settings.max !== 'undefined') {
    swaggerField.maxItems = field.settings.max;
  }
  if(field.settings.arrayOf){
    swaggerField.items = onsFieldToSwagger(field.settings.arrayOf);
  }else{
    throw new Error("Error in arrayToSwagger: Field Validator missing arrayOf property!")
  }
  return swaggerField;
}

function objectToSwagger(field: IFieldValidatorSerializedObject) {
  const swaggerField: ISwaggerField = {
    type: 'object'
  };
  const outProperties: {[key: string]: ISwaggerField} = {};

  if (typeof field.settings.description === 'string') {
    swaggerField.description = field.settings.description;
  }

  const fvSchema = field.settings.schema;
  if(!fvSchema){
    throw new Error("Error in objectToSwagger: Field Validator missing schema property!")
  }
  const required: string[] = [];
  Object.keys(fvSchema).forEach((k) => {
    if (fvSchema[k].settings.required) {
      required.push(k);
    }
    outProperties[k] = onsFieldToSwagger(fvSchema[k]);
  });
  swaggerField.properties = outProperties;
  if (required.length) {
    swaggerField.required = required;
  }
  return swaggerField;
}

const FIELD_TO_SWAGGER_CONVERT = {
  int32: int32ToSwagger,
  string: stringToSwagger,
  bool: boolToSwagger,
  float64: float64ToSwagger,
  object: objectToSwagger,
  array: arrayToSwagger,
};

function onsFieldToSwagger(field: IFieldValidatorSerialized): ISwaggerField {
  if(typeof field !== 'object' || !field || !field.settings || typeof field.settings.type!=='string'){
    throw new Error("Error: onsFieldToSwagger called on invalid field or field with an unset/undefined type!");
  }
  const typeConvertor = FIELD_TO_SWAGGER_CONVERT[field.settings.type];
  if (
    !FIELD_TO_SWAGGER_CONVERT.hasOwnProperty(field.settings.type) ||
    typeof typeConvertor !== 'function'
  ) {
    throw new Error(`Unsupported type '${field.settings.type}' for swagger!`);
  }
  return typeConvertor(field as any);
}

export { onsFieldToSwagger };
