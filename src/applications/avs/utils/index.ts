// Re-export datetime utilities for backward compatibility
export {
  parseProblemDateTime,
  parseVistaDateTime,
  parseVistaDate,
  formatImmunizationDate,
  getShortTimezone,
  getFormattedAppointmentTime,
  getFormattedAppointmentDate,
  getFormattedGenerationDate,
  stripDst,
} from './datetime';

// General utility functions
export const fieldHasValue = (value: unknown): boolean => {
  return value !== null && value !== '' && value !== undefined;
};

export const allArraysEmpty = (item: Record<string, unknown[]>): boolean => {
  for (const [, value] of Object.entries(item)) {
    for (const arrayItem of value) {
      if (fieldHasValue(arrayItem)) return false;
    }
  }

  return true;
};

export const allFieldsEmpty = (item: Record<string, unknown>): boolean => {
  for (const [, value] of Object.entries(item)) {
    if (fieldHasValue(value)) return false;
  }

  return true;
};
