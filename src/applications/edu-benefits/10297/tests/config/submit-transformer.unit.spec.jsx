import { expect } from 'chai';
import sinon from 'sinon';

import transformTestData from '../fixtures/data/maximal-test.json';
import formConfig from '../../config/form';
import { transform } from '../../config/submit-transformer';

describe('22-10297 Submit Transformer Function', () => {
  let clock;

  beforeEach(() => {
    // Mock Date.now() to always return a fixed value in 2025
    const fixedTimestamp = new Date('2025-08-11T00:00:00Z').getTime();
    clock = sinon.useFakeTimers({ now: fixedTimestamp, toFake: ['Date'] });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should transform the form data on the ui to match the json schema', () => {
    const submitData = JSON.parse(
      transform(formConfig, {
        data: transformTestData.data,
        formId: '22-10297',
      }),
    );

    // Verify TOE-style payload structure
    expect(submitData['@type']).to.equal('vettec');
    expect(submitData.formId).to.equal('22-10297');
    expect(submitData.claimant).to.exist;
    expect(submitData.claimant.firstName).to.equal('John');
    expect(submitData.claimant.lastName).to.equal('Doe');
    expect(submitData.claimant.dateOfBirth).to.equal('1930-10-03');
    expect(submitData.claimant.contactInfo).to.exist;
    expect(submitData.claimant.contactInfo.countryCode).to.equal('US');
    expect(submitData.militaryInfo).to.exist;
    expect(submitData.directDeposit).to.exist;
    expect(submitData.directDeposit.directDepositAccountType).to.equal(
      'checking',
    );
    expect(submitData.trainingProviders).to.exist;
    expect(submitData.trainingProviders.providers).to.have.lengthOf(1);
    expect(submitData.trainingProviders.providers[0].providerName).to.equal(
      'Test Training Provider',
    );
    expect(submitData.employmentInfo).to.exist;
    expect(submitData.employmentInfo.isEmployed).to.equal(true);
    expect(submitData.attestationAgreementAccepted).to.exist;
    expect(submitData.dateSigned).to.exist;
  });
});
