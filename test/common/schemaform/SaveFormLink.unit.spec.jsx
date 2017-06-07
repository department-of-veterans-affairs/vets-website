import React from 'react';
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
    login: {
      currentlyLoggedIn: true
    }
  };
  // Define these spies out here because they are only used to satisfy the
  //  prop requirements; they're only passed to LoginModal which we test elsewhere
  const saveFormSpy = sinon.spy();
  const updateLoginSpy = sinon.spy();
  it('should render login message when not logged in', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
          user={user}
          savedStatus={SAVE_STATUSES.notAttempted}
          saveForm={saveFormSpy}
          onUpdateLoginUrl={updateLoginSpy}/>
    );

    expect(tree.text()).to.contain('Sign in before saving your application');
  });
  it('should render save message when logged in', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
          user={loggedInUser}
          savedStatus={SAVE_STATUSES.notAttempted}
          saveForm={saveFormSpy}
          onUpdateLoginUrl={updateLoginSpy}/>
    );

    expect(tree.text()).to.equal('Save and come back later');
  });
  it('should open LoginModal', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <SaveFormLink
          user={user}
          savedStatus={SAVE_STATUSES.notAttempted}
          saveForm={saveFormSpy}
          onUpdateLoginUrl={updateLoginSpy}/>
    );
    const findDOM = findDOMNode(tree);

    // Open the login modal
    findDOM.querySelector('a').click();

    const modal = findDOM.querySelector('.va-modal');

    // Find the login modal
    expect(modal).to.not.be.null;
  });
  it('should call saveForm if logged in', () => {
    saveFormSpy.reset(); // Just because it's good practice for a shared spy
    const tree = ReactTestUtils.renderIntoDocument(
      <div>
        <SaveFormLink
            user={loggedInUser}
            savedStatus={SAVE_STATUSES.notAttempted}
            saveForm={saveFormSpy}
            onUpdateLoginUrl={updateLoginSpy}/>
      </div>
    );
    const findDOM = findDOMNode(tree);

    // "Save" the form
    findDOM.querySelector('a').click();

    expect(saveFormSpy.called);
  });
});
