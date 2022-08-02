import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import SaveFormLink from '../../save-in-progress/SaveFormLink';
import { SAVE_STATUSES } from '../../save-in-progress/actions';

describe('Schemaform <SaveFormLink>', () => {
  const user = {
    login: {
      currentlyLoggedIn: false,
    },
  };
  const loggedInUser = {
    profile: {
      userFullName: 'something',
    },
    login: {
      currentlyLoggedIn: true,
    },
  };
  const form = {
    formId: 'test',
    version: 1,
    data: {},
    trackingPrefix: 'test-',
    savedStatus: SAVE_STATUSES.notAttempted,
  };
  const formConfig = {
    rootUrl: '',
  };
  // Define these spies out here because they are only used to satisfy the
  //  prop requirements; they're only passed to LoginModal which we test elsewhere
  const saveInProgressForm = sinon.spy();
  const toggleLoginModalSpy = sinon.spy();
  it('should not render save message when not logged in', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
        user={user}
        form={form}
        toggleLoginModal={toggleLoginModalSpy}
      />,
    );

    expect(tree.text()).to.be.empty;
  });
  it('should render finish message when logged in', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink user={loggedInUser} form={form} formConfig={formConfig} />,
    );

    expect(tree.text()).to.contain('Finish this application later');
  });
  it('should render save message when logged in', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
        user={loggedInUser}
        form={form}
        toggleLoginModal={toggleLoginModalSpy}
        formConfig={formConfig}
      />,
    );

    expect(tree.text()).to.contain('Finish this application later');
  });
  it('should render overridden save message when prop is passed', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
        user={loggedInUser}
        form={form}
        toggleLoginModal={toggleLoginModalSpy}
        formConfig={formConfig}
      >
        Test
      </SaveFormLink>,
    );

    expect(tree.text()).to.contain('Test');
  });
  it('should show error message', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
        user={loggedInUser}
        form={{ ...form, savedStatus: SAVE_STATUSES.failure }}
        toggleLoginModal={toggleLoginModalSpy}
        formConfig={formConfig}
      />,
    );

    expect(tree.text()).to.contain('Something went wrong');
    expect(tree.subTree('.schemaform-sip-save-link').text()).to.contain(
      'Finish this application later',
    );
  });
  it('should show client error message', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
        user={loggedInUser}
        form={{ ...form, savedStatus: SAVE_STATUSES.clientFailure }}
        toggleLoginModal={toggleLoginModalSpy}
        formConfig={formConfig}
      />,
    );

    expect(tree.text()).to.contain('unable to connect');
    expect(tree.subTree('.schemaform-sip-save-link').text()).to.contain(
      'Finish this application later',
    );
  });
  it('should render expired message with noAuth status', () => {
    const tree = SkinDeep.shallowRender(
      <SaveFormLink
        user={loggedInUser}
        form={{ ...form, savedStatus: SAVE_STATUSES.noAuth }}
        toggleLoginModal={toggleLoginModalSpy}
        formConfig={formConfig}
      />,
    );

    expect(tree.text()).to.contain('Sorry, you’re signed out.');
    expect(tree.subTree('a')).not.to.be.null;
  });
  it.skip('should call saveInProgressForm if logged in', () => {
    saveInProgressForm.reset(); // Just because it's good practice for a shared spy
    const tree = ReactTestUtils.renderIntoDocument(
      // Wrapped in a div because I SaveFormLink only returns an anchor and I
      //  didn't want to just .click() the tree (if that would even work).
      <div>
        <SaveFormLink
          user={loggedInUser}
          form={form}
          saveInProgressForm={saveInProgressForm}
          toggleLoginModal={toggleLoginModalSpy}
          formConfig={formConfig}
        />
      </div>,
    );
    const findDOM = findDOMNode(tree);

    // "Save" the form
    findDOM.querySelector('.schemaform-sip-save-link').click();

    expect(saveInProgressForm.called);
  });
});
