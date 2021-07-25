import { IValidateResult } from "../types/core";


export function validatorResult(success: boolean, error?: string): IValidateResult {
  return {
    success,
    error: success ? undefined : (`${error}`),
  };
}
export function vrError(errorMessage: string): IValidateResult {
  return validatorResult(false, errorMessage);
}
export function vrSuccess(): IValidateResult {
  return validatorResult(true);
}
