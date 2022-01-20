import { has, keys, isPlainObject, mapValues } from 'lodash';

/**
 * Represents an input field value.
 *
 * Input fields need to have a `dirty` state that represents whether or not a user has touched it.
 * Without this state, it is extremely hard (impossible?) to write UI with required fields where
 * the initial empty state does not get marked as a distracting error.
 */
export function makeField(value, optionalDirty) {
  const dirty = optionalDirty === undefined ? false : optionalDirty;
  return { value, dirty };
}

/**
 * Walks through an object hierarchy of fields and marks everything dirty.
 */
export function dirtyAllFields(field) {
  if (keys(field).length === 2 && has(field, 'value') && has(field, 'dirty')) {
    return makeField(field.value, true);
  } else if (isPlainObject(field)) {
    return mapValues(field, (value, _k) => dirtyAllFields(value));
  } else if (Array.isArray(field)) {
    return field.map(dirtyAllFields);
  }

  return field;
}
