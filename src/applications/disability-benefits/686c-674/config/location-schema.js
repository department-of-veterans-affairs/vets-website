import { isChapterFieldRequired } from './helpers';

export const locationUISchema = (chapter, outerField, isInsideListLoop) => {
  let hideConditionCountry = {};
  let hideConditionState = {};

  if (isInsideListLoop) {
    hideConditionCountry = {
      hideIf: (formData, index) => {
        if (!formData[chapter][`${index}`][outerField].isOutsideUS) {
          return true;
        }
      },
    };

    hideConditionState = {
      hideIf: (formData, index) => {
        if (formData[chapter][`${index}`][outerField].isOutsideUS) {
          return true;
        }
      },
    };
  } else {
    hideConditionCountry = {
      hideIf: formData => {
        if (!formData[chapter][outerField].isOutsideUS) {
          return true;
        }
      },
    };

    hideConditionState = {
      hideIf: formData => {
        if (formData[chapter][outerField].isOutsideUS) {
          return true;
        }
      },
    };
  }

  return {
    'ui:title': 'Where were you married?',
    isOutsideUS: {
      'ui:title': 'This occurred outsite the US',
    },
    country: {
      'ui:title': 'Country',
      'ui:required': formData =>
        formData[chapter][outerField].isOutsideUS === true,
      'ui:options': hideConditionCountry,
    },
    state: {
      'ui:title': 'State',
      'ui:required': formData =>
        formData[chapter][outerField].isOutsideUS === false,
      'ui:options': hideConditionState,
    },
    city: {
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
      'ui:title': 'City',
    },
  };
};
