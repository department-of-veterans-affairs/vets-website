import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import formConfig from '../../../config/form';
import { testNumberOfWebComponentFields } from '../../../../shared/tests/pages/pageTests.spec';

import mockData from '../../e2e/fixtures/data/medical-claim.json';
import { insuranceOptions } from '../../../chapters/healthInsuranceInformation';
import NotEnrolledPage from '../../../components/FormPages/NotEnrolledPage';

describe('Certifier role page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.signerInformation.pages.page1.schema,
    formConfig.chapters.signerInformation.pages.page1.uiSchema,
    1,
    'Certifier role',
    { ...mockData.data },
  );
});

describe('Certifier enrolled in CHAMPVA page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.signerInformation.pages.page1a1.schema,
    formConfig.chapters.signerInformation.pages.page1a1.uiSchema,
    1,
    'Certifier enrolled in CHAMPVA page',
    { ...mockData.data },
  );
});

describe('Certifier enrolled in CHAMPVA (role: other) page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.signerInformation.pages.page1a1.schema,
    formConfig.chapters.signerInformation.pages.page1a1.uiSchema,
    1,
    'Certifier enrolled in CHAMPVA page',
    { ...mockData.data, certifierRole: 'other' },
  );
});

describe('NotEnrolledPage', () => {
  it('should render', () => {
    const { container } = render(<NotEnrolledPage goBack={() => {}} />);
    expect(container).to.exist;
  });
});

describe('Certifier relationship page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.signerInformation.pages.page1d.schema,
    formConfig.chapters.signerInformation.pages.page1d.uiSchema,
    1,
    'Certifier relationship',
    { ...mockData.data },
  );
});

// Should have an extra field when 'other' textbox is expanded
describe('Certifier relationship (other) page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.signerInformation.pages.page1d.schema,
    formConfig.chapters.signerInformation.pages.page1d.uiSchema,
    2,
    'Certifier relationship (other)',
    { ...mockData.data, certifierRelationship: 'other' },
  );
});

describe('Certifier enrolled in CHAMPVA page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.signerInformation.pages.page1e.schema,
    formConfig.chapters.signerInformation.pages.page1e.uiSchema,
    1,
    'Certifier is claim resubmission',
    { ...mockData.data },
  );
});

describe('Certifier enrolled in CHAMPVA page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.signerInformation.pages.page1e.schema,
    formConfig.chapters.signerInformation.pages.page1e.uiSchema,
    1,
    'Certifier is claim resubmission (applicant)',
    { ...mockData.data, certifierRole: 'applicant' },
  );
});

describe('Applicant Name/DOB page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.beneficiaryInformation.pages.page2a.schema,
    formConfig.chapters.beneficiaryInformation.pages.page2a.uiSchema,
    5,
    'Applicant name/DOB',
    { ...mockData.data },
  );
});

describe('Applicant Name/DOB (role: other) page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.beneficiaryInformation.pages.page2a.schema,
    formConfig.chapters.beneficiaryInformation.pages.page2a.uiSchema,
    5,
    'Applicant name/DOB (role: other)',
    { ...mockData.data, certifierRole: 'other' },
  );
});

describe('Applicant member number page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.beneficiaryInformation.pages.page2b.schema,
    formConfig.chapters.beneficiaryInformation.pages.page2b.uiSchema,
    1,
    'Applicant member number',
    { ...mockData.data },
  );
});

describe('Applicant member number (role: other) page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.beneficiaryInformation.pages.page2b.schema,
    formConfig.chapters.beneficiaryInformation.pages.page2b.uiSchema,
    1,
    'Applicant member number (role: other) ',
    { ...mockData.data, certifierRole: 'other' },
  );
});

describe('Applicant shared address page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.beneficiaryInformation.pages.page2c.schema,
    formConfig.chapters.beneficiaryInformation.pages.page2c.uiSchema,
    0,
    'Applicant shared address',
    { ...mockData.data },
  );
});

describe('Applicant mailing address page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.beneficiaryInformation.pages.page2d.schema,
    formConfig.chapters.beneficiaryInformation.pages.page2d.uiSchema,
    8,
    'Applicant mailing address',
    { ...mockData.data },
  );
});

describe('Applicant mailing address (role: other) page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.beneficiaryInformation.pages.page2d.schema,
    formConfig.chapters.beneficiaryInformation.pages.page2d.uiSchema,
    8,
    'Applicant mailing address (role: other)',
    { ...mockData.data, certifierRole: 'other' },
  );
});

describe('Applicant phone page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.beneficiaryInformation.pages.page2e.schema,
    formConfig.chapters.beneficiaryInformation.pages.page2e.uiSchema,
    2,
    'Applicant contact info',
    { ...mockData.data },
  );
});

describe('Applicant phone (role: other) page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.beneficiaryInformation.pages.page2e.schema,
    formConfig.chapters.beneficiaryInformation.pages.page2e.uiSchema,
    2,
    'Applicant contact info (role: other)',
    { ...mockData.data, certifierRole: 'other' },
  );
});

describe('Insurance status page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.healthInsuranceInformation.pages.page3.schema,
    formConfig.chapters.healthInsuranceInformation.pages.page3.uiSchema,
    1,
    'Insurance status',
    { ...mockData.data },
  );
});

