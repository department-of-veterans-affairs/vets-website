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
