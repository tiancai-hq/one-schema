import {
  FieldDataType, 
  IFieldValidatorSettingsBase,



  IFieldValidatorSettingsBool,
  IFieldValidatorSettingsString,
  IFieldValidatorSettingsInt32,
  IFieldValidatorSettingsFloat64,
  IFieldValidatorSettingsObject,
  IFieldValidatorSettingsArray,
  IValidatorInputOptions,

  IFieldValidatorBase,
  IFieldValidatorReal,
  IFieldValidatorSchema,
} from '../types/core';
import { hasValidatorIdForType } from './validatorManager';

const VALID_TYPES = ['bool', 'string', 'int32', 'float64', 'object', 'array'];

const BASIC_TYPE_CHECKS: { [key: string]: (x: any) => boolean } = {
  bool: (x: any) => typeof x === 'boolean',
  string: (x: any) => (typeof x === 'string' || x === null),
  int32: (x: any) => typeof x === 'number' && !Number.isNaN(x) && Number.isFinite(x) && Math.round(x) === x,
  float64: (x: any) => typeof x === 'number',
  object: (x: any) => typeof x === 'object',
  array: (x: any) => Array.isArray(x),
};
function basicCheckType(type: string, v: any) {
  if (BASIC_TYPE_CHECKS.hasOwnProperty(type) && typeof BASIC_TYPE_CHECKS[type] === 'function') {
    return BASIC_TYPE_CHECKS[type](v);
  }
  return false;
}


class FieldValidatorBase implements IFieldValidatorBase{
  public settings: IFieldValidatorSettingsBase;
  constructor() {
    this.settings = {};
  }
  required(required = true) {
    if (typeof this.settings.type === 'undefined') {
      throw new Error('Must set type before setting options');
    }

    this.settings.required = !!required;
    return this;
  }
  defaultValue(_inputValue: any) {
    throw new Error("You must set type before setting the defaultValue");
    return this;
  }


  tags(tags: string[]) {
    if (typeof this.settings.type === 'undefined') {
      throw new Error('Must set type before setting the example');
    }
    if (!Array.isArray(tags) || !tags.length || tags.filter((t) => (typeof t !== 'string' || !t.length)).length) {
      throw new Error('Field Validator tags must be an array of non-empty strings!');
    }
    this.settings.tags = tags;
    return this;
  }

  description(description: string) {
    if (typeof this.settings.type === 'undefined') {
      throw new Error('Must set type before setting the example');
    }
    if (typeof description !== 'string') {
      throw new Error("'description' must be a string!");
    }
    this.settings.description = description;
    return this;
  }

  example(_example: any) {
    throw new Error("You must set type before setting the example");
    return this;
  }

  validator(validator: IValidatorInputOptions) {
    if (typeof this.settings.type === 'undefined') {
      throw new Error('Must set type before setting the example');
    }
    const tmpValidator = typeof validator === 'string' ? ({ id: validator }) : validator;

    if (typeof tmpValidator !== 'object' || !tmpValidator || !tmpValidator.id) {
      throw new Error('Invalid validator!');
    }
    if (!hasValidatorIdForType(tmpValidator.id, this.settings.type)) {
      throw new Error('Validator not registered!');
    }
    this.settings.validator = tmpValidator;
    return this;
  }
}

class FieldValidatorBool extends FieldValidatorBase implements IFieldValidatorReal {
  public settings: IFieldValidatorSettingsBool;
  constructor(base: IFieldValidatorSettingsBase) {
    super();
    base.type = 'bool';
    this.settings = base as IFieldValidatorSettingsBool;
  }
  defaultValue(inputValue: boolean) {
    if (!basicCheckType(this.settings.type, inputValue)) {
      throw new Error('Invalid defaultValue value');
    }
    this.settings.defaultValue = inputValue;
    return this;
  }
  example(example: boolean) {
    if (!basicCheckType(this.settings.type, example)) {
      throw new Error('Invalid example value');
    }
    this.settings.example = example;
    return this;
  }
  oneOf(inputValues: boolean[]) {
    // TODO: More rigorous check if the elements in oneOf are valid, for now use type info
    if (Array.isArray(inputValues)) {
      inputValues.forEach((v) => {
        if(!basicCheckType(this.settings.type, v)) {
          throw new Error(`Invalid oneOf value '${v}'`);
        }
      });
      this.settings.oneOf = inputValues.concat([]);
    } else {
      this.settings.oneOf = undefined;
    }
    return this;
  }
}
class FieldValidatorString extends FieldValidatorBase implements IFieldValidatorReal {
  public settings: IFieldValidatorSettingsString;
  constructor(base: IFieldValidatorSettingsBase) {
    super();
    base.type = 'string';
    this.settings = base as IFieldValidatorSettingsString;
  }

