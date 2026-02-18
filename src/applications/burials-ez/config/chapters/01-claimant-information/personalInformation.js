import fullSchemaBurials from 'vets-json-schema/dist/21P-530EZ-schema.json';
import {
  dateOfBirthUI,
  fullNameUI,
  ssnUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PrefillMessage from '../../../components/PrefillMessage';

const {
  claimantFullName,
  claimantSocialSecurityNumber,
  claimantDateOfBirth,
} = fullSchemaBurials.properties;

export default {
  uiSchema: {
    ...titleUI('Personal information'),
    'ui:description': PrefillMessage,
    claimantFullName: fullNameUI(),
    claimantSocialSecurityNumber: {
      ...ssnUI('Social Security number'),
      'ui:required': form =>
        form?.relationshipToVeteran !== 'executor' &&
        form?.relationshipToVeteran !== 'funeralDirector' &&
        form?.relationshipToVeteran !== 'otherFamily',
    },
    claimantDateOfBirth: {
      ...dateOfBirthUI({ title: 'Date of birth', dataDogHidden: true }),
      'ui:required': form =>
        form?.relationshipToVeteran !== 'executor' &&
        form?.relationshipToVeteran !== 'funeralDirector' &&
        form?.relationshipToVeteran !== 'otherFamily',
    },
  },
  schema: {
    type: 'object',
    required: ['claimantFullName'],
    properties: {
      claimantFullName,
      claimantSocialSecurityNumber,
      claimantDateOfBirth,
    },
  },
};
