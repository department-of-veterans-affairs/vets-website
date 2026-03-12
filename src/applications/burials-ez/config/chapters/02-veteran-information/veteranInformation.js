import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameSchema,
  ssnUI,
  ssnSchema,
  titleUI,
  vaFileNumberUI,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AltReviewRowView } from '../../../components/ReviewRowView';
import {
  benefitsIntakeFullNameUI,
  generateHelpText,
} from '../../../utils/helpers';

export default {
  uiSchema: {
    ...titleUI('Personal information'),
    veteranFullName: benefitsIntakeFullNameUI(title => `Veteran’s ${title}`),
    veteranSocialSecurityNumber: ssnUI('Veteran’s Social Security number'),
    vaFileNumber: {
      ...vaFileNumberUI('Veteran’s VA file number'),
      'ui:description': generateHelpText(
        'Enter this number only if it’s different than their Social Security number',
      ),
      'ui:reviewField': AltReviewRowView,
    },
    veteranDateOfBirth: dateOfBirthUI({
      title: 'Veteran’s date of birth',
      dataDogHidden: true,
    }),
  },
  schema: {
    type: 'object',
    required: [
      'veteranFullName',
      'veteranSocialSecurityNumber',
      'veteranDateOfBirth',
    ],
    properties: {
      veteranFullName: fullNameSchema,
      veteranSocialSecurityNumber: ssnSchema,
      vaFileNumber: vaFileNumberSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
