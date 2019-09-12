export function isInt32Number(x) {
  return typeof x === 'number' && x === ~~x;
}
