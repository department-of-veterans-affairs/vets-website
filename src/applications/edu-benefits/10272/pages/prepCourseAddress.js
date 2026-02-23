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
    'The name and mailing address of the organization giving the prep course',
    'Provide the name of the organization giving the prep course.',
  ),
  prepCourseOrganizationName: {
    ...textUI({
      title: 'Organization name',
      required: () => true,
      validations: [validateWhiteSpace],
      errorMessages: {
        required: 'Please provide the name of the organization',
      },
    }),
  },
  prepCourseOrganizationAddress: addressNoMilitaryUI(),
};

const schema = {
  type: 'object',
  properties: {
    prepCourseOrganizationName: textSchema,
    prepCourseOrganizationAddress: addressNoMilitarySchema({
      omit: ['country'],
    }),
  },
  required: ['prepCourseOrganizationName', 'prepCourseOrganizationAddress'],
};

export { schema, uiSchema };
