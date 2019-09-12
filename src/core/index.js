import FieldValidator from './FieldValidator';
import validateMain from './validate';
import { fvToJS, createInstanceFromFV } from './modes';
import { registerValidator, hasValidatorId } from './validatorManager';

function ons(settings, schema) {
  return new FieldValidator(settings, schema);
}
function validate(inputObject, fieldValidator, options) {
  return validateMain(inputObject, fieldValidator, options);
}

export {
  fvToJS,
  createInstanceFromFV,
  ons,
  validate,
  registerValidator,
  hasValidatorId,
};
