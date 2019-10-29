import { Pact, Matchers } from '@pact-foundation/pact';
import { expect } from 'chai';

import environment from 'platform/utilities/environment';

describe('HCA API', () => {
  const { like, iso8601DateTimeWithMillis } = Matchers;

  const provider = new Pact({
    port: 3000,
    consumer: 'VA.gov',
    provider: 'VA.gov API',
    spec: 2,
  });

  before(() => provider.setup());
  after(() => provider.finalize());
  afterEach(() => provider.verify());

  const PAYLOAD = {
    isEssentialAcaCoverage: false,
    vaMedicalFacility: '523GC',
    wantsInitialVaContact: false,
    isCoveredByHealthInsurance: false,
    isMedicaidEligible: true,
    isEnrolledMedicarePartA: false,
    deductibleMedicalExpenses: 0,
    deductibleFuneralExpenses: 0,
    deductibleEducationExpenses: 0,
    veteranGrossIncome: 50000,
    veteranNetIncome: 0,
    veteranOtherIncome: 0,
    dependents: [],
    gender: 'F',
    maritalStatus: 'Never Married',
    isSpanishHispanicLatino: false,
    discloseFinancialInformation: true,
    vaCompensationType: 'lowDisability',
    lastServiceBranch: 'air force',
    lastEntryDate: '1970-01-01',
    lastDischargeDate: '1990-01-01',
    dischargeType: 'honorable',
    veteranAddress: {
      street: '123 Cambridge St',
      city: 'Boston',
      postalCode: '02182',
      country: 'USA',
      state: 'MA',
    },
    veteranDateOfBirth: '1900-01-01',
    veteranSocialSecurityNumber: '012349232',
    veteranFullName: {
      first: 'First',
      last: 'Last',
    },
    privacyAgreementAccepted: true,
  };

  const EXPECTED_BODY = {
    success: true,
    formSubmissionId: like(3806115661),
    timestamp: iso8601DateTimeWithMillis(),
  };

  const interactions = {
    SUBMISSION_WITHOUT_ATTACHMENTS: {
      uponReceiving: 'an application for health care',
      withRequest: {
        method: 'POST',
        path: '/v0/health_care_applications',
        body: PAYLOAD,
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: EXPECTED_BODY,
      },
    },
  };

  describe('POST /health_care_applications', () => {
    it('without attachments responds with success', async () => {
      await provider.addInteraction(
        interactions.SUBMISSION_WITHOUT_ATTACHMENTS,
      );

      const response = await fetch(
        `${environment.API_URL}/v0/health_care_applications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(PAYLOAD),
        },
      );

      expect(response.ok).to.be.true;
    });
  });
});
