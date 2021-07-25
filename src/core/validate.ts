import { vrError, vrSuccess } from './validatorResult';
import { PRIMITIVE_TYPE_VALIDATORS } from './type-validators';
import { runExternalValidator } from './validatorManager';
import { IFieldValidatorSchema, IFieldValidatorSerialized, IValidateOptions, IValidateResult } from '../types/core';
import { FieldValidatorInstance, FieldValidatorPrimitive } from './FieldValidator';

function sanitizeKeys(input: {[key: string]: any}, schema: IFieldValidatorSchema) {
  const arr = Object.keys(input);
  for (let i = 0, l = arr.length; i < l; i++) {
    if (!schema.hasOwnProperty(arr[i])) {
      return vrError(`Invalid parameter ${arr[i]}`);
    }
  }
  return vrSuccess();
}

function validatePrimitive(value: any, fieldValidator: FieldValidatorPrimitive, options: IValidateOptions) {
  const typeFunc = PRIMITIVE_TYPE_VALIDATORS[fieldValidator.settings.type];
  if (!typeFunc) {
    return vrError(`invalid type ${fieldValidator.settings.type}`);
  }
  const result = typeFunc(value, fieldValidator, options);
  return result;
}

function validateArrayField(value: any, fieldValidator: IFieldValidatorSerialized, options: IValidateOptions) {
  if(fieldValidator.settings.type !== 'array'){
    throw new Error("validateObject called on non object type!");
  }
  if (!Array.isArray(value)) {
    return vrError('is not array');
  }
  const { min, max, arrayOf } = fieldValidator.settings;
  if(!arrayOf){
    return vrError("Missing schema for array field!");
  }
  const valLength = value.length;
  if (typeof min === 'number' && valLength < min) {
    return vrError(`is less than minimum length ${min}`);
  }
  if (typeof max === 'number' && valLength > max) {
    return vrError(`is larger than maximum length ${max}`);
  }
  for (let i = 0; i < valLength; i++) {
    const result = validate(value[i], arrayOf as FieldValidatorInstance, options);
    if (!result.success) {
      return result;
    }
  }
  return vrSuccess();
}
function validateObject(input: {[key: string]: any}, fieldValidator: IFieldValidatorSerialized, options: IValidateOptions) {
  if(fieldValidator.settings.type !== 'object'){
    throw new Error("validateObject called on non object type!");
  }
  const fvSchema = fieldValidator.settings.schema;
  if(!fvSchema){
    return vrError("Missing schema for object field!");
  }
  const result = sanitizeKeys(input, fvSchema);
  if (!result.success) {
    return result;
  }
  const keys = Object.keys(fvSchema);
  const keysLength = keys.length;
  for (let i = 0; i < keysLength; i++) {
    const r = validate(input[keys[i]], fvSchema[keys[i]] as IFieldValidatorSerialized, options);
    if (!r.success) {
      r.error = `${keys[i]} -> ${r.error}`;
      return r;
    }
  }
  return vrSuccess();
}
export default function validate(input: any, fieldValidator: IFieldValidatorSerialized, options: IValidateOptions = {}): IValidateResult {
  const { type, required, validator } = fieldValidator.settings;
  if (typeof input === 'undefined') {
    if (required && !options.noRequired) {
      return vrError('is undefined, but required!');
    }
    return vrSuccess();
  }
  let result = null;
  if (type === 'object') {
    result = validateObject(input, fieldValidator, options);
  } else if (type === 'array') {
    result = validateArrayField(input, fieldValidator, options);
  } else {
    const primFieldValidator = fieldValidator as FieldValidatorPrimitive;
    result = validatePrimitive(input, primFieldValidator, options);
    const oneOf: any[]= primFieldValidator.settings.oneOf as any[];
    if (Array.isArray(oneOf) && oneOf.indexOf(input) === -1) {
      return vrError('is not a valid element of the oneOf array');
    }
  }

  if (!result.success) {
    return result;
  }

  if (typeof validator === 'object' && validator && validator.id) {
    return runExternalValidator(input, validator, fieldValidator);
  }
  return vrSuccess();
}
