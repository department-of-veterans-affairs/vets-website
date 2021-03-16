import { regexpDashAdder } from '../helpers';

export const FETCH_FORMS = 'findVAForms/FETCH_FORMS';
export const FETCH_FORMS_FAILURE = 'findVAForms/FETCH_FORMS_FAILURE';
export const FETCH_FORMS_SUCCESS = 'findVAForms/FETCH_FORMS_SUCCESS';
export const UPDATE_PAGINATION = 'findVAForms/UPDATE_PAGINATION';
export const SORT_OPTIONS = [
  'Ascending (A-Z)',
  'Descending (Z-A)',
  'Last Updated (Newest)',
  'Last Updated (Oldest)',
];
export const INITIAL_SORT_STATE = 'Ascending (A-Z)';
export const FORM_MOMENT_CONSTRUCTOR_DATE_FORMAT = 'YYYY-MM-DD';
export const FORM_MOMENT_PRESENTATION_DATE_FORMAT = 'MM-DD-YYYY';
export const UPDATE_HOW_TO_SORT = 'findVAForms/UPDATE_HOW_TO_SORT';
export const UPDATE_RESULTS = 'findVAForms/UPDATE_RESULTS';

export const SEARCH_QUERY_AUTO_CORRECT_MAP = new Map([
  ['VA\\s', ''],
  ['FORM', ''],
  ['ESPANOL', 'spanish'],
  ['^20\\d', match => regexpDashAdder(match, 2)],
  ['^21\\d', match => regexpDashAdder(match, 2)],
  ['^22\\d', match => regexpDashAdder(match, 2)],
  ['^26\\d', match => regexpDashAdder(match, 2)],
  ['^29\\d', match => regexpDashAdder(match, 2)],
  ['^40\\d', match => regexpDashAdder(match, 2)],
  ['21P', '21P-'],
  ['1010', '10-10'],
  ['1010EZ', '10-10EZ'],
  ['1010 EZ', '10-10EZ'],
  ['10-10 EZ', '10-10EZ'],
]);
