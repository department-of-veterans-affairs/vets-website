import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  fullNameUI,
  fullNameSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const spouseNameUI = fullNameUI();
spouseNameUI.first['ui:title'] = "Spouse's first name";
spouseNameUI.first['ui:required'] = () => true;
spouseNameUI.last['ui:title'] = "Spouse's last name";
spouseNameUI.last['ui:required'] = () => true;

const marriageDateUI = currentOrPastDateUI();
marriageDateUI['ui:title'] = 'Date of remarriage';
marriageDateUI['ui:required'] = () => true;

const spouseDobUI = dateOfBirthUI();
spouseDobUI['ui:title'] = "Spouse's date of birth";
spouseDobUI['ui:required'] = () => true;

const ageUI = numberUI();
ageUI['ui:title'] = 'How old were you when you remarried?';
ageUI['ui:required'] = () => true;
ageUI['ui:options'] = {
  min: 0,
  max: 120,
};

export default {
  uiSchema: {
    ...titleUI('Details about your remarriage'),
    remarriage: {
      dateOfMarriage: marriageDateUI,
      spouseName: spouseNameUI,
      spouseDateOfBirth: spouseDobUI,
      ageAtMarriage: ageUI,
    },
  },
  schema: {
    type: 'object',
    properties: {
      remarriage: {
        type: 'object',
        required: [
          'dateOfMarriage',
          'spouseName',
          'spouseDateOfBirth',
          'ageAtMarriage',
        ],
        properties: {
          dateOfMarriage: currentOrPastDateSchema,
          spouseName: fullNameSchema,
          spouseDateOfBirth: dateOfBirthSchema,
          ageAtMarriage: numberSchema,
        },
      },
    },
  },
};
