// Node modules.
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
// Relative imports.
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';
import sessionStorage from '~/platform/utilities/storage/sessionStorage';
import { CTA_WIDGET_TYPES, ctaWidgetsLookup } from '../ctaWidgets';
import { CallToActionWidget } from '../index';

const defaultOptions = {
  profile: {
    loading: false,
    verified: false,
    multifactor: false,
  },
  mhvAccount: {
    loading: false,
  },
  mviStatus: {},
};

const getData = ({
  profile = {},
  mhvAccount = {},
  mviStatus = {},
  featureToggles = {},
} = {}) => ({
  props: {
    profile: {
      ...defaultOptions.profile,
      ...profile,
    },
    mhvAccount: {
      ...defaultOptions.mhvAccount,
      ...mhvAccount,
    },
    mviStatus: {
      ...defaultOptions.mviStatus,
      ...mviStatus,
    },
    fetchMHVAccount: sinon.spy(),
  },
  mockStore: {
    getState: () => ({
      featureToggles: {
        loading: false,
        ...featureToggles,
      },
      user: {
        profile: {
          ...defaultOptions.profile,
          ...profile,
        },
        mhvAccount: {
          ...defaultOptions.mhvAccount,
          ...mhvAccount,
        },
        mviStatus: {
          ...defaultOptions.mviStatus,
          ...mviStatus,
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('<CallToActionWidget>', () => {
  it('should show loading state', () => {
    const tree = mount(
      <CallToActionWidget
        profile={{
          loading: true,
          verified: false,
          multifactor: false,
        }}
        mhvAccount={{
          loading: false,
        }}
        mviStatus={{}}
        featureToggles={{
          loading: false,
        }}
      />,
    );

    expect(tree.find('va-loading-indicator').exists()).to.be.true;
    tree.unmount();
  });
  it('should show loading state when loading feature toggles', () => {
    const tree = mount(
      <CallToActionWidget
        profile={{
          loading: false,
          verified: false,
          multifactor: false,
        }}
        mhvAccount={{
          loading: false,
        }}
        mviStatus={{}}
        featureToggles={{
          loading: true,
        }}
      />,
    );

    expect(tree.find('va-loading-indicator').exists()).to.be.true;
    tree.unmount();
  });
  it('should show sign in state', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <CallToActionWidget {...props} featureToggles={{ loading: false }} />
      </Provider>,
    );

    const vaAlertSignIn = $('va-alert-sign-in', container);
    const signInButton = $('va-button', container);

    expect(vaAlertSignIn).to.exist;
    expect(signInButton).to.exist;
    expect(signInButton.getAttribute('text')).to.eql(
      'Sign in or create an account',
    );
    expect(vaAlertSignIn.getAttribute('heading-level')).to.eql('3');
    expect(vaAlertSignIn.getAttribute('variant')).to.eql('signInRequired');
  });

  it('should show direct deposit sign in state', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <CallToActionWidget
          {...props}
          featureToggles={{ loading: false }}
          appId={CTA_WIDGET_TYPES.DIRECT_DEPOSIT}
        />
      </Provider>,
    );
    const vaAlertSignIn = $('va-alert-sign-in', container);
    const signInButton = $('va-button', container);

    expect(vaAlertSignIn).to.exist;
    expect(signInButton).to.exist;
    expect(signInButton.getAttribute('text')).to.eql(
      'Sign in or create an account',
    );
    expect(vaAlertSignIn.getAttribute('heading-level')).to.eql('3');
    expect(vaAlertSignIn.getAttribute('variant')).to.eql('signInRequired');

    const authReturnUrl = sessionStorage.getItem('authReturnUrl');
    const derivedUrl = ctaWidgetsLookup[
      CTA_WIDGET_TYPES.DIRECT_DEPOSIT
    ].deriveToolUrlDetails()?.url;
    expect(authReturnUrl.includes(derivedUrl)).to.be.true;
    sessionStorage.clear();
  });

  it('should show the ChangeAddress cta', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <CallToActionWidget
          {...props}
          isLoggedIn
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          featureToggles={{ loading: false }}
          appId={CTA_WIDGET_TYPES.CHANGE_ADDRESS}
        />
      </Provider>,
    );
    const vaAlertSignIn = $('va-alert-sign-in', container);
    const signInButton = $('va-button', container);

    expect(vaAlertSignIn).to.exist;
    expect(signInButton).to.exist;
    expect(signInButton.getAttribute('text')).to.eql(
      'Sign in or create an account',
    );
    expect(vaAlertSignIn.getAttribute('heading-level')).to.eql('3');
    expect(vaAlertSignIn.getAttribute('variant')).to.eql('signInRequired');
  });

  it('should show verify link', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <CallToActionWidget
          appId="test"
          {...props}
          isLoggedIn
          featureToggles={{ loading: false }}
          serviceName={CSP_IDS.ID_ME}
        />
      </Provider>,
    );

    const vaAlertSignIn = $('va-alert-sign-in', container);

    expect(vaAlertSignIn).to.exist;
    expect($('.idme-verify-button', container)).to.exist;
    expect($('.logingov-verify-button', container)).to.not.exist;
    expect(vaAlertSignIn.getAttribute('variant')).to.eql('verifyIdMe');
  });

  it('should show link and description', () => {
    const tree = mount(
      <CallToActionWidget
        appId={CTA_WIDGET_TYPES.CLAIMS_AND_APPEALS}
        isLoggedIn
        profile={{
          loading: false,
          verified: true,
          multifactor: false,
        }}
        mhvAccount={{
          loading: false,
        }}
        mviStatus={{}}
        featureToggles={{
          loading: false,
        }}
      />,
    );
    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(tree.find('SignIn').exists()).to.be.false;
    expect(tree.find('Verify').exists()).to.be.false;
    expect(tree.find('a').props().href).to.contain('track-claims');
    expect(tree.find('a').props().target).to.equal('_self');
    expect(tree.find('a').text()).to.contain(
      'claim, decision review, or appeal status',
    );
    tree.unmount();
  });

  it('should handle prop changes correctly', () => {
    const { props, mockStore } = getData();
    const { container, rerender } = render(
      <Provider store={mockStore}>
        <CallToActionWidget
          {...props}
          featureToggles={{ loading: true }}
          profile={{ loading: true }}
          appId={CTA_WIDGET_TYPES.COMBINED_DEBT_PORTAL}
        />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.exist;
    rerender(
      <Provider store={mockStore}>
        <CallToActionWidget
          {...props}
          featureToggles={{ loading: true }}
          profile={{ loading: true }}
          appId={CTA_WIDGET_TYPES.DIRECT_DEPOSIT}
        />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.exist;
    rerender(
      <Provider store={mockStore}>
        <CallToActionWidget
          {...props}
          isLoggedIn
          featureToggles={{ loading: false }}
          appId={CTA_WIDGET_TYPES.DIRECT_DEPOSIT}
        />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.not.exist;
    rerender(
      <Provider store={mockStore}>
        <CallToActionWidget
          {...props}
          isLoggedIn
          featureToggles={{ loading: false }}
          profile={{ verified: true }}
          appId={CTA_WIDGET_TYPES.COMBINED_DEBT_PORTAL}
        />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.not.exist;
  });

  it('should render the correct widget when widget type is DIRECT_DEPOSIT', () => {
    const { props, mockStore } = getData();
    const { getByTestId, rerender, container } = render(
      <Provider store={mockStore}>
        <CallToActionWidget
          {...props}
          isLoggedIn
          profile={{ loading: false, verified: true, multifactor: false }}
          featureToggles={{ loading: false }}
          appId={CTA_WIDGET_TYPES.DIRECT_DEPOSIT}
        />
      </Provider>,
    );
    expect(getByTestId('direct-deposit-mfa-message')).to.exist;
    rerender(
      <Provider store={mockStore}>
        <CallToActionWidget
          {...props}
          isLoggedIn
          profile={{ loading: false, verified: true, multifactor: true }}
          featureToggles={{ loading: false }}
          appId={CTA_WIDGET_TYPES.DIRECT_DEPOSIT}
        />
      </Provider>,
    );
    expect($('va-alert-sign-in', container)).to.exist;
  });

  describe('online scheduling', () => {
    it('should show mvi error', () => {
      const { container, rerender } = render(
        <CallToActionWidget
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{}}
          mviStatus="SERVER_ERROR"
          featureToggles={{
            loading: false,
            vaOnlineScheduling: true,
          }}
        />,
      );
      expect(container.querySelector('h3').textContent).to.contain(
        'We couldn’t connect you to our health tools',
      );
      rerender(
        <CallToActionWidget
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{}}
          mviStatus="NOT_FOUND"
          featureToggles={{
            loading: false,
            vaOnlineScheduling: true,
          }}
        />,
      );
      expect(container.querySelector('h3').textContent).to.contain(
        'We couldn’t verify your identity',
      );
      rerender(
        <CallToActionWidget
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{}}
          mviStatus="NOT_AUTHORIZED"
          featureToggles={{
            loading: false,
            vaOnlineScheduling: true,
          }}
        />,
      );
      expect(container.querySelector('va-alert-sign-in')).to.exist;
      rerender(
        <CallToActionWidget
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{}}
          mviStatus="NOT_AUTHORIZED"
          featureToggles={{
            loading: false,
            vaOnlineScheduling: true,
          }}
          serviceName={CSP_IDS.MHV}
        />,
      );
      expect(container.querySelector('va-alert-sign-in')).to.exist;
    });

    it('should show appts message', () => {
      const fetchMHVAccount = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.VIEW_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{}}
          mviStatus="OK"
          featureToggles={{
            loading: false,
            vaOnlineScheduling: true,
          }}
        />,
      );

      expect(fetchMHVAccount.called).to.be.false;
      expect(tree.find('VAOnlineScheduling').exists()).to.be.true;
      expect(tree.text()).contains(
        'view, schedule, or cancel your appointment online',
      );
      tree.unmount();
    });

    it('should not fetch mhv account for new tool', () => {
      const fetchMHVAccount = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{}}
          mviStatus="OK"
          featureToggles={{
            loading: false,
            vaOnlineScheduling: true,
          }}
        />,
      );

      expect(fetchMHVAccount.called).to.be.false;
      tree.setProps({});
      expect(fetchMHVAccount.called).to.be.false;
      tree.unmount();
    });
    it('should show the appropriate health tool content', () => {
      const fetchMHVAccount = sinon.spy();
      const { container, rerender } = render(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{}}
          mviStatus="OK"
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(container.querySelector('h3').textContent).to.contain(
        'Please create a My HealtheVet account',
      );
      rerender(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{}}
          mviStatus="NOT_AUTHORIZED"
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(container.querySelector('va-alert-sign-in')).to.exist;
      rerender(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          authenticatedWithSSOe
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: false,
            multifactor: true,
          }}
          mhvAccount={{}}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(container.querySelector('va-alert-sign-in')).to.exist;
      rerender(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          authenticatedWithSSOe
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{}}
          mhvAccountIdState="DEACTIVATED"
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(container.querySelector('h3').textContent).to.contain(
        'Your My HealtheVet account is inactive',
      );
      rerender(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          authenticatedWithSSOe
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{}}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(container.querySelector('h3').textContent).to.contain(
        'My HealtheVet will open in a new tab',
      );
      rerender(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{ accountLevel: 'Premium' }}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(container.querySelector('h3').textContent).to.contain(
        'My HealtheVet will open in a new tab',
      );
      rerender(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{ errors: 'some' }}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(container.querySelector('h3').textContent).to.contain(
        'We couldn’t connect you to our health tools',
      );
    });
  });

  describe('haCpapSuppliesCta feature', () => {
    const setup = ({
      isLoggedIn = false,
      haCpapSuppliesCta = false,
      verified = false,
    } = {}) => {
      const { mockStore } = getData();
      return mount(
        <Provider store={mockStore}>
          <CallToActionWidget
            isLoggedIn={isLoggedIn}
            appId={CTA_WIDGET_TYPES.HA_CPAP_SUPPLIES}
            profile={{
              loading: false,
              verified,
            }}
            mhvAccount={{}}
            mviStatus="OK"
            featureToggles={{
              loading: false,
              [featureFlagNames.haCpapSuppliesCta]: haCpapSuppliesCta,
            }}
            serviceName={CSP_IDS.ID_ME}
          />
        </Provider>,
      );
    };
    describe('enabled', () => {
      it('promps to sign in w/ h4 when enabled and user signed out', () => {
        const tree = setup({ haCpapSuppliesCta: true });
        expect(tree.find('SignIn').exists()).to.be.true;
      });

      it('promps to verify w/ h4 when enabled and user is unverified', () => {
        const tree = setup({ haCpapSuppliesCta: true, isLoggedIn: true });
        expect(tree.find('Verify').exists()).to.be.true;
      });

      it('renders a CTA link when enabled and verified user signed in', () => {
        const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.HA_CPAP_SUPPLIES];
        const { url } = ctaWidget.deriveToolUrlDetails();
        const { serviceDescription: desc } = ctaWidget;
        const text = `${desc[0].toUpperCase()}${desc.slice(1)}`;

        const tree = setup({
          haCpapSuppliesCta: true,
          isLoggedIn: true,
          verified: true,
        });
        const result = tree.find('a');
        expect(result.props().href).to.contain(url);
        expect(result.props().target).to.equal('_self');
        expect(result.text()).to.contain(text);
      });
    });

    describe('disabled', () => {
      it('renders nothing when feature disabled', () => {
        const tree = setup();
        expect(tree.children()).to.be.empty;
      });
    });
  });
});
