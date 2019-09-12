export function validatorResult(success, error) {
  return {
    success,
    error: success ? undefined : (`${error}`),
  };
}
export function vrError(errorMessage) {
  return validatorResult(false, errorMessage);
}
export function vrSuccess() {
  return validatorResult(true);
}
