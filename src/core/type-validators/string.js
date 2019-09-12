import { vrError, vrSuccess } from '../validatorResult';

export default function (x, fieldValidator) {
  const { min, max, allowNull } = fieldValidator.settings;

  if (x === null) {
    return allowNull ? vrSuccess() : vrError('is null');
  }

  if (typeof x !== 'string') {
    return vrError('is not type string');
  }
  const len = x.length;

  if (typeof min === 'number' && len < min) {
    return vrError(`has a length less than minimum the value: ${min}`);
  }

  if (typeof max === 'number' && len > max) {
    return vrError(`has a length greater than the maximum value: ${max}`);
  }


  return vrSuccess();
}
