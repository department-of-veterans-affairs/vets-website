import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

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

const setup = () => {
  oldFetch = global.fetch;
  oldWindow = global.window;

  global.fetch = sinon.spy(() => {
    return Promise.resolve(response);
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
    expect(findDOM.querySelector('h1').textContent).to.equal('Some title');
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

    // Not exactly definitive tests...and possibly brittle...
    // url called to get a new user session
    expect(global.fetch.args[0][0]).to.contain('/v0/sessions/new?level=1');
    expect(global.window.open.calledOnce).to.be.true;
    expect(global.window.dataLayer).to.eql([
      { event: 'login-link-clicked' },
      { event: 'login-link-opened' }
    ]);

    teardown();
  });
});
