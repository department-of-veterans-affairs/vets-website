import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  AUTHORIZER_TYPES,
  THIRD_PARTY_TYPES,
  INFORMATION_SCOPES,
} from '../definitions/constants';
import { getFullNameString } from '../utils';

/** @type {PageSchema} */
export default {
  uiSchema: {
    informationScope: radioUI({
      labels: {
        [INFORMATION_SCOPES.LIMITED]: 'Limited information',
        [INFORMATION_SCOPES.ANY]: 'Any information',
      },
      errorMessages: {
        required:
          'Please select how much information you would like us to release',
      },
      labelHeaderLevel: '3',
      updateSchema: formData => {
        const {
          authorizerType,
          thirdPartyType,
          personFullName,
          organizationName,
        } = formData;
        const titleString =
          authorizerType === AUTHORIZER_TYPES.VETERAN
            ? 'How much information from your VA record do you authorize us to release to [third-party-name]?'
            : 'I authorize VA to provide [third-party-name] the following information from my VA record:';
        const thirdPartyName =
          thirdPartyType === THIRD_PARTY_TYPES.PERSON
            ? getFullNameString(personFullName)
            : organizationName;

        return {
          title: titleString.replace('[third-party-name]', thirdPartyName),
        };
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['informationScope'],
    properties: {
      informationScope: radioSchema(Object.values(INFORMATION_SCOPES)),
    },
  },
};
