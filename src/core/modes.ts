import FieldValidator, { FieldValidatorInstance, VALID_TYPES } from './FieldValidator';
import { isValidAttrName } from '../utils/validAttribute';
import { IFieldValidatorSerialized } from '../types/core';

const fvInstanceByType: {[key: string]: any} = {
  "bool": new FieldValidator().bool(),
  "string": new FieldValidator().string(),
  "int32": new FieldValidator().int32(),
  "float64": new FieldValidator().float64(),
  "object": new FieldValidator().object(),
  "array": new FieldValidator().array(),
};

const emptyValArgs: {[key: string]: any} = {
  allowNaN: new FieldValidator().float64().allowNaN().settings.allowNaN,
  required: new FieldValidator().float64().required().settings.required,
  allowNull: new FieldValidator().string().allowNull().settings.allowNull,
  primaryKey: new FieldValidator().int32().primaryKey().settings.primaryKey,
  autoIncrement: new FieldValidator().int32().autoIncrement().settings.autoIncrement,
  uuid: new FieldValidator().string().uuid().settings.uuid,
};


function createInstanceFromFVMain(fieldValidator: IFieldValidatorSerialized) {
  const base = new FieldValidator();
  if(!fieldValidator.settings.type || VALID_TYPES.indexOf(fieldValidator.settings.type)===-1){
    throw new Error("Invalid field validator type: "+fieldValidator.settings.type)
  }
  const root = base[fieldValidator.settings.type]();
  Object.assign(root.settings, fieldValidator.settings);
  const { arrayOf, schema } = root.settings;
  if (arrayOf && arrayOf.settings) {
    root.settings.arrayOf = createInstanceFromFVMain(arrayOf);
  }
  if (schema) {
    const nSchema: {[key: string]: FieldValidatorInstance} = {};
    Object.keys(schema).forEach((k) => {
      if (schema[k] && schema[k].settings) {
        nSchema[k] = createInstanceFromFVMain(schema[k]);
      }
    });
    root.settings.schema = nSchema;
  }
  return root;
}

export function createInstanceFromFV(fieldValidator: IFieldValidatorSerialized) {
  return createInstanceFromFVMain(JSON.parse(JSON.stringify(fieldValidator)));
}
function generateFVSettingsJS(settingsK: any, k: string) {
  if (emptyValArgs[k] === settingsK) {
    return `${k}()`;
  } if (k === 'validator' && settingsK && typeof settingsK === 'object') {
    if (typeof settingsK.id === 'string' && Object.keys(settingsK).length === 1) {
      return `${k}(${JSON.stringify(settingsK.id)})`;
    }
  }

  return `${k}(${JSON.stringify(settingsK)})`;
}

export function fvToJS(fv: IFieldValidatorSerialized) {
  const parts = ['ons()'];
  if (fv.settings.type === 'array' && fv.settings.arrayOf) {
    parts.push(`arrayOf(${fvToJS(createInstanceFromFV(fv.settings.arrayOf))})`);
  } else if (fv.settings.type === 'object' && fv.settings.schema) {
    const { schema } = fv.settings;
    const schLines: string[] = [];
    Object.keys(schema).forEach((k) => {
      if (schema[k] && schema[k].settings) {
        schLines.push(
          `${isValidAttrName(k) ? k : JSON.stringify(k)}: ${fvToJS(createInstanceFromFV(schema[k]))}`
        );
      }
    });
    parts.push(`object({${schLines.join(', ')}})`);
  } else {
    parts.push(`${fv.settings.type}()`);
  }
  const fvSettings: any = fv.settings;
  const fvInstance = (fvInstanceByType.hasOwnProperty(fvSettings.type) && typeof fvInstanceByType[fvSettings.type]) ? fvInstanceByType[fvSettings.type] : {};

  Object.keys(fvSettings).forEach((k) => {
    if (k !== 'type' && k !== 'schema' && k !== 'arrayOf' && typeof fvSettings[k] !== 'undefined' && typeof fvInstance[k] === 'function') {
      const str = generateFVSettingsJS(fvSettings[k], k);
      if (parts.indexOf(str) === -1) {
        parts.push(str);
      }
    }
  });
  return parts.join('.');
}
