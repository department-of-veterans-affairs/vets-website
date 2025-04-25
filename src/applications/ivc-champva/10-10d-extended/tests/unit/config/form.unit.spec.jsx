import { testNumberOfWebComponentFields } from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';
import mockData from '../../fixtures/data/test-data.json';

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page13.schema,
  formConfig.chapters.applicantInformation.pages.page13.uiSchema,
  5,
  'Applicant - Name Dob',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page13a.schema,
  formConfig.chapters.applicantInformation.pages.page13a.uiSchema,
  0,
  'Applicant - Start screen',
  { applicants: [...mockData.data.applicants, []] },
);
