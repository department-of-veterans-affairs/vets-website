import { startOfDay } from 'date-fns';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  getEligibleContestableIssues,
  mayHaveLegacyAppeals,
  isVersion1Data,
  showNewHlrContent,
  hideNewHlrContent,
  showConferenceContact,
  showConferenceVeteranPage,
  showConferenceRepPages,
  checkNeedsRedirect,
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
  const deferredIssue = {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'Issue 2',
      description: 'this is a deferred issue',
      approxDecisionDate: parseDateWithOffset({ months: -1 }, date),
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

describe('showNewHlrContent', () => {
  const test = toggle => showNewHlrContent({ hlrUpdatedContent: toggle });
  it('should return true', () => {
    expect(test(true)).to.be.true;
    expect(test('string')).to.be.true;
  });
  it('should return false', () => {
    expect(test(false)).to.be.false;
    expect(test(null)).to.be.false;
    expect(test(undefined)).to.be.false;
    expect(test('')).to.be.false;
  });
});

describe('hideNewHlrContent', () => {
  const test = toggle => hideNewHlrContent({ hlrUpdatedContent: toggle });
  it('should return true', () => {
    expect(test(false)).to.be.true;
    expect(test(undefined)).to.be.true;
    expect(test('')).to.be.true;
  });
  it('should return false', () => {
    expect(test(true)).to.be.false;
    expect(test('nope')).to.be.false;
  });
});

describe('showConferenceContact', () => {
  const test = (toggle, choice) =>
    showConferenceContact({
      hlrUpdatedContent: toggle,
      informalConferenceChoice: choice,
    });
  it('should return true', () => {
    expect(test(true, 'yes')).to.be.true;
  });
  it('should return false', () => {
    expect(test(false, 'yes')).to.be.false;
    expect(test(true, 'y')).to.be.false;
    expect(test(true, 'no')).to.be.false;
  });
});

describe('showConferenceVeteranPage', () => {
  const test = (toggle, contact, choice) =>
    showConferenceVeteranPage({
      hlrUpdatedContent: toggle,
      informalConference: contact,
      informalConferenceChoice: choice,
    });
  it('should return true', () => {
    expect(test(true, 'me', 'yes')).to.be.true;
    expect(test(false, 'me')).to.be.true;
    expect(test(false, 'me', '')).to.be.true;
  });
  it('should return false', () => {
    expect(test(true, 'me', 'no')).to.be.false;
    expect(test(true, 'rep', 'yes')).to.be.false;
    expect(test(true, 'yes', 'yes')).to.be.false;
    expect(test(false, '')).to.be.false;
    expect(test(false, 'rep', '')).to.be.false;
    expect(test(false, 'rep', 'no')).to.be.false;
  });
});

describe('showConferenceRepPages', () => {
  const test = (toggle, contact, choice) =>
    showConferenceRepPages({
      hlrUpdatedContent: toggle,
      informalConference: contact,
      informalConferenceChoice: choice,
    });
  it('should return true', () => {
    expect(test(true, 'rep', 'yes')).to.be.true;
    expect(test(false, 'rep')).to.be.true;
    expect(test(false, 'rep', '')).to.be.true;
  });
  it('should return false', () => {
    expect(test(true, 'rep', 'no')).to.be.false;
    expect(test(true, 'me', 'yes')).to.be.false;
    expect(test(true, 'yes', 'yes')).to.be.false;
    expect(test(false, '')).to.be.false;
    expect(test(false, 'me', '')).to.be.false;
    expect(test(false, 'me', 'no')).to.be.false;
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
        { path: '/opt-in' },
        { path: '/authorization' },
        { path: '/issue-summary' },
        { path: '/review-and-submit' },
      ],
    },
  ];
  const props = ({
    toggle = true,
    returnUrl = '/homeless',
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
      checkNeedsRedirect(props({ routerSpy }));
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/homeless');
    });
    it('should redirect with toggle enabled, with an invalid returnUrl', () => {
      const routerSpy = sinon.spy();
      checkNeedsRedirect(props({ routerSpy, returnUrl: '/test' }));
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/veteran-information');
    });
    it('should redirect from opt-in with toggle enabled', () => {
      const routerSpy = sinon.spy();
      checkNeedsRedirect(props({ routerSpy, returnUrl: '/opt-in' }));
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/authorization');
    });
  });

  describe('toggle disabled', () => {
    it('should not redirect with toggle disabled', () => {
      const routerSpy = sinon.spy();
      checkNeedsRedirect(props({ toggle: false, routerSpy }));
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/homeless');
    });
    it('should redirect with toggle disabled, with an invalid returnUrl', () => {
      const routerSpy = sinon.spy();
      checkNeedsRedirect(
        props({ toggle: false, routerSpy, returnUrl: '/test' }),
      );
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/veteran-information');
    });
    it('should redirect from authorization with toggle disabled', () => {
      const routerSpy = sinon.spy();
      checkNeedsRedirect(
        props({ toggle: false, routerSpy, returnUrl: '/authorization' }),
      );
      expect(routerSpy.called).to.be.true;
      expect(routerSpy.args[0][0]).to.eq('/opt-in');
    });
  });
});
