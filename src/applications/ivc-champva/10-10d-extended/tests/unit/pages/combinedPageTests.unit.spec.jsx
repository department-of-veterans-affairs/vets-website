import React from 'react';
import { expect } from 'chai';
import {
  testComponentRender,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import { ApplicantRelOriginPage } from '../../../chapters/ApplicantRelOriginPage';
import { ApplicantGenderPage } from '../../../chapters/ApplicantGenderPage';
import { SelectHealthcareParticipantsPage } from '../../../chapters/SelectHealthcareParticipantsPage';
import {
  SignerContactInfoPage,
  signerContactOnGoForward,
} from '../../../chapters/signerInformation';
import mockData from '../../e2e/fixtures/data/maximal-test.json';
import formConfig from '../../../config/form';
import {
  selectMedicareParticipantOnGoForward,
  selectMedicareParticipantPage,
  SelectMedicareParticipantPage,
} from '../../../chapters/SelectMedicareParticipantsPage';

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.page1.schema,
  formConfig.chapters.certifierInformation.pages.page1.uiSchema,
  1,
  'Certifier Information - Role',
  {},
);
// check number of webcomponent fields when certifier role is 'other'
// so the extra text field is displayed
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.page5.schema,
  formConfig.chapters.certifierInformation.pages.page5.uiSchema,
  6,
  'Certifier Information - Relationship',
  { certifierRelationship: { relationshipToVeteran: { other: true } } },
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page6.schema,
  formConfig.chapters.sponsorInformation.pages.page6.uiSchema,
  5,
  'Sponsor Information - Name and DOB',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page7.schema,
  formConfig.chapters.sponsorInformation.pages.page7.uiSchema,
  1,
  'Sponsor Information - Identification info',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page7.schema,
  formConfig.chapters.sponsorInformation.pages.page7.uiSchema,
  1,
  'Sponsor Information - Identification info (role: sponsor)',
  { certifierRole: 'sponsor' },
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page8.schema,
  formConfig.chapters.sponsorInformation.pages.page8.uiSchema,
  1,
  'Sponsor Information - Status',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page10.schema,
  formConfig.chapters.sponsorInformation.pages.page10.uiSchema,
  7,
  'Sponsor Information - Address',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page10.schema,
  formConfig.chapters.sponsorInformation.pages.page10.uiSchema,
  7,
  'Sponsor Information - Address (role: sponsor)',
  { certifierRole: 'sponsor' },
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page11.schema,
  formConfig.chapters.sponsorInformation.pages.page11.uiSchema,
  2,
  'Sponsor Information - Contact info',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page11.schema,
  formConfig.chapters.sponsorInformation.pages.page11.uiSchema,
  2,
  'Sponsor Information - Contact info (role: sponsor)',
  { certifierRole: 'sponsor' },
);
testComponentRender(
  'ApplicantRelOriginPage',
  <ApplicantRelOriginPage data={{ ...mockData.data }} />,
);
testComponentRender(
  'ApplicantRelOriginPage',
  <ApplicantRelOriginPage
    data={{ ...mockData.data, sponsorIsDeceased: false }}
  />,
);
testComponentRender(
  'SelectHealthcareParticipantsPage',
  <SelectHealthcareParticipantsPage
    fullData={{ ...mockData.data }}
    data={{ ...mockData.data.healthInsurance[0] }}
  />,
);
testComponentRender(
  'SelectMedicareParticipantPage',
  <SelectMedicareParticipantPage
    fullData={{ ...mockData.data }}
    data={{}}
    contentBeforeButtons={<></>}
    contentAfterButtons={<></>}
    setFormData={() => {}}
    goBack={() => {}}
    goForward={() => {}}
    pagePerItemIndex={0}
    updatePage={() => {}}
    onReviewPage={false}
  />,
);

// Helper for testing behavior of the updateSchema call in medicareParticipant page.
function callMedicareParticipantsUpdateSchema(formData, formContext) {
  return selectMedicareParticipantPage.uiSchema.medicareParticipant[
    'ui:options'
  ].updateSchema(formData, {}, {}, 0, '', {
    ...formContext,
  });
}

