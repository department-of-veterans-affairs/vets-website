import { expect } from 'chai';
import sinon from 'sinon';

import {
  errorMessages,
  EVIDENCE_VA,
  EVIDENCE_PRIVATE,
  EVIDENCE_OTHER,
  MAX_LENGTH,
} from '../../constants';

import {
  validateEvidence,
  validateVaLocation,
  validateVaIssues,
  validateVaFromDate,
  validateVaToDate,
  validateVaUnique,
  isValidZip,
  validateZip,
} from '../../validations/evidence';

describe('validateEvidence', () => {
  const getEvidence = ({
    va = false,
    locations = [],
    priv8 = false,
    facility = [],
    other = false,
    docs = [],
  }) => ({
    [EVIDENCE_VA]: va,
    locations,
    [EVIDENCE_PRIVATE]: priv8,
    providerFacility: facility,
    [EVIDENCE_OTHER]: other,
    additionalDocuments: docs,
  });
  it('should show error if missing all evidence', () => {
    const errors = { addError: sinon.spy() };
    validateEvidence(errors, getEvidence({}));
    expect(errors.addError.called).to.be.true;
  });
  it('should show error choosing all evidence, but it is all missing', () => {
    const errors = { addError: sinon.spy() };
    validateEvidence(
      errors,
      getEvidence({ va: true, priv8: true, other: true }),
    );
    expect(errors.addError.called).to.be.true;
  });
  it('should show error not choosing evidence, but the data is there', () => {
    const errors = { addError: sinon.spy() };
    validateEvidence(
      errors,
      getEvidence({ locations: [1], facility: [2], docs: [3] }),
    );
    expect(errors.addError.called).to.be.true;
  });
  it('should not show an error if providing evidence', () => {
    const errors = { addError: sinon.spy() };
    validateEvidence(errors, getEvidence({ va: true, locations: [1] }));
    expect(errors.addError.called).to.be.false;
    validateEvidence(errors, getEvidence({ priv8: true, facility: [2] }));
    expect(errors.addError.called).to.be.false;
    validateEvidence(errors, getEvidence({ other: true, docs: [3] }));
    expect(errors.addError.called).to.be.false;

    validateEvidence(
      errors,
      getEvidence({ va: true, locations: [1], priv8: true, other: true }),
    );
    expect(errors.addError.called).to.be.false;
    validateEvidence(
      errors,
      getEvidence({ va: true, priv8: true, facility: [2], other: true }),
    );
    expect(errors.addError.called).to.be.false;
    validateEvidence(
      errors,
      getEvidence({ va: true, priv8: true, other: true, docs: [3] }),
    );
    expect(errors.addError.called).to.be.false;
  });
});

describe('validateVaLocation', () => {
  it('should not show an error for an added location name', () => {
    const errors = { addError: sinon.spy() };
    validateVaLocation(errors, { locationAndName: 'ok' });
    expect(errors.addError.called).to.be.false;
  });
  it('should show an error for a missing location name', () => {
    const errors = { addError: sinon.spy() };
    validateVaLocation(errors, { locationAndName: '' });
    expect(errors.addError.calledWith(errorMessages.evidence.locationMissing))
      .to.be.true;
  });
  it('should show an error for a too long location name', () => {
    const errors = { addError: sinon.spy() };
    validateVaLocation(errors, {
      locationAndName: 'a'.repeat(MAX_LENGTH.EVIDENCE_LOCATION_AND_NAME + 1),
    });
    expect(errors.addError.calledWith(errorMessages.evidence.locationMaxLength))
      .to.be.true;
  });
});

describe('validateVaIssues', () => {
  it('should not show an error for included issues', () => {
    const errors = { addError: sinon.spy() };
    validateVaIssues(errors, { issues: ['ok'] });
    expect(errors.addError.called).to.be.false;
  });
  it('should show an error for a missing issues', () => {
    const errors = { addError: sinon.spy() };
    validateVaIssues(errors, { issues: [] });
    expect(errors.addError.calledWith(errorMessages.evidence.issuesMissing)).to
      .be.true;
  });
});

describe('validateVaIssues', () => {
  it('should not show an error for included issues', () => {
    const errors = { addError: sinon.spy() };
    validateVaIssues(errors, { issues: ['ok'] });
    expect(errors.addError.called).to.be.false;
  });
  it('should show an error for a missing issues', () => {
    const errors = { addError: sinon.spy() };
    validateVaIssues(errors, { issues: [] });
    expect(errors.addError.calledWith(errorMessages.evidence.issuesMissing)).to
      .be.true;
  });
});

