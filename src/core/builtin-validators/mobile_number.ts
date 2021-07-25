function validateMobilePhoneString(input: string) {
  if (input.charAt(1) === '1') {
    // USA, +1|AAABBBCCCC
    return input.length === 12;
  } if (input.substring(1, 4) === '852') {
    // HKG, +852|AAAABBBB
    return input.length === 12;
  } if (input.substring(1, 3) === '86') {
    // /CHN, +86|1AABBBBCCCC
    return input.length === 14 && input.charAt(3) === '1';
  }
  return true;
}

export default (input: string) => {
  if (typeof input !== 'string') {
    return false;
  }
  const len = input.length;

  return len <= 48 &&
    len >= 8 &&
    input.charAt(0) === '+' &&
    !(/[^0-9]/.test(input.substring(1))) &&
    validateMobilePhoneString(input);
};
