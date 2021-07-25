import { IFieldValidatorSerialized, IFieldValidatorSerializedReal } from "../../types/core";

const FV_TYPE_TO_TS_TYPE: {[key: string]: string} = {
  float64: 'number',
  int32: 'number',
  string: 'string',
  bool: 'boolean',
};
type TSubNameGenerator = (parentName: string, type: string, fieldName: string)=>string;

function generateSubObjectInterfaceName(parentName: string, type: string, fieldName: string): string {
  return `${parentName}_${type}_${fieldName}`;
}
function primitiveSchemaFieldToType(fv: IFieldValidatorSerializedReal): string {
  if (!FV_TYPE_TO_TS_TYPE.hasOwnProperty(fv.settings.type)) {
    throw new Error(`Invalid primative type ${fv.settings.type}!`);
  }
  return `${FV_TYPE_TO_TS_TYPE[fv.settings.type]}`;
}
function getTypeForField(fv: IFieldValidatorSerializedReal, keyName: string, interfaceName: string, interfaceArray: string[], subNameGenerator: TSubNameGenerator): string {
  const fType = fv.settings.type;
  if (fv.settings.type === 'object') {
    const internalType = subNameGenerator(interfaceName, 'sub', keyName);
    generateTypescriptInterfaceFull(fv, internalType, interfaceArray, subNameGenerator);
    return internalType;
  } if (fv.settings.type === 'array') {
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
function generateTypescriptInterfaceFull(fv: IFieldValidatorSerialized, interfaceName: string, interfaceArray: string[], subNameGenerator?: TSubNameGenerator) {
  
  const subGen = typeof subNameGenerator === 'function' ? subNameGenerator : generateSubObjectInterfaceName;
  if(!fv || !fv.settings || fv.settings.type !== 'object' || !fv.settings.schema){
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
export function generateTypescriptInterface(fv: IFieldValidatorSerialized, interfaceName: string, subNameGenerator?: TSubNameGenerator) {
  const interfaceArray : string[] = [];
  generateTypescriptInterfaceFull(fv, interfaceName, interfaceArray, subNameGenerator);
  return interfaceArray.join('\n\n');
}
