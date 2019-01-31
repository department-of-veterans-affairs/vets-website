export function setArrayRecordTouched(prefix, index) {
  return { [`${prefix}_${index}`]: true };
}