describe('health insurance array builder options isItemIncomplete', () => {
  it('should return false if all required fields are populated', () => {
    const completeItem = {
      type: 'group',
      name: 'BCBS',
      policyNum: '123',
      providerPhone: '1231231234',
    };
    expect(insuranceOptions.isItemIncomplete(completeItem)).to.be.false;
  });
  it('should return true if required fields are missing', () => {
    const completeItem = {
      policyNum: '123',
      providerPhone: '1231231234',
    };
    expect(insuranceOptions.isItemIncomplete(completeItem)).to.be.true;
  });
});

describe('health insurance array builder options.text', () => {
  it('should getItemName when given an item', () => {
    const completeItem = {
      type: 'group',
      name: 'BCBS',
      policyNum: '123',
      providerPhone: '1231231234',
    };
    expect(insuranceOptions.text.getItemName(completeItem)).to.eq(
      completeItem.name,
    );
  });

  it('should return cardDescription matching otherType when given an item of type other', () => {
    const completeItem = {
      type: 'other',
      otherType: 'some other type',
      name: 'BCBS',
      policyNum: '123',
      providerPhone: '1231231234',
    };
    expect(insuranceOptions.text.cardDescription(completeItem)).to.eq(
      'some other type',
    );
  });

  it('should return cardDescription when given an item', () => {
    const completeItem = {
      type: 'group',
      name: 'BCBS',
      policyNum: '123',
      providerPhone: '1231231234',
    };
    expect(insuranceOptions.text.cardDescription(completeItem)).to.eq(
      'Employer sponsored insurance (group)',
    );
  });

  it('should return summaryTitle when given an item', () => {
    const completeItem = {
      type: 'group',
      name: 'BCBS',
      policyNum: '123',
      providerPhone: '1231231234',
      formData: mockData.data,
    };
    // It returns JSX with the privacy class wrapper
    const { container } = render(
      insuranceOptions.text.summaryTitle(completeItem),
    );
    expect(container.innerHTML).to.include('health insurance review');
  });
});

describe('Insurance status (role: other) page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.healthInsuranceInformation.pages.page3.schema,
    formConfig.chapters.healthInsuranceInformation.pages.page3.uiSchema,
    1,
    'Insurance status (role: other)',
    { ...mockData.data, certifierRole: 'other' },
  );
});

describe('Work related claim page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.claimInformation.pages.page5.schema,
    formConfig.chapters.claimInformation.pages.page5.uiSchema,
    1,
    'Work related claim',
    { ...mockData.data },
  );
});

describe('Auto related claim page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.claimInformation.pages.page6.schema,
    formConfig.chapters.claimInformation.pages.page6.uiSchema,
    1,
    'Auto related claim',
    { ...mockData.data },
  );
});

describe('Medical claim upload page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.claimInformation.pages.page7.schema,
    formConfig.chapters.claimInformation.pages.page7.uiSchema,
    0,
    'Medical claim upload',
    { ...mockData.data, claimType: 'medical' },
  );
});

describe('Eob 1 upload page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.claimInformation.pages.page8.schema,
    formConfig.chapters.claimInformation.pages.page8.uiSchema,
    0,
    'Eob 1 upload',
    { ...mockData.data },
  );
});

describe('Eob 1 upload (role: other) page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.claimInformation.pages.page8.schema,
    formConfig.chapters.claimInformation.pages.page8.uiSchema,
    0,
    'Eob 1 upload (role: other)',
    { ...mockData.data, certifierRole: 'other' },
  );
});

describe('Eob 2 upload page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.claimInformation.pages.page9.schema,
    formConfig.chapters.claimInformation.pages.page9.uiSchema,
    0,
    'Eob 2 upload',
    { ...mockData.data },
  );
});

describe('Sponsor name page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.sponsorInformation.pages.page2.schema,
    formConfig.chapters.sponsorInformation.pages.page2.uiSchema,
    4,
    'Sponsor name',
    { ...mockData.data },
  );
});

describe('Sponsor name (role: other) page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.sponsorInformation.pages.page2.schema,
    formConfig.chapters.sponsorInformation.pages.page2.uiSchema,
    4,
    'Sponsor name (role: other)',
    { ...mockData.data, certifierRole: 'other' },
  );
});

describe('Sponsor name (role: sponsor) page', () => {
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.sponsorInformation.pages.page2.schema,
    formConfig.chapters.sponsorInformation.pages.page2.uiSchema,
    4,
    'Sponsor name (role: sponsor)',
    { ...mockData.data, certifierRole: 'sponsor' },
  );
});

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

describe('fullNamePath ', () => {
  it('should be `applicantName` when certifierRole is `applicant`', () => {
    expect(
      formConfig.preSubmitInfo.statementOfTruth.fullNamePath({
        certifierRole: 'applicant',
      }),
    ).to.equal('applicantName');
  });
  it('should be `certifierName` when certifierRole is NOT `applicant`', () => {
    expect(
      formConfig.preSubmitInfo.statementOfTruth.fullNamePath({
        certifierRole: 'other',
      }),
    ).to.equal('certifierName');
  });
});