describe('selectMedicareParticipantPage updateSchema', () => {
  it('should return options for each eligible applicant', () => {
    const formData = {
      applicants: [
        {
          applicantName: { first: 'Jim', last: 'Jones' },
          applicantDob: '1955-01-01',
          applicantSsn: '123123123',
        },
        {
          applicantName: { first: 'John', last: 'Jones' },
          applicantDob: '2025-01-02',
          applicantSsn: '345345345',
        },
      ],
      medicare: [{}],
    };
    const res = callMedicareParticipantsUpdateSchema(formData, {
      ...formData,
      reviewMode: false,
    });
    expect(res.enumNames.includes('Jim Jones')).to.be.true;
    expect(res.enumNames.includes('John Jones')).to.be.true;
  });

  it('should return "No eligible applicants" if no applicants present', () => {
    const formData = {
      medicare: [{}],
    };
    const res = callMedicareParticipantsUpdateSchema(formData, {
      ...formData,
      reviewMode: false,
    });
    expect(res.enumNames.includes('No eligible applicants')).to.be.true;
  });

  it('should return all applicants >= 65 years old if no Medicare array is present', () => {
    const formData = {
      applicants: [
        {
          applicantName: { first: 'Jim', last: 'Jones' },
          applicantDob: '1955-01-01',
          applicantSsn: '123123123',
        },
        {
          applicantName: { first: 'Jack', last: 'Jones' },
          applicantDob: '1955-01-02',
          applicantSsn: '321321321',
        },
        {
          applicantName: { first: 'John', last: 'Jones' },
          applicantDob: '2025-06-01',
          applicantSsn: '345345345',
        },
      ],
    };
    const res = callMedicareParticipantsUpdateSchema(formData, {
      reviewMode: true,
    });
    expect(res.enumNames).to.include('Jim Jones');
    expect(res.enumNames).to.include('Jack Jones');
    expect(res.enumNames).to.include('John Jones');
  });
});

describe('selectMedicareParticipantOnGoForward', () => {
  it('should set a view property containing applicant objects on the medicare array', () => {
    let fullData = {
      medicare: [{}],
      applicants: [{ applicantSsn: '123123123' }],
    };
    function setFd(obj) {
      fullData = obj; // overwrite the above
    }
    const props = {
      fullData,
      // Imitate what actual `setFormData` does.
      setFormData: setFd,
    };
    expect(Object.keys(props.fullData.medicare[0])).to.have.length(0);
    selectMedicareParticipantOnGoForward(props);
    expect(Object.keys(fullData.medicare[0])).to.have.length(1);
    expect(fullData.medicare[0]['view:applicantObjects']).to.equal(
      fullData.applicants,
    );
  });
});

testComponentRender(
  'ApplicantRelOriginPage',
  <ApplicantGenderPage data={{ ...mockData.data }} />,
);
testComponentRender(
  'SignerContactInfoPage',
  <SignerContactInfoPage data={{}} />,
);
testComponentRender(
  'SignerContactInfoPage',
  <SignerContactInfoPage onReviewPage />,
);
describe('SignerContactOnGoForward', () => {
  it("should copy certifier info to sponsor if certifierRole === 'sponsor'", () => {
    const props = {
      data: {
        certifierRole: 'sponsor',
        certifierName: { first: 'first', last: 'last' },
      },
    };
    signerContactOnGoForward(props); // operates directly on `props`
    expect(props.data.sponsorName.first).to.eq(props.data.certifierName.first);
  });
  it("should copy certifier info to applicant array if certifierRole === 'applicant'", () => {
    const props = {
      data: {
        certifierRole: 'applicant',
        certifierName: { first: 'first', last: 'last' },
      },
    };
    signerContactOnGoForward(props); // operates directly on `props`
    expect(props.data.applicants[0].applicantName.first).to.eq(
      props.data.certifierName.first,
    );
  });
  it("should not modify applicants array if certifierRole === 'other'", () => {
    const props = {
      data: {
        certifierRole: 'other',
        certifierName: { first: 'first', last: 'last' },
        applicants: [],
      },
    };
    signerContactOnGoForward(props); // operates directly on `props`
    expect(props.data.applicants[0]).to.eq(undefined);
  });
});
