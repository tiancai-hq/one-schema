type FieldDataType = 'bool' | 'string' | 'int32' | 'float64' | 'object' | 'array';

interface IValidatorDefinition {
  fnc: (value: any, validatorOptions: any)=>boolean;
  types?: FieldDataType[];


}
type IValidatorInputOptions = {id: string} & {[key: string]: any};

/*
interface IFieldValidatorSettingsOld {
  type?: FieldDataType;
  schema?: any;
  max?: number;
  min?: number;
  required?: boolean;
  allowNull?: boolean;
  primaryKey?: boolean;
  autoIncrement?: true;
  defaultValue?: any;
  oneOf?: any[];
  arrayOf?: IFieldValidatorPlaceholder;
  allowNaN?: boolean;
  tags?: string[];
  description?: any;
  example?: any;
  validator?: IValidatorInputOptions;
  uuid?: boolean;
}

interface IFieldValidatorSettingsOptional{
  schema?: any;
  max?: number;
  min?: number;
  allowNull?: boolean;
  primaryKey?: boolean;
  autoIncrement?: true;
  oneOf?: any[];
  arrayOf?: IFieldValidatorPlaceholder;
  allowNaN?: boolean;
  uuid?: boolean;
}
*/
interface IFieldValidatorSettingsBase {
  type?: FieldDataType;
  required?: boolean;
  defaultValue?: any;
  tags?: string[];
  description?: any;
  example?: any;
  validator?: IValidatorInputOptions;
}
interface IFieldValidatorSettingsBool extends IFieldValidatorSettingsBase {
  type: 'bool';
  defaultValue?: boolean;
  example?: boolean;

  oneOf?: boolean[];
}
interface IFieldValidatorSettingsString extends IFieldValidatorSettingsBase {
  type: 'string';
  defaultValue?: string;
  example?: string;

  max?: number;
  min?: number;
  allowNull?: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  oneOf?: (string | null)[];
  uuid?: boolean;
}
interface IFieldValidatorSettingsInt32 extends IFieldValidatorSettingsBase {
  type: 'int32';
  defaultValue?: number;
  example?: number;

  max?: number;
  min?: number;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  oneOf?: number[];
}
interface IFieldValidatorSettingsFloat64 extends IFieldValidatorSettingsBase {
  type: 'float64';
  defaultValue?: number;
  example?: number;

  max?: number;
  min?: number;
  oneOf?: number[];
  allowNaN?: boolean;
}
interface IFieldValidatorSettingsObject extends IFieldValidatorSettingsBase {
  type: 'object';
  defaultValue?: Record<string, unknown>;
  example?: Record<string, unknown>;

  schema?: IFieldValidatorSchema;
}
interface IFieldValidatorSettingsArray extends IFieldValidatorSettingsBase {
  type: 'array';
  defaultValue?: any[];
  example?: any[];

  max?: number;
  min?: number;
  arrayOf?: IFieldValidatorSerializedReal;
}
interface IFieldValidatorSettingsNone extends IFieldValidatorSettingsBase {
  type: undefined;
}


type IFieldValidatorSettingsReal = IFieldValidatorSettingsBool | IFieldValidatorSettingsString | IFieldValidatorSettingsInt32 | IFieldValidatorSettingsFloat64 | IFieldValidatorSettingsObject | IFieldValidatorSettingsArray;

interface IFieldValidatorSerialized {
  settings: IFieldValidatorSettingsNone | IFieldValidatorSettingsBool | IFieldValidatorSettingsString | IFieldValidatorSettingsInt32 | IFieldValidatorSettingsFloat64 | IFieldValidatorSettingsObject | IFieldValidatorSettingsArray;

}

interface IFieldValidatorSerializedReal {
  settings: IFieldValidatorSettingsReal;

}
interface IFieldValidatorSerializedBool {
  settings: IFieldValidatorSettingsBool;
}
interface IFieldValidatorSerializedString {
  settings: IFieldValidatorSettingsString;
}
interface IFieldValidatorSerializedInt32 {
  settings: IFieldValidatorSettingsInt32;
}
interface IFieldValidatorSerializedFloat64 {
  settings: IFieldValidatorSettingsFloat64;
}
interface IFieldValidatorSerializedObject {
  settings: IFieldValidatorSettingsObject;
}
interface IFieldValidatorSerializedArray {
  settings: IFieldValidatorSettingsArray;
}
interface IFieldValidatorSerializedNone {
  settings: IFieldValidatorSettingsNone;
}
//type IFieldValidatorSerializedReal =  IFieldValidatorSerializedBool | IFieldValidatorSerializedString | IFieldValidatorSerializedInt32 | IFieldValidatorSerializedFloat64 | IFieldValidatorSerializedObject | IFieldValidatorSerializedArray;


interface IFieldValidatorBase extends IFieldValidatorSerialized {
  settings:  IFieldValidatorSettingsNone | IFieldValidatorSettingsReal;

  required(required?: boolean): IFieldValidatorBase;
  defaultValue(defaultValue: any): IFieldValidatorBase;
  tags(tags: string[]): IFieldValidatorBase;
  description(description: string): IFieldValidatorBase;
  example(example: any): IFieldValidatorBase;
  validator(validator: IValidatorInputOptions): IFieldValidatorBase;
}
interface IFieldValidatorReal extends IFieldValidatorBase {
  settings:  IFieldValidatorSettingsReal;
}
interface IValidateOptions {
  typeOnly?: boolean;
  noRequired?: boolean;
}
interface IValidateResult {
  error?: string;
  success: boolean;
}
type IFieldValidatorSchema = {[key: string]: IFieldValidatorSerializedReal};

export {
  FieldDataType,

  IValidatorDefinition,

  IFieldValidatorSettingsBase,
  IFieldValidatorSettingsBool,
  IFieldValidatorSettingsString,
  IFieldValidatorSettingsInt32,
  IFieldValidatorSettingsFloat64,
  IFieldValidatorSettingsObject,
  IFieldValidatorSettingsArray,
  IFieldValidatorSettingsReal,

  IValidatorInputOptions,

  IFieldValidatorSchema,

  IFieldValidatorSerialized,
  IFieldValidatorSerializedReal,
  IFieldValidatorSerializedNone,
  IFieldValidatorSerializedBool,
  IFieldValidatorSerializedString,
  IFieldValidatorSerializedInt32,
  IFieldValidatorSerializedFloat64,
  IFieldValidatorSerializedObject,
  IFieldValidatorSerializedArray,

  IFieldValidatorBase,
  IFieldValidatorReal,
  
  IValidateOptions,
  IValidateResult,

}