import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';

import LoginModal from '../../../src/js/common/components/LoginModal';


let oldWindow;
let oldFetch;
const response = {
  json: () => {
    return {
      authenticate_via_get: true // eslint-disable-line camelcase
    };
  }
};
let fetchPromise;

const setup = () => {
  oldFetch = global.fetch;
  oldWindow = global.window;
  fetchPromise = Promise.resolve(response); // Reset it every time.

  global.fetch = sinon.spy(() => {
    return fetchPromise;
  });
  global.window = {
    dataLayer: [],
    open: sinon.spy(() => {
      return { focus: sinon.stub() };
    })
  };
};
const teardown = () => {
  global.window = oldWindow;
  global.fetch = oldFetch;
};

describe('<LoginModal>', () => {
  // Don't need this for each test, so I'm calling them in just the tests I need
  // beforeEach(setup);
  // afterEach(teardown);

  const user = {
    login: {
      currentlyLoggedIn: false,
      loginUrl: 'login/url'
    }
  };
  const onCloseSpy = sinon.spy();
  const updateLoginSpy = sinon.spy();
  it('should render', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <LoginModal
        user={user}
        visible
        onClose={onCloseSpy}
        onUpdateLoginUrl={updateLoginSpy}/>
    );
    const findDOM = findDOMNode(tree);

    // 3 buttons: sign in, cancel, close modal
    expect(findDOM.querySelectorAll('button').length).to.equal(3);
  });
  it('should be hidden when not visible', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <LoginModal
        user={user}
        visible={false}
        onClose={onCloseSpy}
        onUpdateLoginUrl={updateLoginSpy}/>
    );
    const findDOM = findDOMNode(tree);

    // 3 buttons: sign in, cancel, close modal
    expect(findDOM.querySelectorAll('button')).to.be.empty;
  });
  it('should render a title', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <LoginModal
        user={user}
        visible
        onClose={onCloseSpy}
        onUpdateLoginUrl={updateLoginSpy}
        title="Some title"/>
    );
    const findDOM = findDOMNode(tree);

    // 3 buttons: sign in, cancel, close modal
    expect(findDOM.querySelector('h3').textContent).to.equal('Some title');
  });
  it('should attempt to login', () => {
    setup();
    const tree = ReactTestUtils.renderIntoDocument(
      <LoginModal
        user={user}
        visible
        onClose={onCloseSpy}
        onUpdateLoginUrl={updateLoginSpy}
        title="Some title"/>
    );
    const findDOM = findDOMNode(tree);

    // Poke the button!
    ReactTestUtils.Simulate.click(findDOM.querySelector('.usa-button-primary'));

    expect(global.window.open.args[0][0]).to.contain('login');
    expect(global.window.open.calledOnce).to.be.true;
    expect(global.window.dataLayer).to.eql([
      { event: 'login-link-clicked' },
      { event: 'login-link-opened' }
    ]);

    teardown();
  });

  it('should call onLogin after a successful login', () => {
    const loginSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <LoginModal
        user={user}
        visible
        onClose={onCloseSpy}
        onUpdateLoginUrl={updateLoginSpy}
        title="Some title"
        onLogin={loginSpy}/>
    );

    const instance = tree.getMountedInstance();
    instance.loginButtonClicked = true;
    instance.componentWillReceiveProps({
      user: {
        login: {
          currentlyLoggedIn: true
        }
      }
    });

    expect(loginSpy.called).to.be.true;
    expect(instance.loginButtonClicked).to.be.false;
    expect(onCloseSpy.called).to.be.true;
  });
});
