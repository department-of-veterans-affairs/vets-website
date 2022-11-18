import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullSchema from '../../10-10D-schema.json';
import { sponsorFields } from '../../definitions/constants';

const { properties } = fullSchema.properties.veteran;

export default {
  uiSchema: {
    [sponsorFields.parentObject]: {
      [sponsorFields.dob]: currentOrPastDateUI('Date of birth'),
      [sponsorFields.dom]: currentOrPastDateUI('Date of marriage'),
      [sponsorFields.isDeceased]: {
        'ui:title': 'Is the Veteran deceased?',
      },
      [sponsorFields.dod]: {
        ...currentOrPastDateUI('Date of death'),
        'ui:options': {
          hideIf: formData =>
            !formData[sponsorFields.parentObject][sponsorFields.isDeceased],
        },
        'ui:required': formData =>
          formData[sponsorFields.parentObject][sponsorFields.isDeceased],
      },
      [sponsorFields.isActiveServiceDeath]: {
        'ui:title': "Was the Veteran's death during active service?",
        'ui:options': {
          hideIf: formData =>
            !formData[sponsorFields.parentObject][sponsorFields.isDeceased],
        },
        'ui:required': formData =>
          formData[sponsorFields.parentObject][sponsorFields.isDeceased],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [sponsorFields.parentObject]: {
        type: 'object',
        required: [sponsorFields.dob],
        properties: {
          [sponsorFields.dob]: properties[sponsorFields.dob],
          [sponsorFields.dom]: properties[sponsorFields.dom],
          [sponsorFields.isDeceased]: properties[sponsorFields.isDeceased],
          [sponsorFields.dod]: properties[sponsorFields.dod],
          [sponsorFields.isActiveServiceDeath]:
            properties[sponsorFields.isActiveServiceDeath],
        },
      },
    },
  },
};
