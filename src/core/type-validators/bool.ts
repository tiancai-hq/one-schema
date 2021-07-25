import { IValidateOptions } from '../../types/core';
import { FieldValidatorBool } from '../FieldValidator';
import { vrError, vrSuccess } from '../validatorResult';

export default function (x: any, _fieldValidator: FieldValidatorBool, _options: IValidateOptions) {
  if (typeof x !== 'boolean') {
    return vrError('is not type boolean');
  }
  return vrSuccess();
}
