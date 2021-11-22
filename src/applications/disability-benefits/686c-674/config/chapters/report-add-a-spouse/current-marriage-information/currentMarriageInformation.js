import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { isChapterFieldRequired } from '../../../helpers';
import { addSpouse } from '../../../utilities';
import { marriageTypeInformation } from './helpers';

import { locationUISchema } from '../../../location-schema';

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
    location: locationUISchema(
      'currentMarriageInformation',
      'location',
      false,
      'Where were you married?',
      'addSpouse',
    ),
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
