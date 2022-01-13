import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';

import { applicantContactInformation } from '../../schemaImports';

export const title = 'Mailing address';

const checkboxTitle = 'I live on a U.S. military base outside of the country';

// NOTE: This will be removed once the schema in vets-json-schema is updated
delete applicantContactInformation.properties.email;
delete applicantContactInformation.properties.phoneNumber;

export const schema = {
  type: 'object',
  title,
  properties: {
    ...applicantContactInformation.properties,
  },
};

export const uiSchema = {
  applicantAddress: addressUiSchema(
    'applicantAddress',
    checkboxTitle,
    () => true,
  ),
};
