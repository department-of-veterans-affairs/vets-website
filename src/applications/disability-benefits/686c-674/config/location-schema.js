import { isChapterFieldRequired } from './helpers';

export const locationUISchema = (
  chapter,
  outerField,
  isInsideListLoop,
  uiTitle,
  formChapter,
) => {
  // IF we are inside a list loop, return hideIf and required uiSchema that use `index`
  if (isInsideListLoop) {
    return {
      'ui:title': uiTitle,
      isOutsideUS: {
        'ui:title': 'This occurred outsite the US',
      },
      country: {
        'ui:title': 'Country',
        'ui:required': (formData, index) =>
          formData[chapter][`${index}`][outerField]?.isOutsideUS,
        'ui:options': {
          hideIf: (formData, index) => {
            if (!formData[chapter][`${index}`][outerField]?.isOutsideUS) {
              return true;
            }
            return false;
          },
        },
      },
      state: {
        'ui:title': 'State',
        'ui:required': (formData, index) =>
          !formData[chapter][`${index}`][outerField]?.isOutsideUS,
        'ui:options': {
          hideIf: (formData, index) => {
            if (formData[chapter][`${index}`][outerField]?.isOutsideUS) {
              return true;
            }
            return false;
          },
        },
      },
      city: {
        'ui:required': formData =>
          isChapterFieldRequired(formData, formChapter),
        'ui:title': 'City',
      },
    };
  }

  // IF we are NOT inside a list loop, return hideIf and required uiSchema that do NOT use `index`
  return {
    'ui:title': 'Where were you married?',
    isOutsideUS: {
      'ui:title': 'This occurred outsite the US',
    },
    country: {
      'ui:title': 'Country',
      'ui:required': formData => formData[chapter][outerField]?.isOutsideUS,
      'ui:options': {
        hideIf: formData => {
          if (!formData[chapter][outerField].isOutsideUS) {
            return true;
          }
          return false;
        },
      },
    },
    state: {
      'ui:title': 'State',
      'ui:required': formData => !formData[chapter][outerField]?.isOutsideUS,
      'ui:options': {
        hideIf: formData => {
          if (formData[chapter][outerField].isOutsideUS) {
            return true;
          }
          return false;
        },
      },
    },
    city: {
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
      'ui:title': 'City',
    },
  };
};
