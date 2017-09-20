import React from 'react';
import _ from 'lodash/fp';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import SaveFormLink from '../../../src/js/common/schemaform/SaveFormLink';
import { SAVE_STATUSES } from '../../../src/js/common/schemaform/save-load-actions';

describe('Schemaform <SaveFormLink>', () => {
  const user = {
    login: {
      currentlyLoggedIn: false
    }
  };
  const loggedInUser = {
    profile: {
      userFullName: 'something'
    },
    login: {
      currentlyLoggedIn: true
    }
  };
  const form = {
    formId: 'test',
    version: 1,
    data: {},
    trackingPrefix: 'test-',
    savedStatus: SAVE_STATUSES.notAttempted
  };
  // Define these spies out here because they are only used to satisfy the
  //  prop requirements; they're only passed to LoginModal which we test elsewhere
  const saveInProgressForm = sinon.spy();
  const updateLoginSpy = sinon.spy();
  it('should render login message when not logged in', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
        user={user}
        form={form}
        onUpdateLoginUrl={updateLoginSpy}/>
    );

    expect(tree.text()).to.contain('Finish this application later');
  });
  it('should render expired message when not logged in and noAuth status', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
        user={user}
        form={_.assign(form, { savedStatus: SAVE_STATUSES.noAuth })}
        onUpdateLoginUrl={updateLoginSpy}/>
    );

    expect(tree.text()).to.contain('Sorry, you’re signed out.');
    expect(tree.subTree('a')).not.to.be.null;
  });
  it('should render save message when logged in', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
        user={loggedInUser}
        form={form}
        onUpdateLoginUrl={updateLoginSpy}/>
    );

    expect(tree.text()).to.contain('Finish this application later');
  });
  it('should show error message', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
        user={user}
        form={_.assign(form, { savedStatus: SAVE_STATUSES.failure })}
        onUpdateLoginUrl={updateLoginSpy}/>
    );

    expect(tree.text()).to.contain('having some issues');
    expect(tree.subTree('button').text()).to.contain('Finish this application later');
  });
  it('should show client error message', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
        user={user}
        form={_.assign(form, { savedStatus: SAVE_STATUSES.clientFailure })}
        onUpdateLoginUrl={updateLoginSpy}/>
    );

    expect(tree.text()).to.contain('connect to Vets.gov');
    expect(tree.subTree('button').text()).to.contain('Finish this application later');
  });
  it('should open LoginModal', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <SaveFormLink
        user={user}
        form={form}
        onUpdateLoginUrl={updateLoginSpy}/>
    );
    const findDOM = findDOMNode(tree);

    // Modal uses document.querySelector, so we have to bind it to the formDOM
    //  to actually get the right result.
    const oldQuerySelector = document.querySelector;
    document.querySelector = findDOM.querySelector.bind(findDOM);

    // Open the login modal
    // NOTE: I'm not sure why we have to use ReactTestUtils.Simulate.click() here,
    //  but just querying for the link and .click()ing it didn't call SaveFormLink's
    //  openLoginModal().
    ReactTestUtils.Simulate.click(findDOM.querySelector('button'));

    // Reset it for subsequent tests
    document.querySelector = oldQuerySelector;

    const modal = findDOM.querySelector('.va-modal');

    // Find the login modal
    expect(modal).to.not.be.null;
  });
  it('should call saveInProgressForm if logged in', () => {
    saveInProgressForm.reset(); // Just because it's good practice for a shared spy
    const tree = ReactTestUtils.renderIntoDocument(
      // Wrapped in a div because I SaveFormLink only returns an anchor and I
      //  didn't want to just .click() the tree (if that would even work).
      <div>
        <SaveFormLink
          user={loggedInUser}
          form={form}
          saveInProgressForm={saveInProgressForm}
          onUpdateLoginUrl={updateLoginSpy}/>
      </div>
    );
    const findDOM = findDOMNode(tree);

    // "Save" the form
    findDOM.querySelector('button').click();

    expect(saveInProgressForm.called);
  });
});
