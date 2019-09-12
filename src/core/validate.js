const { isNaN } = Number;
const validatorFunctions = {
  email: (input) => {
    const len = input.length;
    const atInd = input.indexOf('@');
    const dotInd = input.lastIndexOf('.');
    return {
      validated: atInd >= 1 && atInd < dotInd && dotInd < len - 2,
      error: 'invalid email',
    };
  },
  mobile_number: (input) => {
    let validated = true;
    if (
      typeof input !== 'string' ||
      input.length > 48 ||
      input < 8 ||
      input.charAt(0) !== '+' ||
      /[^0-9]/.test(input.substring(1))
    ) {
      validated = false;
    }
    if (input.substring(1, 3) === '86') {
      validated = input.charAt(3) === '1' && input.length === 14;
    } else if (input.substring(1, 4) === '852') {
      validated = input.length === 12;
    } else if (input.charAt(1) === '1') {
      validated = input.length === 12;
    }
    return {
      validated,
      error: validated ? null : 'invalid phone number',
    };
  },
};

function sanitizeKeys(input, schema) {
  let validated = true;
  let error = null;
  Object.keys(input).forEach((paramName) => {
    if (!schema[paramName]) {
      validated = false;
      error = `illegal parameter ${paramName}`;
    }
  });

  return { validated, error };
}

function iterateSchema(input, schema, options) {
  let validated = true;
  let error = null;
  Object.keys(schema).forEach((paramName) => {
    const inputParam = input[paramName];
    const paramSchema = schema[paramName];
    const required = paramSchema.settings.required || false;
    // Check parameter exists
    if (typeof inputParam !== 'undefined') {
      const result = validate(inputParam, schema[paramName], options);
      if (!result.validated) {
        validated = result.validated;
        error = `${paramName}: ${result.error}`;
      }
    } else if (required && !inputParam) {
      validated = false;
      if (!validated) {
        error = `${paramName} is required`;
      }
    }
  });

  return { validated, error };
}
/*
function registerValidator(id, validator) {
  validatorFunctions[id] = validator;
}
*/


const validateByType = {
  bool: (input) => {
    const validated = typeof input === 'boolean';
    let error = null;
    if (!validated) {
      error = `Expected bool but received ${typeof input}`;
    }

    return {
      validated,
      error,
    };
  },
  int32: (input, schema) => {
    let validated = typeof input === 'number';
    const error = null;
    if (!validated) {
      return {
        validated,
        error: `Expected int but received ${typeof input}`,
      };
    }

    if (input !== ~~input) {
      return {
        validated: false,
        error: 'Number must be 32-bit integer',
      };
    }

    if (
      typeof schema.settings.min === 'number' &&
      input < schema.settings.min
    ) {
      return {
        validated: false,
        error: `should be at least ${schema.settings.min}`,
      };
    }

    if (
      typeof schema.settings.max === 'number' &&
      input > schema.settings.max
    ) {
      return {
        validated: false,
        error: `should not exceed ${schema.settings.max}`,
      };
    }

    if (Array.isArray(schema.settings.oneOf)) {
      validated = false;
      schema.settings.oneOf.forEach((validElement) => {
        if (input === validElement) {
          validated = true;
        }
      });
      if (!validated) {
        return {
          validated,
          error: 'should be one of oneOf',
        };
      }
    }

    if (schema.settings.validator) {
      if (validatorFunctions[schema.settings.validator.id]) {
        return validatorFunctions[schema.settings.validator.id](input);
      }
      return {
        validated: false,
        error: 'invalid validator function id',
      };
    }

    return {
      validated,
      error,
    };
  },
  float64: (input, schema) => {
    const validated = typeof input === 'number' && !Number.isInteger(input);
    const error = null;
    if (!validated) {
      return {
        validated,
        error: `Expected float64 but received ${typeof input}`,
      };
    }

    if (!schema.settings.allowNaN && isNaN(input)) {
      return {
        validated: false,
        error: 'NaN not allowed',
      };
    }

    if (
      typeof schema.settings.min === 'number' &&
      input < schema.settings.min
    ) {
      return {
        validated: false,
        error: `should be at least ${schema.settings.min}`,
      };
    }

    if (
      typeof schema.settings.max === 'number' &&
      input > schema.settings.max
    ) {
      return {
        validated: false,
        error: `should not exceed ${schema.settings.max}`,
      };
    }

    if (schema.settings.validator) {
      if (validatorFunctions[schema.settings.validator.id]) {
        return validatorFunctions[schema.settings.validator.id](input);
      }
      return {
        validated: false,
        error: 'invalid validator function id',
      };
    }

    return {
      validated,
      error,
    };
  },
  string: (input, schema) => {
    const validated = typeof input === 'string';
    let error = null;
    if (!validated) {
      error = `Expected string but received ${typeof input}`;
      return { validated, error };
    }

    if (
      typeof schema.settings.min === 'number' &&
      input.length < schema.settings.min
    ) {
      return {
        validated: false,
        error: `should at least have length of ${schema.settings.min}`,
      };
    }

    if (
      typeof schema.settings.max === 'number' &&
      input.length > schema.settings.max
    ) {
      return {
        validated: false,
        error: `should have length not exceeding ${schema.settings.max}`,
      };
    }

    if (schema.settings.validator) {
      if (validatorFunctions[schema.settings.validator.id]) {
        return validatorFunctions[schema.settings.validator.id](input);
      }
      return {
        validated: false,
        error: 'invalid validator function id',
      };
    }

    return {
      validated,
      error,
    };
  },
  array: (input, schema) => {
    let validated = Array.isArray(input);
    let error = '';
    if (!validated) {
      error = `Expected array but received ${typeof input}`;
      return { validated, error };
    }

    if (schema.settings.arrayOf) {
      input.forEach((element) => {
        const result = validate(element, schema.settings.arrayOf);
        if (!result.validated) {
          validated = result.validated;
          error = result.error;
        }
      });
    }

    if (schema.settings.validator) {
      if (validatorFunctions[schema.settings.validator.id]) {
        return validatorFunctions[schema.settings.validator.id](input);
      }
      return {
        validated: false,
        error: 'invalid validator function id',
      };
    }

    return {
      validated,
      error,
    };
  },
  object: (input, schema, options) => {
    const validated = typeof input === 'object';
    let error = '';
    if (!validated) {
      error = `Expected object but received ${typeof input}`;
      return { validated, error };
    }

    const result = sanitizeKeys(input, schema.settings.schema);
    if (!result.validated) {
      return { validated: result.validated, error: result.error };
    }

    return iterateSchema(input, schema.settings.schema, options);
  },
};


function validate(input, schema, options) {
  if (typeof input === 'undefined') {
    return options.patch ? true : !schema.settings.required;
  }

  const typeValidator = validateByType[schema.settings.type];
  if (
    typeof typeValidator !== 'function' ||
    !validateByType.hasOwnProperty(schema.settings.type)
  ) {
    console.error('Unsupported type:', schema.settings.type);
    return false;
  }

  return typeValidator(input, schema, options);
}

export default validate;