  defaultValue(inputValue: string) {
    if (!basicCheckType(this.settings.type, inputValue)) {
      throw new Error('Invalid defaultValue value');
    }
    this.settings.defaultValue = inputValue;
    return this;
  }
  example(example: string) {
    if (!basicCheckType(this.settings.type, example)) {
      throw new Error('Invalid example value');
    }
    this.settings.example = example;
    return this;
  }


  max(inputMax: number) {
    if(typeof inputMax !== 'number'){
      throw new Error("Invalid max, must be type number")
    }
    this.settings.max = inputMax;
    return this;
  }

  min(inputMin: number) {
    if(typeof inputMin !== 'number'){
      throw new Error("Invalid min, must be type number")
    }
    this.settings.min = inputMin;
    return this;
  }

  allowNull(allowNull = true) {
    this.settings.allowNull = !!allowNull;
    return this;
  }
  primaryKey(primaryKey = true) {
    this.settings.primaryKey = !!primaryKey;
    return this;
  }

  autoIncrement(autoIncrement = true) {
    this.settings.autoIncrement = !!autoIncrement;
    return this;
  }

  oneOf(inputValues: string[]) {
    // TODO: More rigorous check if the elements in oneOf are valid, for now use type info
    if (Array.isArray(inputValues)) {
      inputValues.forEach((v) => {
        if(!basicCheckType(this.settings.type, v)) {
          throw new Error(`Invalid oneOf value '${v}'`);
        }
      });
      this.settings.oneOf = inputValues.concat([]);
    } else {
      this.settings.oneOf = undefined;
    }
    return this;
  }

  uuid(isUuid = true) {
    this.settings.uuid = isUuid;
    return this;
  }
}

class FieldValidatorInt32 extends FieldValidatorBase implements IFieldValidatorReal {
  public settings: IFieldValidatorSettingsInt32;
  constructor(base: IFieldValidatorSettingsBase) {
    super();
    base.type = 'int32';
    this.settings = base as IFieldValidatorSettingsInt32;
  }

  defaultValue(inputValue: number) {
    if (!basicCheckType(this.settings.type, inputValue)) {
      throw new Error('Invalid defaultValue value');
    }
    this.settings.defaultValue = inputValue;
    return this;
  }
  example(example: number) {
    if (!basicCheckType(this.settings.type, example)) {
      throw new Error('Invalid example value');
    }
    this.settings.example = example;
    return this;
  }


  max(inputMax: number) {
    if(typeof inputMax !== 'number'){
      throw new Error("Invalid max, must be type number")
    }
    this.settings.max = inputMax;
    return this;
  }

  min(inputMin: number) {
    if(typeof inputMin !== 'number'){
      throw new Error("Invalid min, must be type number")
    }
    this.settings.min = inputMin;
    return this;
  }
  primaryKey(primaryKey = true) {
    this.settings.primaryKey = !!primaryKey;
    return this;
  }

  autoIncrement(autoIncrement = true) {
    this.settings.autoIncrement = !!autoIncrement;
    return this;
  }

  oneOf(inputValues: number[]) {
    // TODO: More rigorous check if the elements in oneOf are valid, for now use type info
    if (Array.isArray(inputValues)) {
      inputValues.forEach((v) => {
        if(!basicCheckType(this.settings.type, v)) {
          throw new Error(`Invalid oneOf value '${v}'`);
        }
      });
      this.settings.oneOf = inputValues.concat([]);
    } else {
      this.settings.oneOf = undefined;
    }
    return this;
  }
}
class FieldValidatorFloat64 extends FieldValidatorBase implements IFieldValidatorReal {
  public settings: IFieldValidatorSettingsFloat64;
  constructor(base: IFieldValidatorSettingsBase) {
    super();
    base.type = 'float64';
    this.settings = base as IFieldValidatorSettingsFloat64;
  }

  defaultValue(inputValue: number) {
    if (!basicCheckType(this.settings.type, inputValue)) {
      throw new Error('Invalid defaultValue value');
    }
    this.settings.defaultValue = inputValue;
    return this;
  }
  example(example: number) {
    if (!basicCheckType(this.settings.type, example)) {
      throw new Error('Invalid example value');
    }
    this.settings.example = example;
    return this;
  }


  max(inputMax: number) {
    if(typeof inputMax !== 'number'){
      throw new Error("Invalid max, must be type number")
    }
    this.settings.max = inputMax;
    return this;
  }

  min(inputMin: number) {
    if(typeof inputMin !== 'number'){
      throw new Error("Invalid min, must be type number")
    }
    this.settings.min = inputMin;
    return this;
  }
  oneOf(inputValues: number[]) {
    // TODO: More rigorous check if the elements in oneOf are valid, for now use type info
    if (Array.isArray(inputValues)) {
      inputValues.forEach((v) => {
        if(!basicCheckType(this.settings.type, v)) {
          throw new Error(`Invalid oneOf value '${v}'`);
        }
      });
      this.settings.oneOf = inputValues.concat([]);
    } else {
      this.settings.oneOf = undefined;
    }
    return this;
  }

