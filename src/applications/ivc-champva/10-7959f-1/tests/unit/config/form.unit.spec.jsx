import mockdata from '../../e2e/fixtures/data/test-data.json';
import { testNumberOfWebComponentFields } from '../../../../shared/tests/pages/pageTests.spec';

import formConfig from '../../../config/form';

// testNumberOfWebComponentFields(
//   formConfig,
//   formConfig.chapters.applicantInformationChapter.pages.page1.schema,
//   formConfig.chapters.applicantInformationChapter.pages.page1.uiSchema,
//   5,
//   'Applicant information',
//   { ...mockdata.data },
// );

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.identificationInformation.pages.page2.schema,
  formConfig.chapters.identificationInformation.pages.page2.uiSchema,
  2,
  'Applicant identification',
  { ...mockdata.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.identificationInformation.pages.page2.schema,
  formConfig.chapters.identificationInformation.pages.page2.uiSchema,
  2,
  'Applicant identification',
  { ...mockdata.data, veteranSocialSecurityNumber: { ssn: '' } },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.mailingAddress.pages.page3.schema,
  formConfig.chapters.mailingAddress.pages.page3.uiSchema,
  8,
  'Applicant mailing address',
  { ...mockdata.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.physicalAddress.pages.page4a.schema,
  formConfig.chapters.physicalAddress.pages.page4a.uiSchema,
  8,
  'Applicant home address',
  { ...mockdata.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.physicalAddress.pages.page4.schema,
  formConfig.chapters.physicalAddress.pages.page4.uiSchema,
  1,
  'Applicant home address yes/no',
  { ...mockdata.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.contactInformation.pages.page5.schema,
  formConfig.chapters.contactInformation.pages.page5.uiSchema,
  2,
  'Applicant phone/email',
  { ...mockdata.data },
);
