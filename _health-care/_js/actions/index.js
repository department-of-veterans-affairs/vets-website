export const ENSURE_FIELDS_INITIALIZED = 'ENSURE_FIELDS_INITIALIZED';
export const VETERAN_FIELD_UPDATE = 'VETERAN_FIELD_UPDATE';
export const SECTION_COMPLETE_UPDATE_FIELD = 'SECTION_COMPLETE_UPDATE_FIELD';

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

export function sectionCompleteUpdateField(path) {
  return {
    type: SECTION_COMPLETE_UPDATE_FIELD,
    path
  };
}
