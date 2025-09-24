import { expect } from 'chai';
import { isRefillTakingLongerThanExpected } from '../../../util/helpers';
import { dispStatusObj } from '../../../util/constants';

describe('isRefillTakingLongerThanExpected function', () => {
  const now = new Date();
  const isoNow = now.toISOString();
  // 8 days ago (past threshold)
  const eightDaysAgoDate = new Date();
  eightDaysAgoDate.setDate(now.getDate() - 8);
  const eightDaysAgo = eightDaysAgoDate.toISOString();
  // Tomorrow
  const tomorrowDate = new Date();
  tomorrowDate.setDate(now.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString();
  // Yesterday
  const yesterdayDate = new Date();
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterday = yesterdayDate.toISOString();

  it('returns false if rx is null', () => {
    expect(isRefillTakingLongerThanExpected(null)).to.be.false;
  });

  it('returns true if both refillDate and refillSubmitDate are present and valid for refillinprocess', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: eightDaysAgo,
      refillSubmitDate: eightDaysAgo,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.true;
  });

  it('returns false if both refillDate and refillSubmitDate are not parsable', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: 'not-a-date',
      refillSubmitDate: 'not-a-date',
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if rxRfRecords is present but empty', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      rxRfRecords: [],
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if both refillDate and refillSubmitDate are empty strings', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: '',
      refillSubmitDate: '',
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if both refillDate and refillSubmitDate are null', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: null,
      refillSubmitDate: null,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if both refillDate and refillSubmitDate are undefined', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: undefined,
      refillSubmitDate: undefined,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if dispStatus is unexpected value', () => {
    const rx = {
      dispStatus: 'unknownstatus',
      refillDate: isoNow,
      refillSubmitDate: isoNow,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if rxRfRecords is not an array', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      rxRfRecords: null,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if rx is an empty object', () => {
    expect(isRefillTakingLongerThanExpected({})).to.be.false;
  });

  it('returns false if both dates are valid but dispStatus is submitted', () => {
    const rx = {
      dispStatus: dispStatusObj.submitted,
      refillDate: isoNow,
      refillSubmitDate: isoNow,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns true if refillDate is in the future and refillSubmitDate is in the past', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: tomorrow,
      refillSubmitDate: eightDaysAgo,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns true if refillDate is in the past and refillSubmitDate is in the past', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      refillDate: eightDaysAgo,
      refillSubmitDate: eightDaysAgo,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.true;
  });

  it('returns true if refillSubmitDate is more than 7 days ago and dispStatus is submitted', () => {
    const rx = {
      dispStatus: dispStatusObj.submitted,
      refillSubmitDate: eightDaysAgo,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.true;
  });

  it('returns false if refillSubmitDate is less than 7 days ago and dispStatus is submitted', () => {
    const rx = {
      dispStatus: dispStatusObj.submitted,
      refillSubmitDate: yesterday,
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if rxRfRecords[0] is an empty object', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      rxRfRecords: [{}],
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });
});
