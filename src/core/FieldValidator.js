import { hasValidatorId } from './validatorManager';
// Define undefined to prevent unexpected behaviors
// e.g. var undefined = 'something';
const UNDEFINED = typeof undefined === 'undefined' ? undefined : (() => {})();
const VALID_TYPES = ['bool', 'string', 'int32', 'float64', 'object', 'array'];

class FieldValidator {
  constructor() {
    this.settings = {};
  }

  bool() {
    this.settings.type = 'bool';
    return this;
  }

  string() {
    this.settings.type = 'string';
    return this;
  }

  int32() {
    this.settings.type = 'int32';
    return this;
  }

  float64() {
    this.settings.type = 'float64';
    return this;
  }

  object(schema) {
    this.settings.type = 'object';
    if (schema) {
      this.settings.schema = schema;
    }
    return this;
  }

  obj(schema) {
    return this.object(schema);
  }

  array() {
    this.settings.type = 'array';
    return this;
  }

  type(inputType) {
    if (
      typeof inputType !== 'string' ||
      VALID_TYPES.indexOf(inputType) === -1 ||
      typeof this[inputType] !== 'function' ||
      inputType === 'type'
    ) {
      throw new Error(`Invalid type ${inputType}`);
    }
    return this[inputType]();
  }

  schema(inputSchema) {
    if (this.settings.type !== 'object') {
      throw new Error("'schema' option can only be used on object type");
    }

    this.settings.schema = inputSchema;
    return this;
  }

  max(inputMax) {
    if (this.settings.type === UNDEFINED) {
      throw new Error('Must set type before setting options');
    }

    this.settings.max = inputMax;
    return this;
  }

  min(inputMin) {
    if (this.settings.type === UNDEFINED) {
      throw new Error('Must set type before setting options');
    }

    this.settings.min = inputMin;
    return this;
  }

  required(required = true) {
    if (this.settings.type === UNDEFINED) {
      throw new Error('Must set type before setting options');
    }

    this.settings.required = !!required;
    return this;
  }

  allowNull(allowNull = true) {
    if (this.settings.type === UNDEFINED) {
      throw new Error('Must set type before setting options');
    }

    this.settings.allowNull = !!allowNull;
    return this;
  }

  primaryKey(primaryKey = true) {
    if (this.settings.type === UNDEFINED) {
      throw new Error('Must set type before setting options');
    }

    this.settings.primaryKey = !!primaryKey;
    return this;
  }

  autoIncrement(autoIncrement = true) {
    if (this.settings.type !== 'int32') {
      throw new Error('Must set type int32 before setting auto increment');
    }

    this.settings.autoIncrement = !!autoIncrement;
    return this;
  }

  defaultValue(inputValue) {
    if (this.settings.type === UNDEFINED) {
      throw new Error('Must set type before setting options');
    }

    this.settings.defaultValue = inputValue;
    return this;
  }

  oneOf(inputValues) {
    if (this.settings.type === UNDEFINED) {
      throw new Error('Must set type before setting options');
    }

    // TODO: More rigorous check if the elements in oneOf are valid, for now use type info
    if (Array.isArray(inputValues)) {
      inputValues.forEach((v) => {
        if (
          (this.settings.type === 'string' && typeof v !== 'string' && v !== null) ||
          (this.settings.type === 'float64' && typeof v !== 'number') ||
          (this.settings.type === 'int32' && typeof v !== 'number' && Math.round(v) === v) ||
          (this.settings.type === 'bool' && typeof v !== 'boolean')
        ) {
          throw new Error(`Invalid oneOf value '${v}'`);
        } else if (
          this.settings.type === 'array' ||
          this.settings.type === 'object'
        ) {
          throw new Error('Non primitive fields cannot use oneOf!');
        }
      });
      this.settings.oneOf = inputValues.concat([]);
    } else {
      this.settings.oneOf = UNDEFINED;
    }
    return this;
  }

  arrayOf(inputSchema) {
    if (!this.settings.type) {
      this.settings.type = 'array';
    }
    if (this.settings.type !== 'array') {
      throw new Error("'arrayOf' option can only be used on an array type");
    }

    this.settings.arrayOf = inputSchema;
    return this;
  }

  allowNaN(allowNaN = true) {
    if (this.settings.type === UNDEFINED) {
      throw new Error('Must set type before setting options');
    }

    this.settings.allowNaN = allowNaN;
    return this;
  }

  tags(tags) {
    if (!Array.isArray(tags) || !tags.length || tags.filter((t) => (typeof t !== 'string' || !t.length)).length) {
      throw new Error('Field Validator tags must be an array of non-empty strings!');
    }
    this.settings.tags = tags;
    return this;
  }

  validator(validator) {
    if (this.settings.type === UNDEFINED) {
      throw new Error('Must set type before setting options');
    }
    const tmpValidator = typeof validator === 'string' ? ({ id: validator }) : validator;

    if (typeof tmpValidator !== 'object' || !tmpValidator || !tmpValidator.id) {
      throw new Error('Invalid validator!');
    }
    if (!hasValidatorId(tmpValidator.id)) {
      throw new Error('Validator not registered!');
    }

    this.settings.validator = tmpValidator;
    return this;
  }

  uuid(isUuid = true) {
    this.settings.uuid = isUuid;
    return this;
  }
}
export default FieldValidator;
