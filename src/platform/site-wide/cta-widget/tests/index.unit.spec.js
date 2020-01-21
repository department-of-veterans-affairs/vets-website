import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { CallToActionWidget } from '../index';

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
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    tree.unmount();
  });
  it('should show sign in state', () => {
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
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(tree.find('SignIn').exists()).to.be.true;
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
      />,
    );

    expect(tree.find('Verify').exists()).to.be.true;
    tree.unmount();
  });
  it('should show link and description', () => {
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
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(tree.find('SignIn').exists()).to.be.false;
    expect(tree.find('Verify').exists()).to.be.false;
    expect(tree.find('a').props().href).to.contain('track-claims');
    expect(tree.find('a').props().target).to.equal('_self');
    expect(tree.find('a').text()).to.contain('Claim or Appeal Status');
    tree.unmount();
  });
  describe('health tools', () => {
    it('should fetch MHV account on mount', () => {
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
        />,
      );

      expect(fetchMHVAccount.called).to.be.true;
      tree.unmount();
    });

    it('should fetch MHV account on update', () => {
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
        />,
      );
      expect(fetchMHVAccount.called).to.be.false;

      tree.setProps({ isLoggedIn: true });

      expect(fetchMHVAccount.called).to.be.true;
      tree.unmount();
    });

    it('should create and upgrade MHV account when necessary', () => {
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
        />,
      );
      expect(createAndUpgradeMHVAccount.called).to.be.false;

      global.dom.reconfigure({ url: 'http://localhost?tc_accepted=true' });
      tree.setProps({
        isLoggedIn: true,
        mhvAccount: {
          loading: false,
          accountState: 'something',
        },
      });

      expect(createAndUpgradeMHVAccount.called).to.be.true;
      tree.unmount();
      global.dom.reconfigure({ url: 'http://localhost' });
    });

    it('should upgrade MHV account when necessary', () => {
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
        />,
      );
      expect(upgradeMHVAccount.called).to.be.false;

      global.dom.reconfigure({ url: 'http://localhost?tc_accepted=true' });
      tree.setProps({
        isLoggedIn: true,
        mhvAccount: {
          loading: false,
          accountState: 'something',
          accountLevel: 'Basic',
        },
      });

      expect(upgradeMHVAccount.called).to.be.true;
      tree.unmount();
      global.dom.reconfigure({ url: 'http://localhost' });
    });

    it('should open rx tool', () => {
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
        />,
      );

      tree.setProps({
        isLoggedIn: true,
      });

      expect(window.open.firstCall.args[0]).to.contain('refill-prescriptions');
      tree.unmount();
      window.open = jsdomOpen;
    });

    it('should show mvi server error', () => {
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
        />,
      );

      expect(tree.find('HealthToolsDown').exists()).to.be.true;
      tree.unmount();
    });

    it('should show multifactor message for direct deposit', () => {
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
        />,
      );

      expect(tree.find('MFA').exists()).to.be.true;
      tree.unmount();
    });

    it('should show direct deposit component when verified with multifactor', () => {
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
        />,
      );

      expect(tree.find('DirectDeposit').exists()).to.be.true;
      tree.unmount();
    });
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

        expect(tree.find('NeedsVAPatient').exists()).to.be.true;
        tree.unmount();
      });
    });
    it('should show MHV link', () => {
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
});
