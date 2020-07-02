import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  isChapterFieldRequired,
  marriageStateTitle,
  marriageCityTitle,
} from '../../../helpers';
import { addSpouse } from '../../../utilities';
import { marriageTypeInformation } from './helpers';

const { currentMarriageInformation } = addSpouse.properties;

export const schema = {
  type: 'object',
  properties: {
    currentMarriageInformation,
  },
};

export const uiSchema = {
  currentMarriageInformation: {
    date: {
      ...currentOrPastDateUI('Date of marriage'),
      ...{
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'addSpouse'),
      },
    },
    location: {
      'ui:title': 'Where were you married?',
      state: {
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'addSpouse'),
        'ui:title': marriageStateTitle,
      },
      city: {
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'addSpouse'),
        'ui:title': marriageCityTitle,
      },
    },
    type: {
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
      'ui:title': 'Type of marriage:',
      'ui:widget': 'radio',
    },
    typeOther: {
      'ui:required': formData =>
        formData?.currentMarriageInformation?.type === 'OTHER',
      'ui:title': 'Other type of marriage',
      'ui:options': {
        expandUnder: 'type',
        expandUnderCondition: 'OTHER',
        showFieldLabel: true,
        keepInPageOnReview: true,
        widgetClassNames: 'vads-u-margin-y--0',
      },
    },
    'view:marriageTypeInformation': {
      'ui:title': 'Additional evidence needed',
      'ui:description': marriageTypeInformation,
    },
  },
};
