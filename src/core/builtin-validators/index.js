import email from './email';
import mobileNumber from './mobile_number';
import url from './url';

const BUILT_IN_VALIDATORS = Object.freeze({
  email: { types: ['string'], fnc: email },
  mobile_number: { types: ['string'], fnc: mobileNumber },
  url: { types: ['string'], fnc: url },
});

export { BUILT_IN_VALIDATORS };
