import { vrError, vrSuccess } from '../validatorResult';

export default function (x, fieldValidator, options) {
  const { min, max, allowNull, uuid } = fieldValidator.settings;

  if (x === null) {
    return allowNull ? vrSuccess() : vrError('is null');
  }

  if (typeof x !== 'string') {
    return vrError('is not type string');
  }

  if (uuid) {
    const uuidParts = x.split('-');
    if (
      uuidParts.length !== 5 ||
      uuidParts[0].length !== 8 ||
      uuidParts[1].length !== 4 ||
      uuidParts[2].length !== 4 ||
      uuidParts[3].length !== 4 ||
      uuidParts[4].length !== 12
    ) {
      return vrError('is not valid uuid format');
    }

    const hexExp = /^[0-9a-fA-F]+$/;
    for (let i = 0; i < uuidParts.length; i++) {
      const uuidPart = uuidParts[i];
      if (!hexExp.test(uuidPart)) {
        return vrError('is not valid uuid format');
      }
    }
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
