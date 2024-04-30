import { testNumberOfWebComponentFields } from '../../../shared/tests/pages/pageTests.spec';

import formConfig from '../../config/form';
import mockData from '../fixtures/data/test-data.json';

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.role.schema,
  formConfig.chapters.certifierInformation.pages.role.uiSchema,
  1,
  'Certifier information',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.address.schema,
  formConfig.chapters.certifierInformation.pages.address.uiSchema,
  8,
  'Certifier address',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.phoneEmail.schema,
  formConfig.chapters.certifierInformation.pages.phoneEmail.uiSchema,
  2,
  'Certifier phone/email',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.relationship.schema,
  formConfig.chapters.certifierInformation.pages.relationship.uiSchema,
  2,
  'Certifier relationship',
  { ...mockData.data },
);
