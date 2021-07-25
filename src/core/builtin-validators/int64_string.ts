function checkIsInt64Digits(x: string, isNeg: boolean) {
  const neg = isNeg === true;
  if (typeof x === 'string') {
    const len = x.length;
    const INT64_DIGITS = [
      0x39, 0x32, 0x32, 0x33,
      0x33, 0x37, 0x32, 0x30,
      0x33, 0x36, 0x38, 0x35,
      0x34, 0x37, 0x37, 0x35,
      0x38, 0x30, neg === true ? 0x38 : 0x37,
    ];
    if (len > 0 && len < 19) {
      return !(/[^0-9]/.test(x));
    } if (len === 19 && !(/[^0-9]/.test(x))) {
      for (let i = 0; i < 19; i++) {
        const c = INT64_DIGITS[i] - x.charCodeAt(i);
        if (c > 0) {
          return true;
        } if (c < 0) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  return false;
}


export default (input: string) => (typeof input === 'string' && input.length !== 0 && (
  input.charAt(0) === '-' ? checkIsInt64Digits(input.substring(1), true) : checkIsInt64Digits(input, false)
)
);
