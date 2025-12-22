import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import IntroductionPage from '../../containers/IntroductionPage';
import formConfig from '../../config/form';

const getData = ({
  loggedIn = true,
  isVerified = true,
  data = {},
  contestedIssues = {},
  featureToggles = {},
} = {}) => ({
  props: {
    loggedIn,
    location: {
      basename: '/sc-base-url',
    },
    route: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
    },
  },
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          userFullName: { last: 'last' },
          dob: '2000-01-01',
          claims: { appeals: true },
          savedForms: [],
          prefillsAvailable: [],
          verified: isVerified,
          signIn: { serviceName: 'idme' },
        },
      },
      form: {
        formId: formConfig.formId,
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
        data,
        contestedIssues,
      },
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: { get() {} },
        dismissedDowntimeWarnings: [],
      },
      featureToggles,
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('IntroductionPage', () => {
  it('should render', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h1', container).textContent).to.eq('Request a Board Appeal');
    expect($('va-process-list', container)).to.exist;
    expect($('va-omb-info', container)).to.exist;
    expect($('va-alert-sign-in[variant="signInRequired"]', container)).to.exist;
  });

  it('should render start action links', () => {
    const { props, mockStore } = getData();
    const { getAllByRole } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const actionLinks = getAllByRole('link');
    const expectedText = 'Start the Board Appeal request';

    expect(actionLinks[0].textContent).to.eq(expectedText);
    expect(actionLinks[1].textContent).to.eq(expectedText);
  });

  it('should render verify identity alert', () => {
    const { props, mockStore } = getData({ isVerified: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect($('.schemaform-sip-alert', container)).to.not.exist;
    expect($('va-alert-sign-in[variant="verifyIdMe"]', container)).to.exist;
  });

  describe('OMB info with feature flag', () => {
    it('should display new expiration date when feature flag is enabled', () => {
      const { props, mockStore } = getData({
        featureToggles: {
          // eslint-disable-next-line camelcase
          decision_review_nod_feb2025_pdf_enabled: true,
        },
      });
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );

      const ombInfo = $('va-omb-info', container);
      expect(ombInfo).to.exist;
      expect(ombInfo.getAttribute('exp-date')).to.equal('4/30/2028');
      expect(ombInfo.getAttribute('omb-number')).to.equal('2900-0674');
      expect(ombInfo.getAttribute('res-burden')).to.equal('30');
    });

    it('should display old expiration date when feature flag is disabled', () => {
      const { props, mockStore } = getData({
        featureToggles: {
          // eslint-disable-next-line camelcase
          decision_review_nod_feb2025_pdf_enabled: false,
        },
      });
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );

      const ombInfo = $('va-omb-info', container);
      expect(ombInfo).to.exist;
      expect(ombInfo.getAttribute('exp-date')).to.equal('2/28/2022');
      expect(ombInfo.getAttribute('omb-number')).to.equal('2900-0674');
      expect(ombInfo.getAttribute('res-burden')).to.equal('30');
    });

    it('should default to old expiration date when feature flag is not set', () => {
      const { props, mockStore } = getData({
        featureToggles: {},
      });
      const { container } = render(
        <Provider store={mockStore}>
          <IntroductionPage {...props} />
        </Provider>,
      );

      const ombInfo = $('va-omb-info', container);
      expect(ombInfo).to.exist;
      expect(ombInfo.getAttribute('exp-date')).to.equal('2/28/2022');
      expect(ombInfo.getAttribute('omb-number')).to.equal('2900-0674');
      expect(ombInfo.getAttribute('res-burden')).to.equal('30');
    });
  });
});
