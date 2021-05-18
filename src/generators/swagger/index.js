function primitiveField(field) {
  const swaggerField = {};
  if (typeof field.settings.example !== 'undefined') {
    swaggerField.example = field.settings.example;
  }
  if (typeof field.settings.description === 'string') {
    swaggerField.description = field.settings.description;
  }
  if (typeof field.settings.defaultValue !== 'undefined') {
    swaggerField.default = field.settings.defaultValue;
  }
  if (Array.isArray(field.settings.oneOf)) {
    swaggerField.enum = field.settings.oneOf.concat([]);
  }
  return swaggerField;
}
function int32ToSwagger(field) {
  const swaggerField = Object.assign(primitiveField(field), {
    type: 'integer',
    format: 'int32',
  });
  if (typeof field.settings.min !== 'undefined') {
    swaggerField.minimum = field.settings.min;
  }
  if (typeof field.settings.max !== 'undefined') {
    swaggerField.maximum = field.settings.max;
  }
  return swaggerField;
}

function float64ToSwagger(field) {
  const swaggerField = Object.assign(primitiveField(field), {
    type: 'number',
    format: 'double',
  });
  if (typeof field.settings.min !== 'undefined') {
    swaggerField.minimum = field.settings.min;
  }
  if (typeof field.settings.max !== 'undefined') {
    swaggerField.maximum = field.settings.max;
  }
  return swaggerField;
}
function boolToSwagger(field) {
  const swaggerField = Object.assign(primitiveField(field), {
    type: 'boolean',
  });
  return swaggerField;
}
function stringToSwagger(field) {
  const swaggerField = Object.assign(primitiveField(field), {
    type: 'string',
  });
  if (typeof field.settings.min !== 'undefined') {
    swaggerField.minLength = field.settings.min;
  }
  if (typeof field.settings.max !== 'undefined') {
    swaggerField.maxLength = field.settings.max;
  }
  if (
    field.settings.validator &&
    typeof field.settings.validator === 'object'
  ) {
    if (field.settings.validator.id === 'datetime') {
      swaggerField.format = 'date-time';
    }
  }
  return swaggerField;
}
function arrayToSwagger(field) {
  const swaggerField = { type: 'array' };
  if (typeof field.settings.description === 'string') {
    swaggerField.description = field.settings.description;
  }
  if (typeof field.settings.min !== 'undefined') {
    swaggerField.minItems = field.settings.min;
  }
  if (typeof field.settings.max !== 'undefined') {
    swaggerField.maxItems = field.settings.max;
  }
  swaggerField.items = onsFieldToSwagger(field.settings.arrayOf);
  return swaggerField;
}
function objectToSwagger(field) {
  const swaggerField = { type: 'object', properties: {} };

  if (typeof field.settings.description === 'string') {
    swaggerField.description = field.settings.description;
  }

  const fvSchema = field.settings.schema;
  const required = [];
  Object.keys(fvSchema).forEach((k) => {
    if (fvSchema[k].settings.required) {
      required.push(k);
    }
    swaggerField.properties[k] = onsFieldToSwagger(fvSchema[k]);
  });
  if (required.length) {
    swaggerField.required = required;
  }
  return swaggerField;
}

const FIELD_TO_SWAGGER_CONVERT = {
  int32: int32ToSwagger,
  string: stringToSwagger,
  bool: boolToSwagger,
  float64: float64ToSwagger,
  object: objectToSwagger,
  array: arrayToSwagger,
};

function onsFieldToSwagger(field) {
  const typeConvertor = FIELD_TO_SWAGGER_CONVERT[field.settings.type];
  if (
    !FIELD_TO_SWAGGER_CONVERT.hasOwnProperty(field.settings.type) ||
    typeof typeConvertor !== 'function'
  ) {
    throw new Error(`Unsupported type '${field.settings.type}' for swagger!`);
  }
  return typeConvertor(field);
}

export { onsFieldToSwagger };
