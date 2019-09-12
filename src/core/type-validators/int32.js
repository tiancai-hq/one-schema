import { vrError, vrSuccess } from '../validatorResult';

export default function (x, fieldValidator) {
  if (typeof x !== 'number' || x !== ~~x || Number.isNaN(x)) {
    return vrError('is not type number or is not a 32 bit integer');
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
