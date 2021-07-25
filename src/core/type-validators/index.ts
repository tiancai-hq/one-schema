import boolValidator from './bool';
import float64Validator from './float64';
import stringValidator from './string';
import int32Validator from './int32';
import { IValidateOptions, IValidateResult } from '../../types/core';

export const PRIMITIVE_TYPE_VALIDATORS: {[key: string]: (x: any, fieldValidator: any, options: IValidateOptions)=>IValidateResult} = {
  bool: boolValidator,
  float64: float64Validator,
  string: stringValidator,
  int32: int32Validator,
};
