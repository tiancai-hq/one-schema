export function isInt32Number(x: any) {
  return typeof x === 'number' && x === ~~x;
}
