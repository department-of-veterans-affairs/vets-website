import { expect } from 'chai';

import { testNumberOfWebComponentFields } from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import mockData from '../fixtures/data/test-data.json';

// Call the depends() function for any page that relies on it
describe('dependent page logic', () => {
  it('should be called', () => {
    let depCount = 0;

    Object.keys(formConfig.chapters).forEach(ch => {
      Object.keys(formConfig.chapters[`${ch}`].pages).forEach(pg => {
        const { depends } = formConfig.chapters[`${ch}`].pages[`${pg}`];
        if (depends) {
          depends({ data: '' });
          depCount += 1;
        }
      });
    });

    expect(depCount > 0).to.be.true;
  });
});

// Call the title fn for any page that has a computed title
// NOTE: if mockData.data doesn't have all the properties accessed by your
// titles, this test will fail and point you to the title with the property
// that is missing.
describe('title text logic', () => {
  it('should be called', () => {
    let titleCount = 0;

    Object.keys(formConfig.chapters).forEach(ch => {
      Object.keys(formConfig.chapters[`${ch}`].pages).forEach(pg => {
        const { title } = formConfig.chapters[`${ch}`].pages[`${pg}`];
        if (typeof title === 'function') {
          title({ data: mockData.data });
          titleCount += 1;
        }
      });
    });

    expect(titleCount > 0).to.be.true;
  });
});

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
  formConfig.chapters.certifierInformation.pages.name.schema,
  formConfig.chapters.certifierInformation.pages.name.uiSchema,
  4,
  'Certifier name',
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

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.relationship.schema,
  formConfig.chapters.certifierInformation.pages.relationship.uiSchema,
  2,
  'Certifier relationship',
  { ...mockData.data },
);

describe('Applicant Name/DOB page title', () => {
  it('should start with "Your" if role is "applicant"', () => {
    const {
      title,
    } = formConfig.chapters.applicantInformation.pages.applicantNameDob;
    const res = title({ ...mockData.data, certifierRole: 'applicant' });
    expect(res.startsWith('Your')).to.be.true;
  });
});

describe('Medicare ineligibility screen depends function', () => {
  // Get date 65 yrs ago in format MM-DD-YYYY (to match what form would produce)
  const date65YrAgo = new Date();
  date65YrAgo.setFullYear(date65YrAgo.getFullYear() - 65);

  it('should return true if applicant is ineligible and over 65', () => {
    const depRes = formConfig.chapters.medicareInformation.pages.medicareIneligible.depends(
      {
        applicantMedicareStatusContinued: 'ineligible',
        applicantDOB: date65YrAgo,
      },
    );

    expect(depRes).to.be.true;
  });
});
