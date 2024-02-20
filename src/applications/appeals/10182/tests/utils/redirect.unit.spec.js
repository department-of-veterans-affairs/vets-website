import { expect } from 'chai';
import sinon from 'sinon';

import { checkRedirect, onFormLoaded } from '../../utils/redirect';
import { SHOW_PART3, SHOW_PART3_REDIRECT } from '../../constants';

const pagesBeforePart3 = [
  '/veteran-details',
  '/homeless',
  '/contact-information', // don't need to include edit pages, because they don't have a SIP link.
  '/filing-deadlines',
];

const pagesAfter = ['/contestable-issues', '/review-and-submit'];
const redirectPage = '/extension-request';

describe('checkRedirect', () => {
  it('should return false for pages before part 3 questions', () => {
    expect(checkRedirect(pagesBeforePart3[0])).to.be.false;
    expect(checkRedirect(pagesBeforePart3[1])).to.be.false;
    expect(checkRedirect(pagesBeforePart3[2])).to.be.false;
    expect(checkRedirect(pagesBeforePart3[3])).to.be.false;
  });
  it('should return true for pages not before part 3 questions', () => {
    expect(checkRedirect(pagesAfter[0])).to.be.true;
    expect(checkRedirect(pagesAfter[1])).to.be.true;
  });
});

describe('onFormLoaded', () => {
  const getProps = ({
    showPart3 = true,
    redirect = 'not-needed',
    returnUrl,
    startOver = false,
    pushSpy = () => {},
  }) => ({
    formData: {
      [SHOW_PART3]: showPart3,
      [SHOW_PART3_REDIRECT]: redirect,
    },
    returnUrl,
    isStartingOver: startOver,
    routes: [
      {
        pageList: [
          {
            pageKey: 'vetInfo',
            path: pagesBeforePart3[0],
          },
          {
            pageKey: 'homeless',
            path: pagesBeforePart3[1],
          },
          {
            pageKey: 'contactInfo',
            path: pagesBeforePart3[2],
          },
          {
            pageKey: 'deadlines',
            path: pagesBeforePart3[3],
          },
          {
            pageKey: 'extension request',
            path: showPart3 ? redirectPage : '/hidden',
          },
          {
            pageKey: 'contestable issues',
            path: pagesAfter[0],
          },
          {
            pageKey: 'other',
            path: pagesAfter[1],
          },
        ],
      },
    ],
    router: {
      push: pushSpy,
    },
  });

  describe('redirect not-needed flag', () => {
    it('should not redirect from contact info page if showPart3 is true', () => {
      const pushSpy = sinon.spy();
      const props = getProps({ pushSpy, returnUrl: pagesBeforePart3[2] });
      onFormLoaded(props);
      expect(pushSpy.args[0][0]).to.eq(pagesBeforePart3[2]);
    });
    it('should not redirect from deadlines page if showPart3 is false', () => {
      const pushSpy = sinon.spy();
      const props = getProps({
        pushSpy,
        showPart3: false,
        returnUrl: pagesBeforePart3[3],
      });
      onFormLoaded(props);
      expect(pushSpy.args[0][0]).to.eq(pagesBeforePart3[3]);
    });
    it('should not redirect from contestable issues page if showPart3 is true', () => {
      const pushSpy = sinon.spy();
      const props = getProps({ pushSpy, returnUrl: pagesAfter[0] });
      onFormLoaded(props);
      expect(pushSpy.args[0][0]).to.eq(pagesAfter[0]);
    });
    it('should redirect to vet info page when return URL is invalid & showPart3 is true', () => {
      const pushSpy = sinon.spy();
      const props = getProps({ pushSpy, returnUrl: '/blah' });
      onFormLoaded(props);
      expect(pushSpy.args[0][0]).to.eq(pagesBeforePart3[0]);
    });
    it('should not redirect if showPart3 is true & starting over', () => {
      const pushSpy = sinon.spy();
      const props = getProps({
        pushSpy,
        redirect: 'redirected',
        returnUrl: pagesBeforePart3[0],
        startOver: true,
      });
      onFormLoaded(props);
      expect(pushSpy.args[0][0]).to.eq(pagesBeforePart3[0]);
    });
  });

  describe('redirect flag set', () => {
    it('should not redirect from contestable issues page if showPart3 is false', () => {
      const pushSpy = sinon.spy();
      const props = getProps({
        pushSpy,
        showPart3: false,
        redirect: 'redirected',
        returnUrl: pagesAfter[0],
      });
      onFormLoaded(props);
      expect(pushSpy.args[0][0]).to.eq(pagesAfter[0]);
    });
    it('should redirect from contestable issues page if showPart3 is true', () => {
      const pushSpy = sinon.spy();
      const props = getProps({
        pushSpy,
        redirect: 'redirected',
        returnUrl: pagesAfter[0],
      });
      onFormLoaded(props);
      expect(pushSpy.args[0][0]).to.eq(redirectPage);
    });
    it('should redirect from review & submit page if showPart3 is true', () => {
      const pushSpy = sinon.spy();
      const props = getProps({
        pushSpy,
        redirect: 'redirected',
        returnUrl: pagesAfter[1],
      });
      onFormLoaded(props);
      expect(pushSpy.args[0][0]).to.eq(redirectPage);
    });
    it('should redirect to vet-info page when showPart3 is false', () => {
      const pushSpy = sinon.spy();
      const props = getProps({
        pushSpy,
        showPart3: false,
        redirect: 'redirected',
        returnUrl: redirectPage,
      });
      onFormLoaded(props);
      expect(pushSpy.args[0][0]).to.eq(pagesBeforePart3[0]);
    });
  });
});
