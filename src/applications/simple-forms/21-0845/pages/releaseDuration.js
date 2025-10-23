import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { THIRD_PARTY_TYPES, RELEASE_DURATIONS } from '../definitions/constants';
import {
  getEnumsFromConstants,
  getFullNameString,
  getLabelsFromConstants,
} from '../utils';

/** @type {PageSchema} */
export default {
  uiSchema: {
    releaseDuration: radioUI({
      title: 'How long do you authorize us to release your information for?',
      labels: getLabelsFromConstants(RELEASE_DURATIONS),
      errorMessages: {
        required: 'Please select a release duration.',
      },
      labelHeaderLevel: '3',
      updateSchema: formData => {
        const { thirdPartyType, personFullName, organizationName } = formData;
        let thirdPartyName = '[third-party name]';

        if (
          thirdPartyType === THIRD_PARTY_TYPES.PERSON &&
          personFullName.first &&
          personFullName.last
        ) {
          thirdPartyName = getFullNameString(personFullName);
        } else if (
          thirdPartyType === THIRD_PARTY_TYPES.ORGANIZATION &&
          organizationName
        ) {
          thirdPartyName = organizationName;
        }

        return {
          title: `Tell us when, and how long, we should release your information to ${thirdPartyName}.`,
        };
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['releaseDuration'],
    properties: {
      releaseDuration: radioSchema(getEnumsFromConstants(RELEASE_DURATIONS)),
    },
  },
};
