import { vrError, vrSuccess } from '../validatorResult';

export default function (x, fieldValidator) {
  if (typeof x !== 'number') {
    return vrError('is not type number');
  }


  if (x === Infinity || x === -Infinity) {
    return vrError('is Infinity or -Infinity');
  }
  const { min, max, allowNaN } = fieldValidator.settings;

  if (!allowNaN && Number.isNaN(x)) {
    return vrError('is NaN');
  }


  if (typeof min === 'number' && x < min) {
    return vrError(`is less than minimum value: ${min}`);
  }

  if (typeof max === 'number' && x > max) {
    return vrError(`is greater than maximum value: ${max}`);
  }

  return vrSuccess();
}
