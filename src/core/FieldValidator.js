// Define undefined to prevent unexpected behaviors
// e.g. var undefined = 'something';
const UNDEFINED = typeof undefined === "undefined" ? undefined : (() => {})();

function deepClone(object) {
  return JSON.parse(JSON.stringify(object));
}

class FieldValidator {
  constructor(settings, schema) {
    if(typeof settings === 'object' && settings) {
      this.settings = deepClone(settings);
    }else{
      this.settings = {};
    }
    /*if(typeof schema === 'object' && schema) {
      this.schema = deepClone(schema);
    }else{
      this.schema = UNDEFINED;
    }*/
  }

  bool() {
    this.settings.type = "bool";
    return this;
  }

  string() {
    this.settings.type = "string";
    return this;
  }

  int32() {
    this.settings.type = "int32";
    return this;
  }

  float64() {
    this.settings.type = "float64";
    return this;
  }

  object() {
    this.settings.type = "object";
    return this;
  }

  array() {
    this.settings.type = "array";
    return this;
  }

  type(inputType) {
    // TODO: Add input type name check also
    if (typeof inputType !== "string") {
      throw new Error("Invalid type " + inputType);
    }

    this.settings.type = inputType;
    return this;
  }

  schema(inputSchema) {
    if (this.settings.type !== "object") {
      throw new Error("'schema' option can only be used on object type");
    }

    this.settings.schema = inputSchema;
    return this;
  }

  max(inputMax) {
    if (this.settings.type === UNDEFINED) {
      throw new Error("Must set type before setting options");
    }

    this.settings.max = inputMax;
    return this;
  }

  min(inputMin) {
    if (this.settings.type === UNDEFINED) {
      throw new Error("Must set type before setting options");
    }

    this.settings.min = inputMin;
    return this;
  }

  required(inputRequired) {
    if (this.settings.type === UNDEFINED) {
      throw new Error("Must set type before setting options");
    }

    this.settings.required =
      typeof inputRequired === "boolean" ? !!inputRequired : true;
    return this;
  }

  allowNull(inputAllowNull) {
    if (this.settings.type === UNDEFINED) {
      throw new Error("Must set type before setting options");
    }

    this.settings.allowNull =
      typeof inputAllowNull === "boolean" ? !!inputAllowNull : true;
    return this;
  }

  primaryKey(inputPrimaryKey) {
    if (this.settings.type === UNDEFINED) {
      throw new Error("Must set type before setting options");
    }

    this.settings.primaryKey =
      typeof inputPrimaryKey === "boolean" ? !!inputPrimaryKey : true;
    return this;
  }

  autoIncrement(inputAutoIncrement) {
    if (this.settings.type === UNDEFINED) {
      throw new Error("Must set type before setting options");
    }

    this.settings.autoIncrement =
      typeof inputAutoIncrement === "boolean" ? !!inputAutoIncrement : true;
    return this;
  }

  defaultValue(inputValue) {
    if (this.settings.type === UNDEFINED) {
      throw new Error("Must set type before setting options");
    }

    this.settings.defaultValue = inputValue;
    return this;
  }

  oneOf(inputValues) {
    if (this.settings.type === UNDEFINED) {
      throw new Error("Must set type before setting options");
    }

    this.settings.oneOf = Array.isArray(inputValues) ? inputValues : UNDEFINED;
    return this;
  }

  arrayOf(inputSchema) {
    if (this.settings.type !== "array") {
      throw new Error("'arrayOf' option can only be used on an array type");
    }

    this.settings.arrayOf =
      typeof inputSchema === "object" && inputSchema
        ? new FieldValidator({
            type: "object",
            schema: inputSchema
          })
        : UNDEFINED;
    return this;
  }

  allowNaN(allowNaN) {
    if (this.settings.type === UNDEFINED) {
      throw new Error("Must set type before setting options");
    }

    this.settings.allowNaN =
      typeof allowNaN === "undefined" ? true : !!allowNaN;
    return this;
  }

  validator(validator) {
    if (this.settings.type === UNDEFINED) {
      throw new Error("Must set type before setting options");
    }

    this.settings.validator =
      typeof validator === "object" ? validator : UNDEFINED;
    return this;
  }

  clone() {
    return new FieldValidator(JSON.parse(JSON.stringify(this.settings)));
  }

  getSettings() {
    return Object.assign({}, this.settings || {});
  }
}
export default FieldValidator;