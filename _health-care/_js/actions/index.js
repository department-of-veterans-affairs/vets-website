export const ENSURE_FIELDS_INITIALIZED = 'ENSURE_FIELDS_INITIALIZED';
export const VETERAN_FIELD_UPDATE = 'VETERAN_FIELD_UPDATE';

export function ensureFieldsInitialized(path) {
  return {
    type: ENSURE_FIELDS_INITIALIZED,
    path
  };
}

export function veteranUpdateField(propertyPath, value) {
  return {
    type: VETERAN_FIELD_UPDATE,
    propertyPath,
    value
  };
}
