import Handlebars from 'handlebars';
import { format, parseISO } from 'date-fns';

Handlebars.registerHelper('lastFour', ssn => ssn.slice(-4));
Handlebars.registerHelper('formatDate', iso8601 =>
  format(parseISO(iso8601), 'MMMM d, yyyy'),
);
Handlebars.registerHelper('formatBool', (bool, yes, no) => (bool ? yes : no));

export function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, part) => {
    return current && current[part]; // Safely access property, handle undefined
  }, obj);
}

export function renderStr(str, data) {
  return Handlebars.compile(str)(data);
}

export function formatPhoneNumber(phoneNumberString) {
  const cleaned = `${phoneNumberString}`.replace(/\D/g, '');
  if (cleaned.length === 10) {
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return null;
  }
  return phoneNumberString;
}
