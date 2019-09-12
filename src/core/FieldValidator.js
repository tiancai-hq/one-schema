import { hasValidatorId } from './validatorManager';
// Define undefined to prevent unexpected behaviors
// e.g. var undefined = 'something';
const UNDEFINED = typeof undefined === 'undefined' ? undefined : (() => {})();

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
    // TODO: Add input type name check also
    if (typeof inputType !== 'string') {
      throw new Error(`Invalid type ${inputType}`);
    }

    this.settings.type = inputType;
    return this;
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

    this.settings.oneOf = Array.isArray(inputValues) ? inputValues : UNDEFINED;
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
}
export default FieldValidator;
