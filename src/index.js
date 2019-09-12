import {
  fvToJS,
  createInstanceFromFV,
  ons,
  validate,
  registerValidator,
  hasValidatorId,
} from './core';

ons.registerValidator = registerValidator;
ons.hasValidatorId = hasValidatorId;
ons.fvToJS = fvToJS;
ons.createInstanceFromFV = createInstanceFromFV;
ons.validate = validate;

export default ons;

export {
  fvToJS,
  createInstanceFromFV,
  ons,
  validate,
  registerValidator,
  hasValidatorId,
};
