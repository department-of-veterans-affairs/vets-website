import {
  isValidSSN,
  isValidName,
  isValidDate,
} from 'platform/forms/validations';

// Returns an error message string, or null if valid.
// All validators treat null/'' as valid (field not required at this layer).

export const validateSsn = v => {
  if (v == null || v === '') return null;
  return isValidSSN(v) ? null : 'Enter a valid Social Security number';
};

// v must be ISO YYYY-MM-DD
export const validateIsoDate = (v, label = 'date') => {
  if (v == null || v === '') return null;
  const [year, month, day] = (v || '').split('-');
  return isValidDate(day, month, year) ? null : `Enter a valid ${label}`;
};

export const validateNamePart = (v, label = 'name') => {
  if (v == null || v === '') return null;
  return isValidName(v) ? null : `Enter a valid ${label}`;
};

export const validateText = (
  v,
  { label = 'field', min = 0, max = Infinity } = {},
) => {
  if (v == null || v === '') return null;
  const len = v.trim().length;
  if (min > 0 && len < min)
    return `${label} must be at least ${min} characters`;
  if (len > max) return `${label} must be ${max} characters or fewer`;
  return null;
};

// Safety-net enum check — primary UX uses constrained selects/combo-boxes
export const validateEnum = (v, allowed, label = 'value') => {
  if (v == null || v === '') return null;
  const set = Array.isArray(allowed) ? allowed : [...allowed];
  return set.includes(v) ? null : `Select a valid ${label}`;
};
