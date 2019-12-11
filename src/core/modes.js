import FieldValidator from './FieldValidator';
import { isValidAttrName } from '../utils/validAttribute';

const fvInstance = new FieldValidator();
const emptyValArgs = {
  allowNaN: new FieldValidator().float64().allowNaN().settings.allowNaN,
  required: new FieldValidator().float64().required().settings.required,
  allowNull: new FieldValidator().string().allowNull().settings.allowNull,
  primaryKey: new FieldValidator().int32().primaryKey().settings.primaryKey,
  autoIncrement: new FieldValidator().int32().autoIncrement().settings.autoIncrement,
  uuid: new FieldValidator().string().uuid().settings.uuid,
};

function createInstanceFromFVMain(fieldValidator) {
  const root = new FieldValidator();
  Object.assign(root.settings, fieldValidator.settings);
  const { arrayOf, schema } = root.settings;
  if (arrayOf) {
    root.settings.arrayOf = createInstanceFromFVMain(arrayOf);
  }
  if (schema) {
    const nSchema = {};
    Object.keys(schema).forEach((k) => {
      if (schema[k] && schema[k].settings) {
        nSchema[k] = createInstanceFromFVMain(schema[k]);
      }
    });
  }
  return root;
}

export function createInstanceFromFV(fieldValidator) {
  return createInstanceFromFVMain(JSON.parse(JSON.stringify(fieldValidator)));
}
function generateFVSettingsJS(settingsK, k) {
  if (emptyValArgs[k] === settingsK) {
    return `${k}()`;
  } if (k === 'validator' && settingsK && typeof settingsK === 'object') {
    if (typeof settingsK.id === 'string' && Object.keys(settingsK).length === 1) {
      return `${k}(${JSON.stringify(settingsK.id)})`;
    }
  }

  return `${k}(${JSON.stringify(settingsK)})`;
}

export function fvToJS(fv) {
  const parts = ['ons()'];
  if (fv.settings.arrayOf) {
    parts.push(`arrayOf(${fvToJS(createInstanceFromFV(fv.settings.arrayOf))})`);
  } else if (fv.settings.schema) {
    const { schema } = fv.settings;
    const schLines = [];
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
  Object.keys(fv.settings).forEach((k) => {
    if (k !== 'type' && k !== 'schema' && k !== 'arrayOf' && typeof fv.settings[k] !== 'undefined' && typeof fvInstance[k] === 'function') {
      const str = generateFVSettingsJS(fv.settings[k], k);
      if (parts.indexOf(str) === -1) {
        parts.push(str);
      }
    }
  });
  return parts.join('.');
}
