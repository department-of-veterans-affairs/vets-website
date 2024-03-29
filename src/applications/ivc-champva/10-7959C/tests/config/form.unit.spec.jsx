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
