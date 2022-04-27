import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import * as ssoUtils from 'platform/utilities/sso';
import * as loginAttempted from 'platform/utilities/sso/loginAttempted';
import { AutoSSO } from '../../containers/AutoSSO';

let oldWindow;
const fakeWindow = () => {
  oldWindow = global.window;
  global.window = Object.create(global.window);
  Object.assign(global.window, {
    location: {
      get: () => global.window.location,
      set: value => {
        global.window.location = value;
      },
      pathname: '',
      search: '',
    },
  });
};

describe('<AutoSSO>', () => {
  let props = {};

  beforeEach(() => {
    props = {
      hasCalledKeepAlive: false,
      transactionId: undefined,
      loggedIn: false,
      profileLoading: false,
      checkKeepAlive: () => {},
    };
    fakeWindow();
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  describe('removeLoginAttempted', () => {
    it('should not call `removeLoginAttempted` if user is logged out', () => {
      const stub = sinon.stub(loginAttempted, 'removeLoginAttempted');
      const wrapper = shallow(<AutoSSO {...props} />);
      stub.restore();
      sinon.assert.notCalled(stub);
      wrapper.unmount();
    });

    it('should call `removeLoginAttempted` if user is logged in', () => {
      const stub = sinon.stub(loginAttempted, 'removeLoginAttempted');
      props = {
        ...props,
        loggedIn: true,
      };
      const wrapper = shallow(<AutoSSO {...props} />);
      stub.restore();
      sinon.assert.calledOnce(stub);
      wrapper.unmount();
    });
  });

  describe('checkAutoSession', () => {
    it('should not call checkAutoSession on an invalid path', () => {
      global.window.location.pathname = '/logout';
      const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);

      props = {
        ...props,
        profileLoading: false,
        hasCalledKeepAlive: false,
      };
      const wrapper = shallow(<AutoSSO {...props} />);
      stub.restore();
      sinon.assert.notCalled(stub);
      wrapper.unmount();
    });
    it('should not call checkAutoSession if profile is loading', () => {
      global.window.location.pathname = '/valid-path';
      const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);

      props = {
        ...props,
        profileLoading: true,
        hasCalledKeepAlive: false,
      };
      const wrapper = shallow(<AutoSSO {...props} />);
      stub.restore();
      sinon.assert.notCalled(stub);
      wrapper.unmount();
    });
    it('should not call checkAutoSession if hasCalledKeepAlive is false', () => {
      global.window.location.pathname = '/valid-path';
      const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);

      props = {
        ...props,
        profileLoading: false,
        hasCalledKeepAlive: true,
      };
      const wrapper = shallow(<AutoSSO {...props} />);
      stub.restore();
      sinon.assert.notCalled(stub);
      wrapper.unmount();
    });
    it('should call checkAutoSession if all above are truthy', () => {
      global.window.location.pathname = '/valid-path';
      const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);

      props = {
        ...props,
        profileLoading: false,
        hasCalledKeepAlive: false,
      };
      const wrapper = shallow(<AutoSSO {...props} />);
      stub.restore();
      sinon.assert.calledOnce(stub);
      wrapper.unmount();
    });
  });

  describe('checkKeepAlive', () => {
    it('should call `checkKeepAlive` after `checkAutoSession` resolves', () => {
      props = {
        ...props,
        profileLoading: false,
        hasCalledKeepAlive: false,
      };
      const spy = sinon.spy(props, 'checkKeepAlive');
      const stub = sinon.stub(ssoUtils, 'checkAutoSession').resolves(null);

      const wrapper = shallow(<AutoSSO {...props} />);

      sinon.assert.calledOnce(stub);
      sinon.assert.calledOnce(spy);

      spy.restore();
      stub.restore();
      wrapper.unmount();
    });
  });
});
