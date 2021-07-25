export default (input: string) => {
  if (typeof input !== 'string') {
    return false;
  }
  const atInd = input.lastIndexOf('@');
  const dotInd = input.lastIndexOf('.');
  const len = input.length;

  return len > 4 && // "a@a.a" is smallest size
    atInd === input.indexOf('@') && // no multiple @ symbols in email
    atInd > 0 && // no "@.com"
    (dotInd - atInd) > 1 && // no "a@.com"
    dotInd !== (len - 1); // no dot at end of email
};
