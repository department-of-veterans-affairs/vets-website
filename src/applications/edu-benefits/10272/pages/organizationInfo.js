import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

const uiSchema = {
  ...titleUI(
    'The name and mailing address of organization awarding license or certification',
    'Provide the name and mailing address of the organization that issues the certification.',
  ),
  organizationName: {
    ...textUI({
      title: 'Organization name',
      required: () => true,
      validations: [validateWhiteSpace],
      errorMessages: {
        required: 'Please provide the name of the organization',
      },
    }),
  },
  organizationAddress: addressNoMilitaryUI(),
};

const schema = {
  type: 'object',
  properties: {
    organizationName: textSchema,
    organizationAddress: addressNoMilitarySchema({ omit: ['country'] }),
  },
  required: ['organizationName', 'organizationAddress'],
};

export { schema, uiSchema };
