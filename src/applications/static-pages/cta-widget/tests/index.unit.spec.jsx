// Node modules.
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
// Relative imports.
import * as recordEvent from '~/platform/monitoring/record-event';
import * as authUtils from '~/platform/user/authentication/utilities';
import * as oauthUtils from '~/platform/utilities/oauth/utilities';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';
import sessionStorage from '~/platform/utilities/storage/sessionStorage';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { CTA_WIDGET_TYPES, ctaWidgetsLookup } from '../ctaWidgets';
import { ACCOUNT_STATES } from '../constants';
import {
  CallToActionWidget,
  goToTool,
  mapStateToProps,
  sendToMHV,
  signOut,
  toggleModalWrapper,
  goToToolWrapper,
} from '../index';

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

    const vaAlertSignIn = container.querySelector(
      'va-alert-sign-in',
      container,
    );
    const signInButton = container.querySelector('va-button', container);

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
    const vaAlertSignIn = container.querySelector(
      'va-alert-sign-in',
      container,
    );
    const signInButton = container.querySelector('va-button', container);

    expect(vaAlertSignIn).to.exist;
    expect(signInButton).to.exist;
    expect(signInButton.getAttribute('text')).to.eql(
      'Sign in or create an account',
    );
    expect(vaAlertSignIn.getAttribute('heading-level')).to.eql('3');
    expect(vaAlertSignIn.getAttribute('variant')).to.eql('signInRequired');

    const authReturnUrl = sessionStorage.getItem('authReturnUrl');
    const derivedUrl =
      ctaWidgetsLookup[CTA_WIDGET_TYPES.DIRECT_DEPOSIT].deriveToolUrlDetails()
        ?.url;
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
    const vaAlertSignIn = container.querySelector(
      'va-alert-sign-in',
      container,
    );
    const signInButton = container.querySelector('va-button', container);

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

    const vaAlertSignIn = container.querySelector(
      'va-alert-sign-in',
      container,
    );

    expect(vaAlertSignIn).to.exist;
    expect(container.querySelector('.idme-verify-button', container)).to.exist;
    expect(container.querySelector('.logingov-verify-button', container)).to.not
      .exist;
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
    expect(container.querySelector('va-loading-indicator', container)).to.exist;
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
    expect(container.querySelector('va-loading-indicator', container)).to.exist;
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
    expect(container.querySelector('va-loading-indicator', container)).to.not
      .exist;
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
    expect(container.querySelector('va-loading-indicator', container)).to.not
      .exist;
  });

  it('should render MFA when the widget type is DIRECT_DEPOSIT and the profile is NOT multifactor', () => {
    const { props, mockStore } = getData();
    const { getByTestId } = render(
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
  });

  it('should render DirectDeposit when the widget type is DIRECT_DEPOSIT and the profile IS multifactor', () => {
    const { props, mockStore } = getData();
    const { container } = render(
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
    expect(container.querySelector('va-alert-sign-in', container)).to.exist;
  });

  describe('online scheduling', () => {
    it('should show HealthToolsDown when there is a server error', () => {
      const tree = mount(
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
      expect(tree.find('HealthToolsDown').exists()).to.be.true;
      tree.unmount();
    });

    it('should show NotFound when the mvi status is not found', () => {
      const tree = mount(
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
      expect(tree.find('NotFound').exists()).to.be.true;
      tree.unmount();
    });

    it('should show VaAlertSignIn when the mvi status is not authorized', () => {
      const { mockStore } = getData();
      const tree = mount(
        <Provider store={mockStore}>
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
          />
        </Provider>,
      );
      expect(tree.find('VaAlertSignIn').exists()).to.be.true;
      tree.unmount();
    });

    it('should show SignInOtherAccount when the mvi status is not authorized and the CSP is MHV', () => {
      const { mockStore } = getData();
      const tree = mount(
        <Provider store={mockStore}>
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
          />
        </Provider>,
      );
      expect(tree.find('SignInOtherAccount').exists()).to.be.true;
      tree.unmount();
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

    it('should show NoMHVAccount if it is a health tool and the mvi status is ok', () => {
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
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('NoMHVAccount').exists()).to.be.true;
      tree.unmount();
    });

    it('should show VaAlertSignIn if it is a health tool and the mvi status is not authorized', () => {
      const fetchMHVAccount = sinon.spy();
      const { mockStore } = getData();
      const tree = mount(
        <Provider store={mockStore}>
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
          />
        </Provider>,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('VaAlertSignIn').exists()).to.be.true;
      tree.unmount();
    });

    it('should show VaAlertSignIn if it is a health tool authenticated with ssoe', () => {
      const fetchMHVAccount = sinon.spy();
      const { mockStore } = getData();
      const tree = mount(
        <Provider store={mockStore}>
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
          />
        </Provider>,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('VaAlertSignIn').exists()).to.be.true;
      tree.unmount();
    });

    it('should show DeactivatedMHVIds if it is a health tool and the mhv account is deactivated', () => {
      const fetchMHVAccount = sinon.spy();
      const tree = mount(
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
      expect(tree.find('DeactivatedMHVIds').exists()).to.be.true;
      tree.unmount();
    });

    it('should show OpenMyHealtheVet if it is a health tool authenticated with ssoe', () => {
      const fetchMHVAccount = sinon.spy();
      const tree = mount(
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
      expect(tree.find('OpenMyHealtheVet').exists()).to.be.true;
      tree.unmount();
    });

    it('should show OpenMyHealtheVet if it is a health tool and the mhv account is premium', () => {
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
          mhvAccount={{ accountLevel: 'Premium' }}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('OpenMyHealtheVet').exists()).to.be.true;
      tree.unmount();
    });

    it('should show HealthToolsDown if it is a health tool and the mhv account has errors', () => {
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
          mhvAccount={{ errors: 'some' }}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('HealthToolsDown').exists()).to.be.true;
      tree.unmount();
    });

    it('should show UpgradeFailed if it is a health tool and the account upgrade failed', () => {
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
          mhvAccount={{ accountState: ACCOUNT_STATES.UPGRADE_FAILED }}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('UpgradeFailed').exists()).to.be.true;
      tree.unmount();
    });

    it('should show RegisterFailed if it is a health tool and registering the account failed', () => {
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
          mhvAccount={{ accountState: ACCOUNT_STATES.REGISTER_FAILED }}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('RegisterFailed').exists()).to.be.true;
      tree.unmount();
    });

    it('should show MultipleIds if it is a health tool and the account has multiple ids', () => {
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
          mhvAccount={{ accountState: ACCOUNT_STATES.MULTIPLE_IDS }}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('MultipleIds').exists()).to.be.true;
      tree.unmount();
    });

    it('should show DeactivatedMHVIds if it is a health tool and the account has deactivated MHV ids', () => {
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
          mhvAccount={{ accountState: ACCOUNT_STATES.DEACTIVATED_MHV_IDS }}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('DeactivatedMHVIds').exists()).to.be.true;
      tree.unmount();
    });

    it('should show NeedsSSNResolution if it is a health tool and the account needs SSN resolution', () => {
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
          mhvAccount={{ accountState: ACCOUNT_STATES.NEEDS_SSN_RESOLUTION }}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('NeedsSSNResolution').exists()).to.be.true;
      tree.unmount();
    });

    it('should show VaAlertSignIn if it is a health tool and the account needs verification', () => {
      const fetchMHVAccount = sinon.spy();
      const { mockStore } = getData();
      const tree = mount(
        <Provider store={mockStore}>
          <CallToActionWidget
            fetchMHVAccount={fetchMHVAccount}
            isLoggedIn
            appId={CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS}
            profile={{
              loading: false,
              verified: true,
              multifactor: true,
            }}
            mhvAccount={{ accountState: ACCOUNT_STATES.NEEDS_VERIFICATION }}
            featureToggles={{
              loading: false,
              vaOnlineScheduling: false,
            }}
          />
        </Provider>,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('VaAlertSignIn').exists()).to.be.true;
      tree.unmount();
    });

    it('should show UpgradeAccount if it is a health tool and has an account level', () => {
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
          mhvAccount={{
            accountState: ACCOUNT_STATES.NEEDS_TERMS_ACCEPTANCE,
            accountLevel: 'Basic',
          }}
          featureToggles={{
            loading: false,
            vaOnlineScheduling: false,
          }}
        />,
      );
      expect(fetchMHVAccount.calledOnce).to.be.true;
      expect(tree.find('UpgradeAccount').exists()).to.be.true;
      tree.unmount();
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

    describe('functionality', () => {
      it('should show child nodes if provided', () => {
        const tree = mount(
          <CallToActionWidget
            isLoggedIn
            appId="test"
            profile={{
              loading: false,
              verified: true,
              multifactor: true,
            }}
            mhvAccount={{}}
            featureToggles={{
              loading: false,
              vaOnlineScheduling: true,
            }}
          >
            <div className="child-node">Child Node</div>
          </CallToActionWidget>,
        );
        expect(tree.find('.child-node').exists()).to.be.true;
        expect(tree.find('.child-node').text()).to.equal('Child Node');
        tree.unmount();
      });

      it('should map state to props correctly', () => {
        const state = {
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              loa: {
                current: 3,
              },
              signIn: {
                serviceName: CSP_IDS.ID_ME,
              },
              loading: false,
              mhvAccount: {
                loading: false,
              },
            },
          },
        };
        const props = mapStateToProps(state);
        expect(props.serviceName).to.equal(CSP_IDS.ID_ME);
        expect(props.isLoggedIn).to.be.true;
        expect(props.profile.loading).to.be.false;
        expect(props.mhvAccount.loading).to.be.false;
      });

      it('should redirect correctly when sendToMHV is called', () => {
        const oldLocation = window.location;
        const sendtoMHVFunction = sendToMHV(true);
        expect(sendtoMHVFunction).to.be.a('function');
        sendtoMHVFunction();
        const location = window.location.href || window.location;
        expect(location).to.include(
          'https://int.eauth.va.gov/mhv-portal-web/eauth',
        );
        window.location = oldLocation;
      });

      it('should open tools correctly using goToTool', () => {
        const oldLocation = window.location;
        const windowSpy = sinon.spy(window, 'open');
        const recordEventSpy = sinon.spy(recordEvent, 'default');

        const url = '/some-tool';
        const gaEvent = { event: 'test-event' };
        const result = goToTool(url, gaEvent);
        expect(result).to.be.false;
        expect(recordEventSpy.calledOnce).to.be.true;
        expect(windowSpy.calledOnce).to.be.false;
        const location = window.location.href || window.location;
        expect(location).to.include(url);

        recordEventSpy.reset();

        const blankUrl = '';
        const blankResult = goToTool(blankUrl);
        expect(blankResult).to.be.false;
        expect(recordEventSpy.calledOnce).to.be.false;
        expect(windowSpy.calledOnce).to.be.false;

        const externalUrl = 'https://www.va.gov';
        goToTool(externalUrl);
        expect(recordEventSpy.calledOnce).to.be.false;
        expect(windowSpy.calledOnce).to.be.true;

        recordEventSpy.restore();
        windowSpy.restore();
        window.location = oldLocation;
      });

      it('should sign out correctly when signOut is called', () => {
        const oldLocation = window.location;

        const IAMLogoutSpy = sinon.spy(authUtils, 'logout');
        const logoutUrlSiSSpy = sinon.spy(oauthUtils, 'logoutUrlSiS');
        const innerFunc = signOut(true);
        innerFunc();
        expect(IAMLogoutSpy.calledOnce).to.be.true;

        IAMLogoutSpy.reset();

        const otherInnerFunc = signOut(false);
        expect(otherInnerFunc).to.be.a('function');
        otherInnerFunc();
        expect(IAMLogoutSpy.calledOnce).to.be.false;
        expect(logoutUrlSiSSpy.calledOnce).to.be.true;
        const location = window.location.href || window.location;
        expect(location).to.include(logoutUrlSiSSpy.returnValues[0]);

        IAMLogoutSpy.restore();
        logoutUrlSiSSpy.restore();
        window.location = oldLocation;
      });

      it('should toggle the login modal correctly when openLoginModal and openForcedLoginModal are called', () => {
        const toggleStub = sinon.stub();
        const { openLoginModal, openForcedLoginModal } =
          toggleModalWrapper(toggleStub);

        expect(openLoginModal).to.be.a('function');
        expect(openForcedLoginModal).to.be.a('function');

        openLoginModal();
        expect(toggleStub.calledWith(true)).to.be.true;

        openForcedLoginModal();
        expect(toggleStub.calledWith(true, '', true));
      });

      it('should wrap the goToTool function correctly when goToToolWrapper is called', () => {
        const oldLocation = window.location;
        const windowSpy = sinon.spy(window, 'open');
        const recordEventSpy = sinon.spy(recordEvent, 'default');

        const url = '/some-tool';
        const gaEvent = { event: 'test-event' };
        const toolFunc = goToToolWrapper(url, gaEvent);
        expect(toolFunc).to.be.a('function');
        const result = toolFunc();
        expect(result).to.be.undefined;
        expect(recordEventSpy.calledOnce).to.be.true;
        expect(windowSpy.calledOnce).to.be.false;
        const location = window.location.href || window.location;
        expect(location).to.include(url);

        recordEventSpy.reset();

        const blankUrl = '';
        const blankToolFunc = goToToolWrapper(blankUrl);
        expect(blankToolFunc).to.be.a('function');
        const blankResult = blankToolFunc();
        expect(blankResult).to.be.undefined;
        expect(recordEventSpy.calledOnce).to.be.false;
        expect(windowSpy.calledOnce).to.be.false;

        const externalUrl = 'https://www.va.gov';
        const externalToolFunc = goToToolWrapper(externalUrl);
        expect(externalToolFunc).to.be.a('function');
        const externalResult = externalToolFunc();
        expect(externalResult).to.be.undefined;
        expect(recordEventSpy.calledOnce).to.be.false;
        expect(windowSpy.calledOnce).to.be.true;

        recordEventSpy.restore();
        windowSpy.restore();
        window.location = oldLocation;
      });
    });
  });
});
