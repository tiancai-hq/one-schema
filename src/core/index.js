import FieldValidator from './FieldValidator';
import validate from './validate';

export function ons(settings, schema) {
  return new FieldValidator(settings, schema);
}
export function validateObject(inputObject, schema, options) {
  return validate(inputObject, schema, options);
}
