import { vrError, vrSuccess } from './validatorResult';
import { PRIMITIVE_TYPE_VALIDATORS } from './type-validators';
import { runExternalValidator } from './validatorManager';

function sanitizeKeys(input, schema) {
  const arr = Object.keys(input);
  for (let i = 0, l = arr.length; i < l; i++) {
    if (!schema.hasOwnProperty(arr[i])) {
      return vrError(`Invalid parameter ${arr[i]}`);
    }
  }
  return vrSuccess();
}

function validatePrimitive(value, fieldValidator, options) {
  const typeFunc = PRIMITIVE_TYPE_VALIDATORS[fieldValidator.settings.type];
  if (!typeFunc) {
    return vrError(`invalid type ${fieldValidator.settings.type}`);
  }
  const result = typeFunc(value, fieldValidator, options);
  return result;
}

function validateArrayField(value, fieldValidator, options) {
  if (!Array.isArray(value)) {
    return vrError('is not array');
  }
  const { min, max, arrayOf } = fieldValidator.settings;
  const valLength = value.length;
  if (typeof min === 'number' && valLength < min) {
    return vrError(`is less than minimum length ${min}`);
  }
  if (typeof max === 'number' && valLength < max) {
    return vrError(`is larger than maximum length ${max}`);
  }
  for (let i = 0; i < valLength; i++) {
    const result = validate(value[i], arrayOf, options);
    if (!result.success) {
      return result;
    }
  }
  return vrSuccess();
}
function validateObject(input, fieldValidator, options) {
  const fvSchema = fieldValidator.settings.schema;
  const result = sanitizeKeys(input, fvSchema);
  if (!result.success) {
    return result;
  }
  const keys = Object.keys(fvSchema);
  const keysLength = keys.length;
  for (let i = 0; i < keysLength; i++) {
    const r = validate(input[keys[i]], fvSchema[keys[i]], options);
    if (!r.success) {
      r.error = `${keys[i]} -> ${r.error}`;
      return r;
    }
  }
  return vrSuccess();
}
export default function validate(input, fieldValidator, options = {}) {
  const { type, required, validator, oneOf } = fieldValidator.settings;
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
    result = validatePrimitive(input, fieldValidator, options);
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
