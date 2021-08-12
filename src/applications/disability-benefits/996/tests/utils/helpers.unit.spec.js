import moment from 'moment';
import { expect } from 'chai';

import { getDate } from '../../utils/dates';

import {
  getEligibleContestableIssues,
  apiVersion1,
  apiVersion2,
  isVersion1Data,
} from '../../utils/helpers';

describe('getEligibleContestableIssues', () => {
  const date = moment().startOf('day');

  const eligibleIssue = {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'Issue 2',
      description: '',
      approxDecisionDate: getDate({ date, offset: { months: -10 } }),
    },
  };
  const ineligibleIssue = [
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Issue 1',
        description: '',
        approxDecisionDate: getDate({ date, offset: { years: -2 } }),
      },
    },
  ];
  const deferredIssue = {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'Issue 2',
      description: 'this is a deferred issue',
      approxDecisionDate: getDate({ date, offset: { months: -1 } }),
    },
  };

  it('should return empty array', () => {
    expect(getEligibleContestableIssues()).to.have.lengthOf(0);
    expect(getEligibleContestableIssues([])).to.have.lengthOf(0);
    expect(getEligibleContestableIssues([{}])).to.have.lengthOf(0);
  });
  it('should filter out dates more than one year in the past', () => {
    expect(
      getEligibleContestableIssues([ineligibleIssue, eligibleIssue]),
    ).to.deep.equal([eligibleIssue]);
  });
  it('should filter out dates more than one year in the past', () => {
    expect(
      getEligibleContestableIssues([eligibleIssue, ineligibleIssue]),
    ).to.deep.equal([eligibleIssue]);
  });
  it('should filter out deferred issues', () => {
    expect(
      getEligibleContestableIssues([
        eligibleIssue,
        deferredIssue,
        ineligibleIssue,
      ]),
    ).to.deep.equal([eligibleIssue]);
  });
});

describe('apiVersion1', () => {
  it('should return true when feature flag is not set', () => {
    expect(apiVersion1()).to.be.true;
    expect(apiVersion1({ hlrV2: false })).to.be.true;
  });
  it('should return false when feature flag is set', () => {
    expect(apiVersion1({ hlrV2: true })).to.be.false;
  });
});

describe('apiVersion2', () => {
  it('should return undefined/false when feature flag is not set', () => {
    expect(apiVersion2()).to.be.undefined;
    expect(apiVersion2({ hlrV2: false })).to.be.false;
  });
  it('should return true when feature flag is set', () => {
    expect(apiVersion2({ hlrV2: true })).to.be.true;
  });
});

describe('isVersion1Data', () => {
  it('should return true when version 1 data is found', () => {
    expect(isVersion1Data({ zipCode5: '12345' })).to.be.true;
  });
  it('should return false when feature flag is not set', () => {
    expect(isVersion1Data()).to.be.false;
    expect(isVersion1Data({ zipCode5: '' })).to.be.false;
  });
});
