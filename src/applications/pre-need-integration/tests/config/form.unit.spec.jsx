/* eslint-disable prettier/prettier */
// tests/formConfig.unit.spec.jsx
import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../config/form';
import * as helpers from '../../utils/helpers';

const testCases = [
  { chapter: 'preparerInformation', page: 'preparerDetails', expected: (A) => A },
  { chapter: 'preparerInformation', page: 'preparerContactDetails', expected: (A) => A },
  { chapter: 'preparerInformation', page: 'preparerSuggestedAddress', expected: (A) => A },
  { chapter: 'applicantInformation', page: 'applicantRelationshipToVet', expected: (A) => !A },
  { chapter: 'applicantInformation', page: 'applicantRelationshipToVetPreparer', expected: (A) => A },
  { chapter: 'applicantInformation', page: 'veteranApplicantDetails', expected: (A, V) => (!A && V) },
  { chapter: 'applicantInformation', page: 'veteranBirthLocation', expected: (A, V) => (!A && V) },
  { chapter: 'applicantInformation', page: 'veteranApplicantDetailsPreparer', expected: (A, V) => (A && V) },
  { chapter: 'applicantInformation', page: 'veteranBirthLocationPreparer', expected: (A, V) => (A && V) },
  { chapter: 'applicantInformation', page: 'nonVeteranApplicantDetails', expected: (A, V) => (!A && !V) },
  { chapter: 'applicantInformation', page: 'nonVeteranApplicantDetailsPreparer', expected: (A, V) => (A && !V) },
  { chapter: 'applicantInformation', page: 'applicantMailingAddress', expected: (A) => !A },
  { chapter: 'applicantInformation', page: 'applicantSuggestedAddress', expected: (A) => !A },
  { chapter: 'applicantInformation', page: 'applicantContactDetails', expected: (A) => !A },
  { chapter: 'applicantInformation', page: 'applicantMailingAddressPreparer', expected: (A) => A },
  { chapter: 'applicantInformation', page: 'applicantSuggestedAddressPreparer', expected: (A) => A },
  { chapter: 'applicantInformation', page: 'applicantContactDetailsPreparer', expected: (A) => A },
  { chapter: 'applicantInformation', page: 'applicantDemographics', expected: (A, V) => (!A && V) },
  { chapter: 'applicantInformation', page: 'applicantDemographicsPreparer', expected: (A, V) => (A && V) },
  { chapter: 'applicantInformation', page: 'applicantDemographics2', expected: (A, V) => (!A && V) },
  { chapter: 'applicantInformation', page: 'applicantDemographics2Preparer', expected: (A, V) => (A && V) },
  { chapter: 'sponsorInformation', page: 'isSponsor', expected: (A, V) => (A && !V) },
  { chapter: 'sponsorInformation', page: 'sponsorDetails', expected: (A, V) => !V },
  { chapter: 'sponsorInformation', page: 'sponsorDeceased', expected: (A, V) => !V },
  { chapter: 'sponsorInformation', page: 'sponsorContactInformation', expected: (A, V) => !V },
  { chapter: 'sponsorInformation', page: 'sponsorSuggestedAddress', expected: (A, V) => !V },
  { chapter: 'sponsorInformation', page: 'sponsorDemographics', expected: (A, V) => !V },
  { chapter: 'sponsorInformation', page: 'sponsorRace', expected: (A, V) => !V },
  { chapter: 'militaryName', page: 'militaryDetailsSelf', expected: (A, V) => (V && !A) },
  { chapter: 'militaryName', page: 'militaryDetailsPreparer', expected: (A, V) => (V && A) },
  { chapter: 'militaryName', page: 'sponsorMilitaryDetailsSelf', expected: (A, V) => (!V && !A) },
  { chapter: 'militaryName', page: 'sponsorMilitaryDetailsPreparer', expected: (A, V) => (!V && A) },
  { chapter: 'militaryName', page: 'applicantMilitaryNameSelf', expected: (A, V) => (V && !A) },
  { chapter: 'militaryName', page: 'applicantMilitaryNamePreparer', expected: (A, V) => (V && A) },
  { chapter: 'militaryName', page: 'applicantMilitaryNameInformation', expected: (A, V) => (V && !A) },
  { chapter: 'militaryName', page: 'applicantMilitaryNameInformationPreparer', expected: (A, V) => (V && A) },
  { chapter: 'militaryName', page: 'sponsorMilitaryName', expected: (A, V) => (!V && A) },
  { chapter: 'militaryName', page: 'sponsorMilitaryNameSelf', expected: (A, V) => (!V && !A) },
  { chapter: 'militaryName', page: 'sponsorMilitaryNameInformation', expected: (A, V) => !V }
];

const combinations = [
  { A: true, V: true },
  { A: true, V: false },
  { A: false, V: true },
  { A: false, V: false }
];

describe('preneed formConfig depends logic (isAuthorizedAgent & isVeteran)', () => {
  const stubs = {};

  beforeEach(() => {
    stubs.isAuthorizedAgent = sinon.stub(helpers, 'isAuthorizedAgent');
    stubs.isVeteran = sinon.stub(helpers, 'isVeteran');
    stubs.isVeteranAndHasServiceName = sinon.stub(helpers, 'isVeteranAndHasServiceName');
    stubs.isNotVeteranAndHasServiceName = sinon.stub(helpers, 'isNotVeteranAndHasServiceName');
    stubs.isApplicantTheSponsor = sinon.stub(helpers, 'isApplicantTheSponsor');
    stubs.isSponsorDeceased = sinon.stub(helpers, 'isSponsorDeceased');
    stubs.buriedWSponsorsEligibility = sinon.stub(helpers, 'buriedWSponsorsEligibility');
    stubs.isLoggedInUser = sinon.stub(helpers, 'isLoggedInUser');

    stubs.isApplicantTheSponsor.returns(false);
    stubs.isSponsorDeceased.returns(false);
    stubs.buriedWSponsorsEligibility.returns(false);
  });

  afterEach(() => {
    Object.values(stubs).forEach(s => s.restore());
  });

  testCases.forEach(({ chapter, page, expected, extraFormData }) => {
    describe(`Page "${page}" in chapter "${chapter}"`, () => {
      combinations.forEach(({ A, V }) => {
        it(`should return ${expected(A, V)} when isAuthorizedAgent=${A} and isVeteran=${V}`, () => {
          stubs.isAuthorizedAgent.returns(A);
          stubs.isVeteran.returns(V);
          stubs.isVeteranAndHasServiceName.returns(V);
          stubs.isNotVeteranAndHasServiceName.returns(!V);

          let formData = {};
          if (page === 'sponsorSuggestedAddress' || extraFormData) {
            formData = { application: { veteran: { address: { street: '123 Main St' } } } };
          }
          const pageConfig = formConfig.chapters[chapter].pages[page];
          const result = pageConfig.depends(formData);
          expect(result).to.equal(expected(A, V));
        });
      });
    });
  });
});
