import { expect } from 'chai';
import sinon from 'sinon';
import * as helpers from 'platform/forms-system/src/js/helpers';
import transform from '../../config/transform';

describe('22-10278 transform', () => {
  let clock;
  let transformForSubmitStub;

  beforeEach(() => {
    const fixedTimestamp = new Date('2025-01-15T12:00:00Z').getTime();
    clock = sinon.useFakeTimers({ now: fixedTimestamp, toFake: ['Date'] });

    transformForSubmitStub = sinon
      .stub(helpers, 'transformForSubmit')
      .callsFake((config, form) => form.data);
  });

  afterEach(() => {
    clock.restore();
    transformForSubmitStub.restore();
  });

  const parseResult = result => JSON.parse(result).educationBenefitsClaim.form;

  it('transforms logged-in user with person disclosure, date release, and pin security question', () => {
    const form = {
      data: {
        userLoggedIn: true,
        ssn: '123456789',
        applicantName: { first: 'John', last: 'Doe' },
        dateOfBirth: '1990-01-01',
        claimantPersonalInformation: { firstName: 'John', lastName: 'Doe' },
        claimantContactInformation: {
          phoneNumber: { callingCode: '1', contact: '5551234567' },
          emailAddress: 'test@test.com',
        },
        discloseInformation: { authorize: 'person' },
        thirdPartyPersonName: {
          fullName: { first: 'Jane', middle: 'M', last: 'Smith' },
        },
        thirdPartyPersonAddress: {
          address: { street: '123 Main St', city: 'Anytown', state: 'CA' },
        },
        claimInformation: { benefit1: true, benefit2: false, benefit3: true },
        lengthOfRelease: { duration: 'date', date: '2025-12-31' },
        securityQuestion: { question: 'pin' },
        securityAnswerText: '1234',
        statementOfTruthCertified: true,
      },
    };

    const formData = parseResult(transform({}, form));

    expect(formData.claimantPersonalInformation.ssn).to.equal('123456789');
    expect(formData.ssn).to.be.undefined;
    expect(formData.applicantName).to.be.undefined;
    expect(formData.dateOfBirth).to.be.undefined;

    expect(formData.thirdPartyPersonName).to.deep.equal({
      first: 'Jane',
      middle: 'M',
      last: 'Smith',
    });
    expect(formData.thirdPartyPersonAddress).to.deep.equal({
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
    });

    expect(formData.claimInformation).to.deep.equal({
      benefit1: true,
      benefit3: true,
    });

    expect(formData.lengthOfRelease).to.deep.equal({
      lengthOfRelease: 'date',
      date: '2025-12-31',
    });

    expect(formData.securityAnswer).to.deep.equal({
      securityAnswerText: '1234',
    });
    expect(formData.securityAnswerText).to.be.undefined;

    expect(formData.privacyAgreementAccepted).to.be.true;
    expect(formData.statementOfTruthCertified).to.be.undefined;
    expect(formData.userLoggedIn).to.be.undefined;

    expect(formData.dateSigned).to.equal('2025-01-15');

    expect(formData.claimantContactInformation.phoneNumber).to.equal(
      '15551234567',
    );
  });

  it('transforms logged-out user with organization disclosure, ongoing release, and motherBornLocation question', () => {
    const form = {
      data: {
        userLoggedIn: false,
        claimantPersonalInformation: {
          firstName: 'John',
          lastName: 'Doe',
          veteranId: { ssn: '987654321' },
        },
        claimantContactInformation: {
          phoneNumber: { callingCode: '1', contact: '5559876543' },
          emailAddress: 'test2@test.com',
        },
        discloseInformation: { authorize: 'organization' },
        organizationName: 'Test Org',
        organizationAddress: { street: '456 Org St', city: 'Orgtown' },
        claimInformation: { benefit1: true },
        lengthOfRelease: { duration: 'ongoing' },
        securityQuestion: { question: 'motherBornLocation' },
        securityAnswerLocation: 'Chicago',
        statementOfTruthCertified: true,
        isAuthenticated: true,
      },
    };

    const formData = parseResult(transform({}, form));

    expect(formData.claimantPersonalInformation.ssn).to.equal('987654321');
    expect(formData.claimantPersonalInformation.veteranId).to.be.undefined;

    expect(formData.thirdPartyOrganizationInformation).to.deep.equal({
      organizationName: 'Test Org',
      organizationAddress: { street: '456 Org St', city: 'Orgtown' },
    });
    expect(formData.organizationName).to.be.undefined;
    expect(formData.organizationAddress).to.be.undefined;

    expect(formData.lengthOfRelease.lengthOfRelease).to.equal('ongoing');
    expect(formData.lengthOfRelease.duration).to.be.undefined;

    expect(formData.securityAnswer).to.deep.equal({
      securityAnswerLocation: 'Chicago',
    });
    expect(formData.securityAnswerLocation).to.be.undefined;

    expect(formData.isAuthenticated).to.be.true;
  });

  it('transforms with custom security question and non-person/org disclosure', () => {
    const form = {
      data: {
        userLoggedIn: true,
        ssn: '111223333',
        applicantName: { first: 'Jane', last: 'Smith' },
        dateOfBirth: '1985-05-15',
        claimantPersonalInformation: { firstName: 'Jane', lastName: 'Smith' },
        claimantContactInformation: {
          phoneNumber: { callingCode: '1', contact: '5550001111' },
          emailAddress: 'test3@test.com',
        },
        discloseInformation: { authorize: 'other' },
        claimInformation: { benefit1: false },
        lengthOfRelease: { duration: 'date', date: '2026-06-30' },
        securityQuestion: { question: 'custom' },
        securityAnswerCreate: 'My custom answer',
        statementOfTruthCertified: true,
      },
    };

    const formData = parseResult(transform({}, form));

    expect(formData.securityAnswer).to.deep.equal({
      securityAnswerCreate: 'My custom answer',
    });
    expect(formData.securityAnswerCreate).to.be.undefined;

    expect(formData.claimInformation).to.deep.equal({});

    expect(formData.thirdPartyOrganizationInformation).to.be.undefined;
  });
});
