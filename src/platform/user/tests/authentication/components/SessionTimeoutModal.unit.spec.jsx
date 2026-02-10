import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import localStorage from 'platform/utilities/storage/localStorage';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import {
  SessionTimeoutModal,
  mapStateToProps,
} from 'platform/user/authentication/components/SessionTimeoutModal';
import * as oauthUtilities from 'platform/utilities/oauth/utilities';
import * as authenticationUtilities from 'platform/user/authentication/utilities';

const defaultProps = {
  isLoggedIn: true,
  initializeProfile: sinon.spy(),
  authenticatedWithOAuth: false,
  serviceName: 'logingov',
};

describe('SessionTimeoutModal', () => {
  it('should render Modal', () => {
    const component = shallow(<SessionTimeoutModal {...defaultProps} />);
    const buttons = component.find('button');

    expect(component).to.have.lengthOf(1);
    expect(buttons.length).to.eql(2);
    component.unmount();
  });

  it('should map state to props', () => {
    const state = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          session: {
            authBroker: 'sis',
          },
          signIn: {
            serviceName: 'logingov',
          },
        },
      },
    };
    const props = mapStateToProps(state);

    expect(props.isLoggedIn).to.eql(true);
    expect(props.authenticatedWithOAuth).to.eql(true);
    expect(props.serviceName).to.eql('logingov');
  });

  it('extends the session when the modal is closed', () => {
    const onExtendSessionSpy = sinon.spy();
    const props = {
      ...defaultProps,
      onExtendSession: onExtendSessionSpy,
    };
    const component = shallow(<SessionTimeoutModal {...props} />);

    component.find(Modal).prop('onClose')();

    expect(onExtendSessionSpy.calledOnce).to.be.true;

    component.unmount();
  });

  it('should call refresh when extendSession is called and authenticatedWithOAuth is true', () => {
    const refreshStub = sinon.stub(oauthUtilities, 'refresh');
    const props = {
      ...defaultProps,
      authenticatedWithOAuth: true,
    };
    const component = shallow(<SessionTimeoutModal {...props} />);

    component.instance().extendSession();

    expect(refreshStub.calledOnce).to.be.true;
    expect(refreshStub.calledWith({ type: 'logingov' })).to.be.true;

    refreshStub.restore();
    component.unmount();
  });

  it('should call logoutUrlSiS when signing out while authenticatedWithOAuth is true', () => {
    const logoutUrlSiSStub = sinon.stub(oauthUtilities, 'logoutUrlSiS');
    const props = {
      ...defaultProps,
      authenticatedWithOAuth: true,
    };

    const component = shallow(<SessionTimeoutModal {...props} />);

    component.instance().signOut();

    expect(logoutUrlSiSStub.calledOnce).to.be.true;

    logoutUrlSiSStub.restore();
    component.unmount();
  });

  it('should call IAMLogout when signing out while authenticatedWithOAuth is false', () => {
    const IAMLogoutStub = sinon.stub(authenticationUtilities, 'logout');

    const component = shallow(<SessionTimeoutModal {...defaultProps} />);

    component.instance().signOut();

    expect(IAMLogoutStub.calledOnce).to.be.true;

    IAMLogoutStub.restore();
    component.unmount();
  });

  it('should call logoutUrlSiS when the session expires while authenticatedWithOAuth is true', () => {
    const logoutUrlSiSStub = sinon.stub(oauthUtilities, 'logoutUrlSiS');
    const props = { ...defaultProps, authenticatedWithOAuth: true };

    const component = shallow(<SessionTimeoutModal {...props} />);

    component.instance().expireSession();

    expect(logoutUrlSiSStub.calledOnce).to.be.true;

    logoutUrlSiSStub.restore();
    component.unmount();
  });

  it('should call IAMLogout when the session expires while authenticatedWithOAuth is false', () => {
    const IAMLogoutStub = sinon.stub(authenticationUtilities, 'logout');

    const component = shallow(<SessionTimeoutModal {...defaultProps} />);

    component.instance().expireSession();

    expect(IAMLogoutStub.calledOnce).to.be.true;

    IAMLogoutStub.restore();
    component.unmount();
  });

  it('should clear interval and return when not logged in', () => {
    const props = { ...defaultProps, isLoggedIn: false };
    const component = shallow(<SessionTimeoutModal {...props} />);
    const instance = component.instance();

    const clearIntervalSpy = sinon.spy(instance, 'clearInterval');

    instance.checkExpiration();

    expect(clearIntervalSpy.calledOnce).to.be.true;

    clearIntervalSpy.restore();
    component.unmount();
  });

  it('should return when there is no expirationDate', () => {
    const component = shallow(<SessionTimeoutModal {...defaultProps} />);
    const instance = component.instance();

    instance.checkExpiration();

    // Ensure no state changes or method calls
    expect(instance.state.countdown).to.be.null;

    component.unmount();
  });

  it('should call expireSession when countdown is less than 0', () => {
    const pastDate = new Date(Date.now() - 60000).toISOString(); // 1 minute ago
    localStorage.setItem('sessionExpiration', pastDate);
    const component = shallow(<SessionTimeoutModal {...defaultProps} />);
    const instance = component.instance();
    const expireSessionSpy = sinon.spy(instance, 'expireSession');

    instance.checkExpiration();

    expect(expireSessionSpy.calledOnce).to.be.true;

    localStorage.clear();
    expireSessionSpy.restore();
    component.unmount();
  });

  it('should set state.countdown when countdown is gte 0 and lte MODAL_DURATION', () => {
    const futureDate = new Date(Date.now() + 15000).toISOString(); // 15 seconds in future
    localStorage.setItem('sessionExpiration', futureDate);
    const component = shallow(<SessionTimeoutModal {...defaultProps} />);
    const instance = component.instance();
    const setStateSpy = sinon.spy(instance, 'setState');

    instance.checkExpiration();

    expect(setStateSpy.calledOnce).to.be.true;
    expect(instance.state.countdown).to.be.within(0, 30); // MODAL_DURATION is 30

    localStorage.clear();
    setStateSpy.restore();
    component.unmount();
  });

  it('should do nothing when countdown is greater than MODAL_DURATION', () => {
    const futureDate = new Date(Date.now() + 60000).toISOString(); // 60 seconds in future
    localStorage.setItem('sessionExpiration', futureDate);
    const component = shallow(<SessionTimeoutModal {...defaultProps} />);
    const instance = component.instance();
    const setStateSpy = sinon.spy(instance, 'setState');
    const expireSessionSpy = sinon.spy(instance, 'expireSession');

    instance.checkExpiration();

    expect(setStateSpy.notCalled).to.be.true;
    expect(expireSessionSpy.notCalled).to.be.true;

    localStorage.clear();
    setStateSpy.restore();
    expireSessionSpy.restore();
    component.unmount();
  });

  it('does not set interval when expirationInterval is already set', () => {
    const component = shallow(<SessionTimeoutModal {...defaultProps} />);
    const instance = component.instance();
    instance.expirationInterval = 123;
    const setIntervalSpy = sinon.spy(global, 'setInterval');

    instance.componentDidUpdate();

    expect(setIntervalSpy.notCalled).to.be.true;

    setIntervalSpy.restore();
    component.unmount();
  });

  it('sets the service name to an empty string when it is undefined', () => {
    const state = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          session: {
            authBroker: 'sis',
          },
          signIn: {
            serviceName: undefined,
          },
        },
      },
    };
    const props = mapStateToProps(state);
    const component = shallow(<SessionTimeoutModal {...props} />);
    const instance = component.instance();

    instance.componentDidUpdate();

    expect(instance.serviceName).to.eql('');

    component.unmount();
  });

  it('sets the service name to an empty string when it is null', () => {
    const state = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          session: {
            authBroker: 'sis',
          },
          signIn: {
            serviceName: null,
          },
        },
      },
    };
    const props = mapStateToProps(state);
    const component = shallow(<SessionTimeoutModal {...props} />);
    const instance = component.instance();

    instance.componentDidUpdate();

    expect(instance.serviceName).to.eql('');

    component.unmount();
  });
});
