const FV_TYPE_TO_TS_TYPE = {
  float64: 'number',
  int32: 'number',
  string: 'string',
  bool: 'boolean',
};

function generateSubObjectInterfaceName(parentName, type, fieldName) {
  return `${parentName}_${type}_${fieldName}`;
}
function primitiveSchemaFieldToType(fv) {
  if (!FV_TYPE_TO_TS_TYPE.hasOwnProperty(fv.settings.type)) {
    throw new Error(`Invalid primative type ${fv.settings.type}!`);
  }
  return `${FV_TYPE_TO_TS_TYPE[fv.settings.type]}`;
}
function getTypeForField(fv, keyName, interfaceName, interfaceArray, subNameGenerator) {
  const fType = fv.settings.type;
  if (fType === 'object') {
    const internalType = subNameGenerator(interfaceName, 'sub', keyName);
    generateTypescriptInterfaceFull(fv, internalType, interfaceArray, subNameGenerator);
    return internalType;
  } if (fType === 'array') {
    if (!fv.settings.arrayOf) {
      return 'any[]';
    }
    return `${getTypeForField(fv.settings.arrayOf, keyName, interfaceName, interfaceArray, subNameGenerator)}[]`;
  }
  if (Array.isArray(fv.settings.oneOf) && fv.settings.oneOf.length) {
    return `(${fv.settings.oneOf.map((x) => JSON.stringify(x)).join(' | ')})`;
  }
  return primitiveSchemaFieldToType(fv);
}
function generateTypescriptInterfaceFull(fv, interfaceName, interfaceArray, subNameGenerator) {
  const subGen = typeof subNameGenerator === 'function' ? subNameGenerator : generateSubObjectInterfaceName;

  if (!fv || !fv.settings || !fv.settings.schema || fv.settings.type !== 'object') {
    throw new Error('You can only convert one-schema schemas of type object to typescript!');
  }
  const schemaObj = fv.settings.schema;
  const keys = Object.keys(schemaObj);
  const keysLen = keys.length;
  const typeFieldArray = [];
  for (let i = 0; i < keysLen; i++) {
    const field = schemaObj[keys[i]];
    const fieldNamePrefix = JSON.stringify(keys[i]) + (field.settings.required ? '' : '?');
    const fieldTSType = getTypeForField(field, keys[i], interfaceName, interfaceArray, subGen);

    const fullField = `${fieldNamePrefix}: ${fieldTSType};`;
    typeFieldArray.push(fullField);
  }
  const interfaceInner = keysLen === 0 ? '' : (`  ${typeFieldArray.join('\n  ')}`);
  const fullStr = `interface ${interfaceName} {\n${interfaceInner}\n}`;
  interfaceArray.push(fullStr);
}
export function generateTypescriptInterface(fv, interfaceName, subNameGenerator) {
  const interfaceArray = [];
  generateTypescriptInterfaceFull(fv, interfaceName, interfaceArray, subNameGenerator);
  return interfaceArray.join('\n\n');
}
