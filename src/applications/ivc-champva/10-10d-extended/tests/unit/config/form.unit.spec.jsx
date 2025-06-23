import { expect } from 'chai';
import formConfig from '../../../config/form';
/* import { testNumberOfWebComponentFields } from '../../../../shared/tests/pages/pageTests.spec';
import mockData from '../../fixtures/data/test-data.json';

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page14.schema,
  formConfig.chapters.applicantInformation.pages.page14.uiSchema,
  1,
  'Applicant - SSN',
  { applicants: mockData.data.applicants },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page15.schema,
  formConfig.chapters.applicantInformation.pages.page15.uiSchema,
  8,
  'Applicant - mailing address',
  { applicants: mockData.data.applicants },
);

*/

// TODO: when we connect this form to the backend via submitUrl, we can remove
// the `submit` function + this test.
describe('formConfig', () => {
  describe('submit function', () => {
    it('should resolve with a confirmation number', () => {
      formConfig
        .submit()
        .then(r => expect(r.confirmationNumber).to.eq('123123123'));
      // expect(res.confirmationNumber).to.eq('123123123');
    });
  });
});
