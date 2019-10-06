/* eslint-disable */
const VALID_ATTR_CHAR_CODES = [36, 48, 65, 95, 97, 170, 181, 183, 186, 192, 216, 248, 710, 736, 748, 750, 768, 880, 886, 890, 895, 902, 904, 908, 910, 931, 1015, 1155, 1162, 1329, 1369, 1376, 1425, 1471, 1473, 1476, 1479, 1488, 1519, 1552, 1568, 1646, 1649, 1749, 1759, 1765, 1770, 1774, 1786, 1791, 1808, 1810, 1869, 4992, 5024, 5112, 5121, 8469, 8472, 8484, 8486, 8488, 8490, 8508, 8517, 8526, 8544, 11744, 12293, 12321, 12337, 12344, 12353, 12441, 12443, 12449, 12540, 12549, 12593, 12704, 12784, 13312, 19968];
const VALID_ATTR_CC_START = [1, 0, 26, 1, 26, 1, 1, 0, 1, 23, 31, 458, 12, 5, 1, 1, 0, 5, 2, 4, 1, 1, 3, 1, 20, 83, 139, 0, 166, 38, 1, 41, 0, 0, 0, 0, 0, 27, 4, 0, 43, 2, 99, 1, 0, 2, 0, 2, 3, 1, 1, 30, 89, 16, 86, 6, 620, 1, 6, 1, 1, 1, 16, 4, 5, 1, 41, 0, 3, 9, 5, 5, 86, 0, 5, 90, 4, 43, 94, 27, 16, 6582, 20976];
const VALID_ATTR_CC_MIDDLE = [1, 10, 26, 1, 26, 1, 1, 1, 1, 23, 31, 458, 12, 5, 1, 1, 112, 5, 2, 4, 1, 2, 3, 1, 20, 83, 139, 5, 166, 38, 1, 41, 45, 1, 2, 2, 1, 27, 4, 11, 74, 3, 99, 8, 6, 4, 4, 12, 3, 1, 2, 57, 100, 16, 86, 6, 620, 1, 6, 1, 1, 1, 16, 4, 5, 1, 41, 32, 3, 15, 5, 5, 86, 2, 5, 90, 4, 43, 94, 27, 16, 6582, 20976];
/* eslint-enable */

function binSearchIndex(arr, x, start, end) {
  if (start === end || x <= arr[start]) {
    return start;
  } if (x >= arr[end]) {
    return end;
  }
  const mid = Math.floor((start + end) / 2);
  const midVal = arr[mid];

  if (x === midVal) {
    return mid;
  } if (mid === start) {
    return end;
  } if (x < midVal) {
    return binSearchIndex(arr, x, start, mid - 1);
  }
  return binSearchIndex(arr, x, mid + 1, end);
}

function isValidAttrCharCode(cc, isStart) {
  if (typeof cc !== 'number' || cc < VALID_ATTR_CHAR_CODES[0]) {
    return false;
  }
  const tInd = binSearchIndex(VALID_ATTR_CHAR_CODES, cc, 0, VALID_ATTR_CHAR_CODES.length - 1);
  const vArrayIndex = (cc < VALID_ATTR_CHAR_CODES[tInd]) ? (tInd - 1) : tInd;

  const validValue = VALID_ATTR_CHAR_CODES[vArrayIndex];
  const dif = cc - validValue;
  const okAmt = isStart ? VALID_ATTR_CC_START[vArrayIndex] : VALID_ATTR_CC_MIDDLE[vArrayIndex];

  return dif < okAmt;
}
function isValidAttrName(attrName) {
  if (typeof attrName !== 'string' || !attrName.length) {
    return false;
  }
  if (!isValidAttrCharCode(attrName.charCodeAt(0), true)) {
    return false;
  }
  const len = attrName.length;
  for (let i = 1; i < len; i++) {
    if (!isValidAttrCharCode(attrName.charCodeAt(i), false)) {
      return false;
    }
  }
  return true;
}


module.exports = { isValidAttrName };
