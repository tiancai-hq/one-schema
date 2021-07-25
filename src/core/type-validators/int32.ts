import { IValidateOptions } from '../../types/core';
import { FieldValidatorInt32 } from '../FieldValidator';
import { vrError, vrSuccess } from '../validatorResult';

export default function (x: any, fieldValidator: FieldValidatorInt32, options: IValidateOptions) {
  if (typeof x !== 'number' || x !== ~~x || Number.isNaN(x)) {
    return vrError('is not type number or is not a 32 bit integer');
  }

  if (options.typeOnly) {
    return vrSuccess();
  }
  const { min, max } = fieldValidator.settings;

  if (typeof min === 'number' && x < min) {
    return vrError(`is less than minimum value: ${min}`);
  }

  if (typeof max === 'number' && x > max) {
    return vrError(`is greater than maximum value: ${max}`);
  }


  return vrSuccess();
}
