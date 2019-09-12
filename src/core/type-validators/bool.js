import { vrError, vrSuccess } from '../validatorResult';

export default function (x, fieldValidator) {
  if (typeof x !== 'boolean') {
    return vrError('is not type boolean');
  }
  return vrSuccess();
}
