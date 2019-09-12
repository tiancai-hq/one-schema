import email from './email';
import mobileNumber from './mobile_number';

const BUILT_IN_VALIDATORS = Object.freeze({
  email: { types: ['string'], fnc: email },
  mobile_number: { types: ['string'], fnc: mobileNumber },
});

export { BUILT_IN_VALIDATORS };
