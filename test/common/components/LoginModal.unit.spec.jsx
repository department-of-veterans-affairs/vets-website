import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import LoginModal from '../../../src/js/common/components/LoginModal';

describe('<LoginModal>', () => {
  const user = {
    login: {
      currentlyLoggedIn: false,
      loginUrl: 'login/url'
    }
  };
  const loggedInUser = {
    login: {
      currentlyLoggedIn: true
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
});