  allowNaN(allowNaN = true) {
    this.settings.allowNaN = allowNaN;
    return this;
  }
}
class FieldValidatorObject extends FieldValidatorBase implements IFieldValidatorReal {
  public settings: IFieldValidatorSettingsObject;
  constructor(base: IFieldValidatorSettingsBase) {
    super();
    base.type = 'object';
    this.settings = base as IFieldValidatorSettingsObject;
  }

  defaultValue(inputValue: Record<string, unknown>) {
    if (!basicCheckType(this.settings.type, inputValue)) {
      throw new Error('Invalid defaultValue value');
    }
    this.settings.defaultValue = inputValue;
    return this;
  }
  example(example: Record<string, unknown>) {
    if (!basicCheckType(this.settings.type, example)) {
      throw new Error('Invalid example value');
    }
    this.settings.example = example;
    return this;
  }

  schema(inputSchema: IFieldValidatorSchema) {
    this.settings.schema = inputSchema;
    return this;
  }
}
class FieldValidatorArray extends FieldValidatorBase implements IFieldValidatorReal {
  public settings: IFieldValidatorSettingsArray;
  constructor(base: IFieldValidatorSettingsBase) {
    super();
    base.type = 'array';
    this.settings = base as IFieldValidatorSettingsArray;
  }

  defaultValue(inputValue: any[]) {
    if (!basicCheckType(this.settings.type, inputValue)) {
      throw new Error('Invalid defaultValue value');
    }
    this.settings.defaultValue = inputValue;
    return this;
  }
  example(example: any[]) {
    if (!basicCheckType(this.settings.type, example)) {
      throw new Error('Invalid example value');
    }
    this.settings.example = example;
    return this;
  }

  max(inputMax: number) {
    if(typeof inputMax !== 'number'){
      throw new Error("Invalid max, must be type number")
    }
    this.settings.max = inputMax;
    return this;
  }

  min(inputMin: number) {
    if(typeof inputMin !== 'number'){
      throw new Error("Invalid min, must be type number")
    }
    this.settings.min = inputMin;
    return this;
  }
  arrayOf(inputSchema: IFieldValidatorReal) {
    if(!inputSchema||!inputSchema.settings||!inputSchema.settings.type || VALID_TYPES.indexOf(inputSchema.settings.type)===-1){
      throw new Error("Invalid input schema provided to arrayOf: input undefined or input type undefined/not set!")
    }
    this.settings.arrayOf = inputSchema;
    return this;
  }
}

function assignToThis(inputThis: any, fv: any){
  Object.keys(fv).forEach(k=>{
    if(typeof fv[k] === 'function'){
      inputThis[k] = fv[k].bind(fv);
    }else{
      inputThis[k] = fv[k];
    }
  });
  return fv;
}

class FieldValidatorStart extends FieldValidatorBase{
  constructor() {
    super();


  }
  bool() {
    return assignToThis(this, new FieldValidatorBool({}));
  }
  
  string() {
    return assignToThis(this, new FieldValidatorString({}));
  }
  
  int32() {
    return assignToThis(this, new FieldValidatorInt32({}));
  }
  
  float64() {
    return assignToThis(this, new FieldValidatorFloat64({}));
  }
  object(schema?: IFieldValidatorSchema) {
    const fv = new FieldValidatorObject({});
    if(schema){
      return assignToThis(this, fv.schema(schema));
    }else{
      return assignToThis(this, fv);
    }
  }

  obj(schema: any) {
    return this.object(schema);
  }
  array() {
    return assignToThis(this, new FieldValidatorArray({}));
  }
  type(inputType: FieldDataType) {
    if (
      typeof inputType !== 'string' ||
      VALID_TYPES.indexOf(inputType) === -1 ||
      typeof this[inputType] !== 'function' ||
      (inputType + "") === 'type'
    ) {
      throw new Error(`Invalid type ${inputType}`);
    }
    return this[inputType]();
  }

  arrayOf(schema: IFieldValidatorReal) {
    const fv = new FieldValidatorArray({});
    if(schema){
      return assignToThis(this, fv.arrayOf(schema));
    }else{
      return assignToThis(this, fv);
    }
  }
}
type FieldValidatorInstance = FieldValidatorBool | FieldValidatorString | FieldValidatorInt32 | FieldValidatorFloat64 | FieldValidatorObject | FieldValidatorArray;
type FieldValidatorPrimitive = FieldValidatorBool | FieldValidatorString | FieldValidatorInt32 | FieldValidatorFloat64;
export {
  FieldValidatorBase,

  FieldValidatorBool,
  FieldValidatorString,
  FieldValidatorInt32,
  FieldValidatorFloat64,
  FieldValidatorObject,
  FieldValidatorArray,

  FieldValidatorInstance,
  FieldValidatorPrimitive,
  VALID_TYPES,
}
export default FieldValidatorStart;
