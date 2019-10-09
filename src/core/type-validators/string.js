import { vrError, vrSuccess } from '../validatorResult';

export default function (x, fieldValidator, options) {
  const { min, max, allowNull } = fieldValidator.settings;

  if (x === null) {
    return allowNull ? vrSuccess() : vrError('is null');
  }

  if (typeof x !== 'string') {
    return vrError('is not type string');
  }

  if (options.typeOnly) {
    return vrSuccess();
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
