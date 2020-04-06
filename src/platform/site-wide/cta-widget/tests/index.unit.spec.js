import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { CallToActionWidget } from '../index';

describe('<CallToActionWidget>', () => {
  test('should show loading state', () => {
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

    expect(tree.find('LoadingIndicator').exists()).toBe(true);
    tree.unmount();
  });
  test('should show loading state when loading feature toggles', () => {
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

    expect(tree.find('LoadingIndicator').exists()).toBe(true);
    tree.unmount();
  });
  test('should show sign in state', () => {
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
          loading: false,
        }}
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).toBe(false);
    expect(tree.find('SignIn').exists()).toBe(true);
    tree.unmount();
  });
  test('should show verify link', () => {
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

    expect(tree.find('Verify').exists()).toBe(true);
    tree.unmount();
  });
  test('should show link and description', () => {
    const tree = mount(
      <CallToActionWidget
        appId="claims-and-appeals"
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

    expect(tree.find('LoadingIndicator').exists()).toBe(false);
    expect(tree.find('SignIn').exists()).toBe(false);
    expect(tree.find('Verify').exists()).toBe(false);
    expect(tree.find('a').props().href).toEqual(
      expect.arrayContaining(['track-claims']),
    );
    expect(tree.find('a').props().target).toBe('_self');
    expect(tree.find('a').text()).toEqual(
      expect.arrayContaining(['Claim or Appeal Status']),
    );
    tree.unmount();
  });
  describe('health tools', () => {
    test('should fetch MHV account on mount', () => {
      const fetchMHVAccount = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          appId="rx"
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

      expect(fetchMHVAccount.called).toBe(true);
      tree.unmount();
    });

    test('should fetch MHV account on update', () => {
      const fetchMHVAccount = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          appId="rx"
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
      expect(fetchMHVAccount.called).toBe(false);

      tree.setProps({ isLoggedIn: true });

      expect(fetchMHVAccount.called).toBe(true);
      tree.unmount();
    });

    test('should create and upgrade MHV account when necessary', () => {
      const createAndUpgradeMHVAccount = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          createAndUpgradeMHVAccount={createAndUpgradeMHVAccount}
          appId="rx"
          profile={{
            loading: false,
            verified: true,
            multifactor: false,
          }}
          mhvAccount={{
            loading: true,
          }}
          mviStatus={{}}
          featureToggles={{
            loading: false,
          }}
        />,
      );
      expect(createAndUpgradeMHVAccount.called).toBe(false);

      global.dom.reconfigure({ url: 'http://localhost?tc_accepted=true' });
      tree.setProps({
        isLoggedIn: true,
        mhvAccount: {
          loading: false,
          accountState: 'something',
        },
      });

      expect(createAndUpgradeMHVAccount.called).toBe(true);
      tree.unmount();
      global.dom.reconfigure({ url: 'http://localhost' });
    });

    test('should upgrade MHV account when necessary', () => {
      const upgradeMHVAccount = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          upgradeMHVAccount={upgradeMHVAccount}
          appId="rx"
          profile={{
            loading: false,
            verified: true,
            multifactor: false,
          }}
          mhvAccount={{
            loading: true,
          }}
          mviStatus={{}}
          featureToggles={{
            loading: false,
          }}
        />,
      );
      expect(upgradeMHVAccount.called).toBe(false);

      global.dom.reconfigure({ url: 'http://localhost?tc_accepted=true' });
      tree.setProps({
        isLoggedIn: true,
        mhvAccount: {
          loading: false,
          accountState: 'something',
          accountLevel: 'Basic',
        },
      });

      expect(upgradeMHVAccount.called).toBe(true);
      tree.unmount();
      global.dom.reconfigure({ url: 'http://localhost' });
    });

    test('should open rx tool', () => {
      const jsdomOpen = window.open;
      window.open = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          appId="rx"
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
          mviStatus={{}}
          featureToggles={{
            loading: false,
          }}
        />,
      );

      tree.setProps({
        isLoggedIn: true,
      });

      expect(window.open.firstCall.args[0]).toEqual(
        expect.arrayContaining(['refill-prescriptions']),
      );
      tree.unmount();
      window.open = jsdomOpen;
    });

    test('should show mvi server error', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId="rx"
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

      expect(tree.find('HealthToolsDown').exists()).toBe(true);
      tree.unmount();
    });

    test('should show mvi not authorized error', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId="rx"
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

      expect(tree.find('NotAuthorized').exists()).toBe(true);
      tree.unmount();
    });

    test('should show mvi not found error', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId="rx"
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

      expect(tree.find('NotFound').exists()).toBe(true);
      tree.unmount();
    });

    test('should show mhv error', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId="rx"
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

      expect(tree.find('HealthToolsDown').exists()).toBe(true);
      tree.unmount();
    });

    test('should show multifactor message for direct deposit', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId="direct-deposit"
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

      expect(tree.find('MFA').exists()).toBe(true);
      tree.unmount();
    });

    test(
      'should show direct deposit component when verified with multifactor',
      () => {
        const tree = mount(
          <CallToActionWidget
            fetchMHVAccount={d => d}
            isLoggedIn
            appId="direct-deposit"
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

        expect(tree.find('DirectDeposit').exists()).toBe(true);
        tree.unmount();
      }
    );
    describe('account state errors', () => {
      const defaultProps = {
        fetchMHVAccount: d => d,
        isLoggedIn: true,
        appId: 'rx',
        profile: {
          loading: false,
          verified: true,
          multifactor: true,
        },
        mviStatus: 'GOOD',
        featureToggles: { loading: false },
      };

      test('should show verify message', () => {
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

        expect(tree.find('Verify').exists()).toBe(true);
        tree.unmount();
      });

      test('should show needs ssn message', () => {
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

        expect(tree.find('NeedsSSNResolution').exists()).toBe(true);
        tree.unmount();
      });

      test('should show deactived ids message', () => {
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

        expect(tree.find('DeactivatedMHVIds').exists()).toBe(true);
        tree.unmount();
      });

      test('should show multiple ids message', () => {
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

        expect(tree.find('MultipleIds').exists()).toBe(true);
        tree.unmount();
      });

      test('should show register failed message', () => {
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

        expect(tree.find('RegisterFailed').exists()).toBe(true);
        tree.unmount();
      });

      test('should show upgrade failed message', () => {
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

        expect(tree.find('UpgradeFailed').exists()).toBe(true);
        tree.unmount();
      });

      test('should show needs VA patient message', () => {
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

        expect(tree.find('NeedsVAPatient').exists()).toBe(true);
        tree.unmount();
      });
    });
    test('should show MHV link', () => {
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId="rx"
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

      expect(tree.find('OpenMyHealtheVet').exists()).toBe(true);
      tree.unmount();
    });
    test('should show no MHV account message and redirect to t&c', () => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: window.location,
      });
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={d => d}
          isLoggedIn
          appId="rx"
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

      expect(tree.find('NoMHVAccount').exists()).toBe(true);
      tree
        .find('NoMHVAccount')
        .props()
        .primaryButtonHandler();
      expect(window.location).toEqual(
        expect.arrayContaining(['medical-information-terms-conditions']),
      );
      tree.unmount();
    });
  });
  describe('online scheduling', () => {
    test('should show mvi error', () => {
      const fetchMHVAccount = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          isLoggedIn
          appId="schedule-appointments"
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

      expect(tree.find('HealthToolsDown').exists()).toBe(true);
      tree.unmount();
    });

    test('should show appts message', () => {
      const fetchMHVAccount = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          isLoggedIn
          appId="view-appointments"
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

      expect(fetchMHVAccount.called).toBe(false);
      expect(tree.find('VAOnlineScheduling').exists()).toBe(true);
      expect(tree.text()).toEqual(
        expect.arrayContaining([
          'view, schedule, or cancel your appointment online',
        ]),
      );
      tree.unmount();
    });

    test('should not fetch mhv account for new tool', () => {
      const fetchMHVAccount = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          isLoggedIn
          appId="schedule-appointments"
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

      expect(fetchMHVAccount.called).toBe(false);
      tree.setProps({});
      expect(fetchMHVAccount.called).toBe(false);
      tree.unmount();
    });
    test('should show mhv message if flag is off', () => {
      const fetchMHVAccount = sinon.spy();
      const tree = mount(
        <CallToActionWidget
          fetchMHVAccount={fetchMHVAccount}
          isLoggedIn
          appId="schedule-appointments"
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

      expect(fetchMHVAccount.called).toBe(true);
      expect(tree.find('NoMHVAccount').exists()).toBe(true);
      tree.unmount();
    });
  });
});
