import { vrError, vrSuccess } from './validatorResult';

import { BUILT_IN_VALIDATORS } from './builtin-validators';

import {FieldDataType, IValidatorDefinition} from '../types/core';
const USER_DEFINED_VALIDATORS : {[id: string]: IValidatorDefinition} = {};

function getValidatorObjectForId(id: string) {
  if (BUILT_IN_VALIDATORS.hasOwnProperty(id)) {
    return BUILT_IN_VALIDATORS[id];
  } if (USER_DEFINED_VALIDATORS.hasOwnProperty(id)) {
    return USER_DEFINED_VALIDATORS[id];
  }
  return null;
}
export function hasValidatorId(id: string, fieldValidator?: any) {
  const type = fieldValidator ? fieldValidator.settings.type : null;
  const validatorDef = getValidatorObjectForId(id);
  if (!validatorDef) {
    return false;
  } if (type && Array.isArray(validatorDef.types)) {
    return validatorDef.types.indexOf(type) !== -1;
  }
  return true;
}
export function hasValidatorIdForType(id: string, type?: FieldDataType) {
  const validatorDef = getValidatorObjectForId(id);
  if (!validatorDef) {
    return false;
  } if (type && Array.isArray(validatorDef.types)) {
    return validatorDef.types.indexOf(type) !== -1;
  }
  return true;
}
export function runExternalValidator(value: any, validatorOptions: any, fieldValidator: any) {
  if (!validatorOptions || typeof validatorOptions.id !== 'string') {
    return vrError('has an invalid validator');
  }
  const vid = validatorOptions.id;

  const validatorDef = getValidatorObjectForId(vid);
  if (!validatorDef) {
    return vrError(`Invalid validator id ${vid}`);
  }

  const validatorFunction = validatorDef.fnc;
  if (typeof validatorFunction !== 'function') {
    return vrError(`Missing function for validator id: ${vid}`);
  }


  const { type } = fieldValidator.settings;
  if (Array.isArray(validatorDef.types)) {
    if (validatorDef.types.indexOf(type) === -1) {
      return vrError(`Invalid type ${type} for ${vid}`);
    }
  }

  if (validatorFunction(value, validatorOptions)) {
    return vrSuccess();
  }
  return vrError(`validation check failed for validator id ${vid}`);
}
export function registerValidator(id: string, fnc: (value: any, validatorOptions: any)=>boolean, allowedTypes: FieldDataType[]) {
  if (BUILT_IN_VALIDATORS.hasOwnProperty(id)) {
    throw new Error(`Already registered builtin validator with id ${id}`);
  }
  if (USER_DEFINED_VALIDATORS.hasOwnProperty(id)) {
    throw new Error(`Already registered user defined validator with id ${id}`);
  }
  if (typeof fnc !== 'function') {
    throw new Error(`Missing function for validator ${id}!`);
  }
  if (typeof allowedTypes !== 'undefined' && !Array.isArray(allowedTypes)) {
    throw new Error(`allowedTypes defined as non array with id ${id}`);
  }

  const validatorObject: IValidatorDefinition = {
    fnc: fnc,
    types: Array.isArray(allowedTypes)?allowedTypes.concat([]):undefined,
  };

  USER_DEFINED_VALIDATORS[id] = validatorObject;
}