describe('validateVaFromDate', () => {
  it('should not show an error for a valid from date', () => {
    const errors = { addError: sinon.spy() };
    validateVaFromDate(errors, { evidenceDates: { from: '2022-01-01' } });
    expect(errors.addError.called).to.be.false;
  });
  it('should show an error for an invalid from date', () => {
    const errors = { addError: sinon.spy() };
    validateVaFromDate(errors, { evidenceDates: { from: '-01-01' } });
    expect(errors.addError.calledWith(errorMessages.invalidDate)).to.be.true;
  });
  it('should show an error for a missing from date', () => {
    const errors = { addError: sinon.spy() };
    validateVaFromDate(errors, { evidenceDates: { from: '' } });
    expect(errors.addError.calledWith(errorMessages.invalidDate)).to.be.true;
  });
});

describe('validateVaToDate', () => {
  it('should not show an error for a valid to date & range', () => {
    const errors = { addError: sinon.spy() };
    validateVaToDate(errors, {
      evidenceDates: { from: '2022-01-01', to: '2022-02-02' },
    });
    expect(errors.addError.called).to.be.false;
  });
  it('should show an error for an invalid to date', () => {
    const errors = { addError: sinon.spy() };
    validateVaToDate(errors, { evidenceDates: { to: '-01-01' } });
    expect(errors.addError.calledWith(errorMessages.invalidDate)).to.be.true;
  });
  it('should show an error for a missing to date', () => {
    const errors = { addError: sinon.spy() };
    validateVaToDate(errors, { evidenceDates: { to: '' } });
    expect(errors.addError.calledWith(errorMessages.invalidDate)).to.be.true;
  });
  it('should show an error for a to date before from date', () => {
    const errors = { addError: sinon.spy() };
    validateVaToDate(errors, {
      evidenceDates: { from: '2022-02-02', to: '2022-01-01' },
    });
    expect(errors.addError.calledWith(errorMessages.endDateBeforeStart)).to.be
      .true;
  });
  it('should show an error for a to date in the future', () => {
    const errors = { addError: sinon.spy() };
    validateVaToDate(errors, { evidenceDates: { to: '2399-01-01' } });
    expect(errors.addError.args[0][0]).contains('must enter a year between');
  });
});

describe('validateVaUnique', () => {
  const getLocations = (name3 = 'location 2') => ({
    locations: [
      {
        locationAndName: 'Location 1',
        issues: ['Ankylosis of knee'],
        evidenceDates: { from: '2001-01-01', to: '2011-01-01' },
      },
      {
        locationAndName: 'Location 2',
        issues: ['Ankylosis of knees'],
        evidenceDates: { from: '2002-02-02', to: '2012-02-02' },
      },
      {
        locationAndName: name3,
        issues: ['AnKyLoSiS of KNEE'],
        evidenceDates: { from: '2001-01-01', to: '2011-01-01' },
      },
    ],
  });
  it('should not show an error for unique locations', () => {
    const errors = { addError: sinon.spy() };
    validateVaUnique(errors, {}, getLocations());
    expect(errors.addError.called).to.be.false;
  });
  it('should show an error for duplicate locations', () => {
    const errors = { addError: sinon.spy() };
    validateVaUnique(errors, {}, getLocations('LOCATION 1'));
    expect(errors.addError.calledWith(errorMessages.evidence.unique)).to.be
      .true;
  });
});

describe('isValidZIP', () => {
  it('should return true for valid zip codes', () => {
    expect(isValidZip('90210')).to.be.true;
    expect(isValidZip('90210 0000')).to.be.true;
    expect(isValidZip('90210-1111')).to.be.true;
  });
  it('should return false for missing or invalid zip codes', () => {
    expect(isValidZip()).to.be.false;
    expect(isValidZip(null)).to.be.false;
    expect(isValidZip('abcde')).to.be.false;
    expect(isValidZip('9021')).to.be.false;
    expect(isValidZip('90210 0')).to.be.false;
    expect(isValidZip('90210 00')).to.be.false;
    expect(isValidZip('90210 000')).to.be.false;
    expect(isValidZip('90210 abcd')).to.be.false;
    expect(isValidZip('9021a')).to.be.false;
  });
});

describe('validateZIP', () => {
  it('should not show an error for a valid zip code', () => {
    const errors = { addError: sinon.spy() };
    validateZip(errors, '90210');
    expect(errors.addError.called).to.be.false;
  });
  it('should not show an error for a valid zip code', () => {
    const errors = { addError: sinon.spy() };
    validateZip(errors, '9021a');
    expect(errors.addError.calledWith(errorMessages.invalidZip)).to.be.true;
  });
});
