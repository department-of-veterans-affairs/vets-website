import { startOfDay } from 'date-fns';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  isVersion1Data,
  getEligibleContestableIssues,
  showConferenceContact,
  showConferenceVeteranPage,
  showConferenceRepPages,
  checkNeedsFormDataUpdate,
  checkNeedsRedirect,
  onFormLoaded,
} from '../../utils/helpers';

import { parseDateWithOffset } from '../../../shared/utils/dates';

describe('getEligibleContestableIssues', () => {
  const date = startOfDay(new Date());

  const eligibleIssue = {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'Issue 2',
      description: '',
      approxDecisionDate: parseDateWithOffset({ months: -10 }, date),
    },
  };
  const ineligibleIssue = [
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Issue 1',
        description: '',
        approxDecisionDate: parseDateWithOffset({ years: -2 }, date),
      },
    },
  ];
  const disqualifyingIssues = [
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Issue 3',
        description: 'this is a deferred issue',
        approxDecisionDate: parseDateWithOffset({ months: -1 }, date),
      },
    },
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Issue 4',
        description: 'this issue needs apportionment',
        approxDecisionDate: parseDateWithOffset({ months: -3 }, date),
      },
    },
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'Issue 5',
        description: 'this issue has attorney fees',
        approxDecisionDate: parseDateWithOffset({ months: -5 }, date),
      },
    },
  ];

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
  it('should filter out disqualifying issues', () => {
    expect(
      getEligibleContestableIssues([
        ineligibleIssue,
        eligibleIssue,
        ...disqualifyingIssues,
      ]),
    ).to.deep.equal([eligibleIssue]);
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

describe('showConferenceContact', () => {
  const test = choice =>
    showConferenceContact({
      informalConferenceChoice: choice,
    });
  it('should return true', () => {
    expect(test('yes')).to.be.true;
  });
  it('should return false', () => {
    expect(test('y')).to.be.false;
    expect(test('no')).to.be.false;
  });
});

describe('showConferenceVeteranPage', () => {
  const test = (contact, choice) =>
    showConferenceVeteranPage({
      informalConference: contact,
      informalConferenceChoice: choice,
    });
  it('should return true', () => {
    expect(test('me', 'yes')).to.be.true;
  });
  it('should return false', () => {
    expect(test('me', 'no')).to.be.false;
    expect(test('rep', 'yes')).to.be.false;
    expect(test('yes', 'yes')).to.be.false;
  });
});

describe('showConferenceRepPages', () => {
  const test = (contact, choice) =>
    showConferenceRepPages({
      informalConference: contact,
      informalConferenceChoice: choice,
    });
  it('should return true', () => {
    expect(test('rep', 'yes')).to.be.true;
  });
  it('should return false', () => {
    expect(test('rep', 'no')).to.be.false;
    expect(test('me', 'yes')).to.be.false;
    expect(test('yes', 'yes')).to.be.false;
  });
});

describe('checkNeedsFormDataUpdate', () => {
  const test = (contact, choice) => {
    const formData = {
      informalConference: contact,
      informalConferenceChoice: choice,
    };
    checkNeedsFormDataUpdate({ formData });
    return {
      who: formData.informalConference,
      yN: formData.informalConferenceChoice,
    };
  };
  it('should not alter the data if already set', () => {
    expect(test('me', 'yes')).to.deep.equal({ yN: 'yes', who: 'me' });
    expect(test('rep', 'yes')).to.deep.equal({ yN: 'yes', who: 'rep' });
    expect(test('me', 'no')).to.deep.equal({ yN: 'no', who: 'me' });
    expect(test('rep', 'no')).to.deep.equal({ yN: 'no', who: 'rep' });
  });
  it('should alter the data', () => {
    expect(test('me')).to.deep.equal({ yN: 'yes', who: 'me' });
    expect(test('me', '')).to.deep.equal({ yN: 'yes', who: 'me' });
    expect(test('rep')).to.deep.equal({ yN: 'yes', who: 'rep' });
    expect(test('no')).to.deep.equal({ yN: 'no', who: 'no' });
  });
});

describe('checkNeedsRedirect', () => {
  const routes = [
    {},
    {
      path: 'introduction',
      // shortened pageList
      pageList: [
        { path: '/introduction' },
        { path: '/veteran-information' },
        { path: '/homeless' },
        { path: '/authorization' },
        { path: '/issue-summary' },
        { path: '/review-and-submit' },
      ],
    },
  ];
  const props = ({ returnUrl = '/homeless', routerSpy = () => {} }) => ({
    formData: {},
    returnUrl,
    router: { push: routerSpy },
    routes,
  });

  describe('Redirect from opt-in page', () => {
    it('should not redirect', () => {
      const routerSpy = sinon.spy();
      checkNeedsRedirect(props({ routerSpy }));
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/homeless');
    });
    it('should redirect, with an invalid returnUrl', () => {
      const routerSpy = sinon.spy();
      checkNeedsRedirect(props({ routerSpy, returnUrl: '/test' }));
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/veteran-information');
    });
    it('should redirect from opt-in', () => {
      const routerSpy = sinon.spy();
      checkNeedsRedirect(props({ routerSpy, returnUrl: '/opt-in' }));
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/authorization');
    });
  });

  describe('onFormLoaded', () => {
    it('should redirect', () => {
      const routerSpy = sinon.spy();
      const formData = {
        informalConference: 'me',
        informalConferenceChoice: 'yes',
      };
      onFormLoaded(props({ routerSpy, formData }));
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/homeless');
    });
  });
});
