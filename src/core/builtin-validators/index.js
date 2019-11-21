import isEmail from './email';
import isMobileNumber from './mobile_number';

import { isUrl } from './url';
import { isIpAddress, isIpV4Address, isIpV6Address } from './ip_address';

import isAlphanumeric from './alphanumeric';
import isHexString from './hex_string';
import isNumericString from './numeric_string';

import isUuid from './uuid';

import isDatetime from './datetime';

const BUILT_IN_VALIDATORS = Object.freeze({
  email: { types: ['string'], fnc: isEmail },

  mobile_number: { types: ['string'], fnc: isMobileNumber },

  url: { types: ['string'], fnc: isUrl },

  ip_address: { types: ['string'], fnc: isIpAddress },
  ipv4: { types: ['string'], fnc: isIpV4Address },
  ipv6: { types: ['string'], fnc: isIpV6Address },

  alphanumeric: { types: ['string'], fnc: isAlphanumeric },
  hex_string: { types: ['string'], fnc: isHexString },
  numeric_string: { types: ['string'], fnc: isNumericString },

  uuid: { types: ['string'], fnc: isUuid },

  datetime: { types: ['string'], fnc: isDatetime }
});

export { BUILT_IN_VALIDATORS };
