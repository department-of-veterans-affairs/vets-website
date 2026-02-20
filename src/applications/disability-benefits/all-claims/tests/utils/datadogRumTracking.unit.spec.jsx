import { expect } from 'chai';
import sinon from 'sinon';
import * as datadogBrowserRum from '@datadog/browser-rum';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import {
  trackBackButtonClick,
  trackContinueButtonClick,
  trackFormStarted,
  trackFormResumption,
  trackSideNavChapterClick,
  trackFormSubmitted,
  trackMobileAccordionClick,
} from '../../utils/tracking/datadogRumTracking';
import {
  TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS,
  TRACKING_526EZ_SIDENAV_CONTINUE_BUTTON_CLICKS,
  TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE,
  TRACKING_526EZ_SIDENAV_CLICKS,
} from '../../constants';

describe('datadogRumTracking', () => {
  let addActionStub;
  let consoleLogStub;

  beforeEach(() => {
    addActionStub = sinon.stub(datadogBrowserRum.datadogRum, 'addAction');
    consoleLogStub = sinon.stub(console, 'log');
    sessionStorage.clear();
  });

  afterEach(() => {
    addActionStub.restore();
    consoleLogStub.restore();
  });

  describe('trackBackButtonClick', () => {
    it('tracks back button clicks and increments the counter', () => {
      sessionStorage.setItem(TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE, 'true');

      trackBackButtonClick();

      expect(
        sessionStorage.getItem(TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS),
      ).to.equal('1');
      expect(addActionStub.calledOnce).to.be.true;

      const [actionName, properties] = addActionStub.firstCall.args;
      expect(actionName).to.equal('Form navigation - Back button clicked');
      expect(properties).to.include({
        formId: VA_FORM_IDS.FORM_21_526EZ,
        clickCount: 1,
        sidenav526ezEnabled: true,
      });
      expect(properties.sourcePath).to.be.a('string');
    });

    it('increments counter on multiple clicks', () => {
      sessionStorage.setItem(TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE, 'true');

      trackBackButtonClick();
      trackBackButtonClick();
      trackBackButtonClick();

      expect(
        sessionStorage.getItem(TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS),
      ).to.equal('3');
      expect(addActionStub.callCount).to.equal(3);

      const thirdCallProps = addActionStub.thirdCall.args[1];
      expect(thirdCallProps.clickCount).to.equal(3);
    });

    it('works when sidenav toggle is not set', () => {
      trackBackButtonClick();

      expect(addActionStub.calledOnce).to.be.true;
      const [, properties] = addActionStub.firstCall.args;
      expect(properties).to.not.have.property('sidenav526ezEnabled');
    });

    it('does not throw when sessionStorage is blocked', () => {
      const setItemStub = sinon
        .stub(Storage.prototype, 'setItem')
        .throws(new Error('QuotaExceededError'));
      const getItemStub = sinon
        .stub(Storage.prototype, 'getItem')
        .throws(new Error('SecurityError'));

      try {
        expect(() => trackBackButtonClick()).to.not.throw();
      } finally {
        setItemStub.restore();
        getItemStub.restore();
      }
    });
  });

  describe('trackContinueButtonClick', () => {
    it('tracks continue button clicks and increments the counter', () => {
      sessionStorage.setItem(TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE, 'false');

      trackContinueButtonClick();

      expect(
        sessionStorage.getItem(TRACKING_526EZ_SIDENAV_CONTINUE_BUTTON_CLICKS),
      ).to.equal('1');
      expect(addActionStub.calledOnce).to.be.true;

      const [actionName, properties] = addActionStub.firstCall.args;
      expect(actionName).to.equal('Form navigation - Continue button clicked');
      expect(properties).to.include({
        formId: VA_FORM_IDS.FORM_21_526EZ,
        clickCount: 1,
        sidenav526ezEnabled: false,
      });
      expect(properties.sourcePath).to.be.a('string');
    });

    it('increments counter on multiple clicks', () => {
      trackContinueButtonClick();
      trackContinueButtonClick();

      expect(
        sessionStorage.getItem(TRACKING_526EZ_SIDENAV_CONTINUE_BUTTON_CLICKS),
      ).to.equal('2');

      const secondCallProps = addActionStub.secondCall.args[1];
      expect(secondCallProps.clickCount).to.equal(2);
    });
  });

  describe('trackFormStarted', () => {
    it('tracks when form is started from introduction page', () => {
      sessionStorage.setItem(TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE, 'true');

      trackFormStarted();

      expect(addActionStub.calledOnce).to.be.true;

      const [actionName, properties] = addActionStub.firstCall.args;
      expect(actionName).to.equal(
        'Form started - User began form from introduction page',
      );
      expect(properties).to.include({
        formId: VA_FORM_IDS.FORM_21_526EZ,
        sidenav526ezEnabled: true,
      });
      expect(properties.sourcePath).to.be.a('string');
    });

    it('does not throw when datadogRum.addAction fails', () => {
      addActionStub.restore();
      addActionStub = sinon
        .stub(datadogBrowserRum.datadogRum, 'addAction')
        .throws(new Error('fail'));

      expect(() => trackFormStarted()).to.not.throw();
    });
  });

  describe('trackFormResumption', () => {
    it('tracks when form is resumed', () => {
      sessionStorage.setItem(TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE, 'true');

      trackFormResumption();

      expect(addActionStub.calledOnce).to.be.true;

      const [actionName, properties] = addActionStub.firstCall.args;
      expect(actionName).to.equal('Form resumption - Saved form loaded');
      expect(properties).to.include({
        formId: VA_FORM_IDS.FORM_21_526EZ,
        sidenav526ezEnabled: true,
      });
      expect(properties.returnUrl).to.be.a('string');
    });

    it('works without sidenav toggle set', () => {
      trackFormResumption();

      const [, properties] = addActionStub.firstCall.args;
      expect(properties).to.not.have.property('sidenav526ezEnabled');
    });
  });

  describe('trackSideNavChapterClick', () => {
    it('tracks side nav chapter clicks', () => {
      const pageData = {
        label: 'Veteran details',
        key: 'veteran-info',
        path: '/veteran-information',
      };
      const pathname = '/disabilities/conditions';

      trackSideNavChapterClick({ pageData, pathname });

      expect(addActionStub.calledOnce).to.be.true;
      expect(sessionStorage.getItem(TRACKING_526EZ_SIDENAV_CLICKS)).to.equal(
        '1',
      );

      const [actionName, properties] = addActionStub.firstCall.args;
      expect(actionName).to.equal('Side navigation - Chapter clicked');
      expect(properties).to.deep.include({
        formId: VA_FORM_IDS.FORM_21_526EZ,
        chapterTitle: 'Veteran details',
        sourcePath: '/disabilities/conditions',
        sideNavClickCount: 1,
      });
    });

    it('increments click counter across multiple chapter clicks', () => {
      const pageData1 = { label: 'Chapter 1' };
      const pageData2 = { label: 'Chapter 2' };
      const pathname = '/test-path';

      trackSideNavChapterClick({ pageData: pageData1, pathname });
      trackSideNavChapterClick({ pageData: pageData2, pathname });

      expect(sessionStorage.getItem(TRACKING_526EZ_SIDENAV_CLICKS)).to.equal(
        '2',
      );

      const secondCallProps = addActionStub.secondCall.args[1];
      expect(secondCallProps.sideNavClickCount).to.equal(2);
      expect(secondCallProps.chapterTitle).to.equal('Chapter 2');
    });
  });

  describe('trackFormSubmitted', () => {
    it('tracks form submission', () => {
      sessionStorage.setItem(TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE, 'true');

      trackFormSubmitted();

      expect(addActionStub.calledOnce).to.be.true;

      const [actionName, properties] = addActionStub.firstCall.args;
      expect(actionName).to.equal('Form submission - Submit button clicked');
      expect(properties).to.include({
        formId: VA_FORM_IDS.FORM_21_526EZ,
        sidenav526ezEnabled: true,
      });
      expect(properties.sourcePath).to.be.a('string');
    });

    it('works without sidenav toggle', () => {
      trackFormSubmitted();

      const [, properties] = addActionStub.firstCall.args;
      expect(properties).to.not.have.property('sidenav526ezEnabled');
    });
  });

  describe('trackMobileAccordionClick', () => {
    it('tracks mobile accordion expand', () => {
      const params = {
        pathname: '/veteran-information',
        state: 'expanded',
        accordionTitle: 'Form steps',
      };

      trackMobileAccordionClick(params);

      expect(addActionStub.calledOnce).to.be.true;
      expect(sessionStorage.getItem(TRACKING_526EZ_SIDENAV_CLICKS)).to.equal(
        '1',
      );

      const [actionName, properties] = addActionStub.firstCall.args;
      expect(actionName).to.equal('Side navigation - Mobile accordion clicked');
      expect(properties).to.deep.include({
        formId: VA_FORM_IDS.FORM_21_526EZ,
        state: 'expanded',
        accordionTitle: 'Form steps',
        sourcePath: '/veteran-information',
        sideNavClickCount: 1,
      });
    });

    it('tracks mobile accordion collapse', () => {
      const params = {
        pathname: '/disabilities/conditions',
        state: 'collapsed',
        accordionTitle: 'Form steps',
      };

      trackMobileAccordionClick(params);

      const [, properties] = addActionStub.firstCall.args;
      expect(properties.state).to.equal('collapsed');
    });

    it('shares click counter with chapter clicks', () => {
      const pageData = { label: 'Test Chapter' };
      const pathname = '/test';

      trackSideNavChapterClick({ pageData, pathname });
      trackMobileAccordionClick({
        pathname,
        state: 'expanded',
        accordionTitle: 'Steps',
      });

      expect(sessionStorage.getItem(TRACKING_526EZ_SIDENAV_CLICKS)).to.equal(
        '2',
      );

      const secondCallProps = addActionStub.secondCall.args[1];
      expect(secondCallProps.sideNavClickCount).to.equal(2);
    });
  });

  describe('error handling', () => {
    it('continues silently when tracking fails', () => {
      addActionStub.restore();
      addActionStub = sinon
        .stub(datadogBrowserRum.datadogRum, 'addAction')
        .throws(new Error('Tracking service unavailable'));

      expect(() => trackBackButtonClick()).to.not.throw();
      expect(() => trackContinueButtonClick()).to.not.throw();
      expect(() => trackFormStarted()).to.not.throw();
      expect(() => trackFormResumption()).to.not.throw();
      expect(() => trackFormSubmitted()).to.not.throw();
      expect(() =>
        trackSideNavChapterClick({
          pageData: { label: 'Test' },
          pathname: '/test',
        }),
      ).to.not.throw();
      expect(() =>
        trackMobileAccordionClick({
          pathname: '/test',
          state: 'expanded',
          accordionTitle: 'Test',
        }),
      ).to.not.throw();
    });
  });
});
