// Node modules.
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
// Relative imports.

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
    const tree = mount(
      <Provider store={mockStore}>
        <CallToActionWidget
          {...props}
          featureToggles={{ loading: false }}
          ariaLabel="test aria-label"
          ariaDescribedby="test-id"
        />
      </Provider>,
    );

    const signIn = tree.find('SignIn');
    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(signIn.exists()).to.be.true;
    expect(tree.find('h3').exists()).to.be.true;
    expect(signIn.prop('ariaLabel')).to.eq('test aria-label');
    expect(signIn.prop('ariaDescribedby')).to.eq('test-id');
    tree.unmount();
  });

  it('should show direct deposit sign in state', () => {
    const { props, mockStore } = getData();
    const tree = mount(
      <Provider store={mockStore}>
        <CallToActionWidget
          {...props}
          featureToggles={{
            loading: false,
          }}
          appId={CTA_WIDGET_TYPES.DIRECT_DEPOSIT}
          ariaLabel="test aria-label"
          ariaDescribedby="test-id"
        />
      </Provider>,
    );
    expect(tree.find('Unauthed').exists()).to.be.true;
    expect(tree.find('h3').exists()).to.be.true;

    const authReturnUrl = sessionStorage.getItem('authReturnUrl');
    const derivedUrl = ctaWidgetsLookup[
      CTA_WIDGET_TYPES.DIRECT_DEPOSIT
    ].deriveToolUrlDetails()?.url;
    expect(authReturnUrl.includes(derivedUrl)).to.be.true;
    sessionStorage.clear();

    tree.unmount();
  });

  it('should show verify link', () => {
    const tree = mount(
      <CallToActionWidget
        appId="test"
        isLoggedIn
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
          loading: false,
        }}
      />,
    );

    expect(tree.find('Verify').exists()).to.be.true;
    expect(tree.find('h3').exists()).to.be.true;
    tree.unmount();
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
  describe('health tools', () => {
    it('should fetch MHV account on mount', () => {
      const fetchMHVAccount = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          appId={CTA_WIDGET_TYPES.RX}
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

      expect(fetchMHVAccount.called).to.be.true;
      tree.unmount();
    });

    it('should open myhealthevet popup', () => {
      const { props, mockStore } = getData({
        profile: { loading: false, verified: true, multifactor: false },
        mhvAccount: {
          loading: false,
          accountState: 'good',
          accountLevel: 'Premium',
        },
        isLoggedIn: false,
      });
      const tree = mount(
        <Provider store={mockStore}>
          <CallToActionWidget
            appId={CTA_WIDGET_TYPES.RX}
            {...props}
            featureToggles={{ loading: false }}
          />
          ,
        </Provider>,
      );

      tree.setProps({
        children: (
          <Provider store={mockStore}>
            <CallToActionWidget
              appId={CTA_WIDGET_TYPES.RX}
              {...props}
              isLoggedIn
              featureToggles={{ loading: false }}
            />
            ,
          </Provider>
        ),
      });

      expect(tree.find('OpenMyHealtheVet').exists()).to.be.true;
      tree.unmount();
    });

    it('should show mvi server error', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.RX}
          profile={{
            loading: false,
            verified: true,
            multifactor: false,
          }}
          mhvAccount={{
            loading: false,
            accountState: 'good',
            accountLevel: 'Premium',
          }}
          mviStatus="SERVER_ERROR"
          featureToggles={{
            loading: false,
          }}
        />,
      );

      expect(tree.find('HealthToolsDown').exists()).to.be.true;
      tree.unmount();
    });

    it('should show mvi not authorized error', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.RX}
          profile={{
            loading: false,
            verified: true,
            multifactor: false,
          }}
          mhvAccount={{
            loading: false,
            accountState: 'good',
            accountLevel: 'Premium',
          }}
          mviStatus="NOT_AUTHORIZED"
          featureToggles={{
            loading: false,
          }}
        />,
      );

      expect(tree.find('NotAuthorized').exists()).to.be.true;
      tree.unmount();
    });

    it('should show mvi not found error', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.RX}
          profile={{
            loading: false,
            verified: true,
            multifactor: false,
          }}
          mhvAccount={{
            loading: false,
            accountState: 'good',
            accountLevel: 'Premium',
          }}
          mviStatus="NOT_FOUND"
          featureToggles={{
            loading: false,
          }}
        />,
      );

      expect(tree.find('NotFound').exists()).to.be.true;
      tree.unmount();
    });

    it('should show mhv error', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.RX}
          profile={{
            loading: false,
            verified: true,
            multifactor: false,
          }}
          mhvAccount={{
            errors: 'error',
            loading: false,
            accountState: 'good',
            accountLevel: 'Basic',
          }}
          mviStatus="GOOD"
          featureToggles={{
            loading: false,
          }}
        />,
      );

      expect(tree.find('HealthToolsDown').exists()).to.be.true;
      tree.unmount();
    });

    it('should show revised multifactor message for direct deposit', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.DIRECT_DEPOSIT}
          profile={{
            loading: false,
            verified: true,
            multifactor: false,
          }}
          mhvAccount={{
            loading: false,
            accountState: 'good',
            accountLevel: 'Premium',
          }}
          mviStatus="GOOD"
          featureToggles={{
            loading: false,
          }}
        />,
      );
      expect(tree.find('[data-testid="direct-deposit-mfa-message"]').exists())
        .to.be.true;
      expect(
        tree
          .find('[data-testid="direct-deposit-login-gov-sign-up-link"]')
          .exists(),
      ).to.be.true;
      expect(
        tree.find('[data-testid="direct-deposit-id-me-sign-up-link"]').exists(),
      ).to.be.true;
      expect(tree.find('h3').exists()).to.be.true;
      tree.unmount();
    });

    it('should show direct deposit component when verified with multifactor', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.DIRECT_DEPOSIT}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{
            loading: false,
            accountState: 'good',
            accountLevel: 'Premium',
          }}
          mviStatus="GOOD"
          featureToggles={{
            loading: false,
          }}
        />,
      );

      expect(tree.find('DirectDeposit').exists()).to.be.true;
      tree.unmount();
    });

    describe('account state errors', () => {
      const defaultProps = {
        fetchMHVAccount: d => d,
        isLoggedIn: true,
        appId: CTA_WIDGET_TYPES.RX,
        profile: {
          loading: false,
          verified: true,
          multifactor: true,
        },
        mviStatus: 'GOOD',
        featureToggles: { loading: false },
      };

      it('should show verify message', () => {
        const tree = mount(
          <CallToActionWidget
            {...defaultProps}
            mhvAccount={{
              loading: false,
              accountState: 'needs_identity_verification',
              accountLevel: 'Basic',
            }}
          />,
        );

        expect(tree.find('Verify').exists()).to.be.true;
        tree.unmount();
      });

      it('should show needs ssn message', () => {
        const tree = mount(
          <CallToActionWidget
            {...defaultProps}
            mhvAccount={{
              loading: false,
              accountState: 'needs_ssn_resolution',
              accountLevel: 'Basic',
            }}
          />,
        );

        expect(tree.find('NeedsSSNResolution').exists()).to.be.true;
        tree.unmount();
      });

      it('should show deactived ids message', () => {
        const tree = mount(
          <CallToActionWidget
            {...defaultProps}
            mhvAccount={{
              loading: false,
              accountState: 'has_deactivated_mhv_ids',
              accountLevel: 'Basic',
            }}
          />,
        );

        expect(tree.find('DeactivatedMHVIds').exists()).to.be.true;
        tree.unmount();
      });

      it('should show multiple ids message', () => {
        const tree = mount(
          <CallToActionWidget
            {...defaultProps}
            mhvAccount={{
              loading: false,
              accountState: 'has_multiple_active_mhv_ids',
              accountLevel: 'Basic',
            }}
          />,
        );

        expect(tree.find('MultipleIds').exists()).to.be.true;
        tree.unmount();
      });

      it('should show register failed message', () => {
        const tree = mount(
          <CallToActionWidget
            {...defaultProps}
            mhvAccount={{
              loading: false,
              accountState: 'register_failed',
              accountLevel: 'Basic',
            }}
          />,
        );

        expect(tree.find('RegisterFailed').exists()).to.be.true;
        tree.unmount();
      });

      it('should show upgrade failed message', () => {
        const tree = mount(
          <CallToActionWidget
            {...defaultProps}
            mhvAccount={{
              loading: false,
              accountState: 'upgrade_failed',
              accountLevel: 'Basic',
            }}
          />,
        );

        expect(tree.find('UpgradeFailed').exists()).to.be.true;
        tree.unmount();
      });

      it('should show needs VA patient message', () => {
        const tree = mount(
          <CallToActionWidget
            {...defaultProps}
            mhvAccount={{
              loading: false,
              accountState: 'needs_va_patient',
              accountLevel: 'Basic',
            }}
          />,
        );

        expect(tree.find('NeedsVAPatient').exists()).to.be.false;
        tree.unmount();
      });

      describe('ssoe', () => {
        const ssoeProps = { ...defaultProps, authenticatedWithSSOe: true };

        it('should show verify message', () => {
          const tree = mount(
            <CallToActionWidget
              {...ssoeProps}
              profile={{
                verified: false,
              }}
              mhvAccount={{
                loading: false,
                accountState: 'needs_identity_verification',
                accountLevel: 'Basic',
              }}
            />,
          );

          expect(tree.find('Verify').exists()).to.be.true;
          tree.unmount();
        });

        it('should show deactivated message', () => {
          const tree = mount(
            <CallToActionWidget
              {...ssoeProps}
              mhvAccountIdState="DEACTIVATED"
              mhvAccount={{
                loading: false,
                accountState: 'needs_identity_verification',
                accountLevel: 'Basic',
              }}
            />,
          );

          expect(tree.find('DeactivatedMHVIds').exists()).to.be.true;
          tree.unmount();
        });

        it('should show needs va patient message', () => {
          const tree = mount(
            <CallToActionWidget
              {...ssoeProps}
              isVaPatient={false}
              mhvAccount={{
                loading: false,
                accountState: 'needs_identity_verification',
                accountLevel: 'Basic',
              }}
            />,
          );

          expect(tree.find('NeedsVAPatient').exists()).to.be.false;
          tree.unmount();
        });
      });
    });
    it('should show MHV link', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.RX}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{
            loading: false,
            accountState: 'good',
            accountLevel: 'Premium',
          }}
          mviStatus="GOOD"
          featureToggles={{
            loading: false,
          }}
        />,
      );

      expect(tree.find('OpenMyHealtheVet').exists()).to.be.true;
      tree.unmount();
    });
    it('should show no MHV account message and redirect to t&c', () => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: window.location,
      });
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId={CTA_WIDGET_TYPES.RX}
          profile={{
            loading: false,
            verified: true,
            multifactor: true,
          }}
          mhvAccount={{
            loading: false,
            accountState: 'needs_terms_acceptance',
          }}
          mviStatus="GOOD"
          featureToggles={{
            loading: false,
          }}
        />,
      );

      expect(tree.find('NoMHVAccount').exists()).to.be.true;
      tree
        .find('NoMHVAccount')
        .props()
        .primaryButtonHandler();
      expect(window.location).to.contain(
        'medical-information-terms-conditions',
      );
      tree.unmount();
    });
  });
  describe('online scheduling', () => {
    it('should show mvi error', () => {
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
    it('should show mhv message if flag is off', () => {
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

      expect(fetchMHVAccount.called).to.be.true;
      expect(tree.find('NoMHVAccount').exists()).to.be.true;
      tree.unmount();
    });
  });

  describe('haCpapSuppliesCta feature', () => {
    const setup = ({
      isLoggedIn = false,
      haCpapSuppliesCta = false,
      verified = false,
    } = {}) => {
      return mount(
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
        />,
      );
    };

    describe('enabled', () => {
      it('promps to sign in w/ h4 when enabled and user signed out', () => {
        const tree = setup({ haCpapSuppliesCta: true });
        expect(tree.find('h3').exists()).to.be.true;
        expect(tree.find('SignIn').exists()).to.be.true;
      });

      it('promps to verify w/ h4 when enabled and user is unverified', () => {
        const tree = setup({ haCpapSuppliesCta: true, isLoggedIn: true });
        expect(tree.find('h3').exists()).to.be.true;
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
