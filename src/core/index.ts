import FieldValidator from './FieldValidator';
import validateMain from './validate';
import { fvToJS, createInstanceFromFV } from './modes';
import { registerValidator, hasValidatorId } from './validatorManager';
import { IFieldValidatorSerialized, IValidateOptions } from '../types/core';

function ons() {
  return new FieldValidator();
}
function validate(input: any, fieldValidator: IFieldValidatorSerialized, options?: IValidateOptions) {
  return validateMain(input, fieldValidator, options);
}

export {
  fvToJS,
  createInstanceFromFV,
  ons,
  validate,
  registerValidator,
  hasValidatorId,
};
