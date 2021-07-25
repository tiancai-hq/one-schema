import {
  fvToJS,
  createInstanceFromFV,
  ons as basicOns,
  validate,
  registerValidator,
  hasValidatorId,
} from './core';

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

} from './types/core';
interface OnsTools {
  registerValidator: typeof registerValidator;
  hasValidatorId: typeof hasValidatorId;
  fvToJS: typeof fvToJS;
  createInstanceFromFV: typeof createInstanceFromFV;
  validate: typeof validate;
  ons: typeof basicOns;
}
type IOnsHelper = typeof basicOns & OnsTools;

const ons: IOnsHelper = basicOns as IOnsHelper;
ons.registerValidator = registerValidator;
ons.hasValidatorId = hasValidatorId;
ons.fvToJS = fvToJS;
ons.createInstanceFromFV = createInstanceFromFV;
ons.validate = validate;

export default ons;

export {
  fvToJS,
  createInstanceFromFV,
  ons,
  validate,
  registerValidator,
  hasValidatorId,
};
