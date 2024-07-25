import { startOfDay } from 'date-fns';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  getEligibleContestableIssues,
  mayHaveLegacyAppeals,
  isVersion1Data,
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

describe('mayHaveLegacyAppeals', () => {
  it('should return false if there is no data', () => {
    expect(mayHaveLegacyAppeals()).to.be.false;
  });
  it('should return false if there is no legacy & no additional issues', () => {
    expect(mayHaveLegacyAppeals({ legacyCount: 0, additionalIssues: [] })).to.be
      .false;
  });
  it('should return true if there are some legacy issues & no additional issues', () => {
    expect(mayHaveLegacyAppeals({ legacyCount: 1, additionalIssues: [] })).to.be
      .true;
  });
  it('should return true if there is no legacy & some additional issues', () => {
    expect(mayHaveLegacyAppeals({ legacyCount: 0, additionalIssues: [{}] })).to
      .be.true;
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

describe('onFormLoaded', () => {
  const routes = [
    {},
    {
      path: 'introduction',
      // shortened pageList
      pageList: [
        { path: '/introduction' },
        { path: '/veteran-information' },
        { path: '/homeless' },
        { path: '/opt-in' },
        { path: '/authorization' },
        { path: '/issue-summary' },
        { path: '/review-and-submit' },
      ],
    },
  ];
  const props = ({
    toggle = true,
    returnUrl = '/test',
    routerSpy = () => {},
  }) => ({
    formData: { hlrUpdatedContent: toggle },
    returnUrl,
    router: { push: routerSpy },
    routes,
  });

  describe('toggle enabled', () => {
    it('should not redirect with toggle enabled', () => {
      const routerSpy = sinon.spy();
      onFormLoaded(props({ routerSpy }));
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/veteran-information');
    });
    it('should redirect from opt-in with toggle enabled', () => {
      const routerSpy = sinon.spy();
      onFormLoaded(props({ routerSpy, returnUrl: '/opt-in' }));
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/authorization');
    });
  });

  describe('toggle disabled', () => {
    it('should not redirect with toggle enabled', () => {
      const routerSpy = sinon.spy();
      onFormLoaded(props({ toggle: false, routerSpy }));
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/veteran-information');
    });
    it('should redirect from authorization with toggle disabled', () => {
      const routerSpy = sinon.spy();
      onFormLoaded(
        props({ toggle: false, routerSpy, returnUrl: '/authorization' }),
      );
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/opt-in');
    });
  });
});
