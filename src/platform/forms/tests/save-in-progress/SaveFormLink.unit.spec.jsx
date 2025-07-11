import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from '../../../forms-system/src/js/utilities/ui';
import SaveFormLink from '../../save-in-progress/SaveFormLink';
import { SAVE_STATUSES } from '../../save-in-progress/actions';

describe('Schemaform <SaveFormLink>', () => {
  const loggedOutUser = {
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

  const props = ({
    data = {},
    savedStatus = SAVE_STATUSES.notAttempted,
    saveAndRedirectToReturnUrl = () => {},
    saveInProgressForm = () => {},
    user = loggedInUser,
  } = {}) => ({
    user,
    form: {
      formId: 'test',
      version: 1,
      data,
      trackingPrefix: 'test-',
      savedStatus,
      submission: {},
      locationPathname: '/test',
    },
    formConfig: {
      rootUrl: '',
    },
    saveAndRedirectToReturnUrl,
    saveInProgressForm,
    toggleLoginModal: () => {},
  });

  it('should not render save message when not logged in', () => {
    const { container } = render(
      <SaveFormLink {...props({ user: loggedOutUser })} />,
    );
    expect(container.textContent).to.be.empty;
  });

  it('should render finish message when logged in', () => {
    const { container } = render(<SaveFormLink {...props()} />);
    expect(container.textContent).to.contain('Finish this application later');
  });

  it('should render overridden save message when prop is passed', () => {
    const { container } = render(
      <SaveFormLink {...props()}>Test</SaveFormLink>,
    );
    expect(container.textContent).to.contain('Test');
  });

  it('should show error message', () => {
    const { container } = render(
      <SaveFormLink {...props({ savedStatus: SAVE_STATUSES.failure })} />,
    );
    expect(container.textContent).to.contain('Something went wrong');
    expect($('.schemaform-sip-save-link', container).textContent).to.contain(
      'Finish this application later',
    );
  });

  it('should show client error message', () => {
    const { container } = render(
      <SaveFormLink {...props({ savedStatus: SAVE_STATUSES.clientFailure })} />,
    );

    expect(container.textContent).to.contain('unable to connect');
    expect($('.schemaform-sip-save-link', container).textContent).to.contain(
      'Finish this application later',
    );
  });

  it('should render expired message with noAuth status', () => {
    const { container } = render(
      <SaveFormLink {...props({ savedStatus: SAVE_STATUSES.noAuth })} />,
    );

    const signInButton = $('.va-button-link', container);

    expect(container.textContent).to.contain('Sorry, you’re signed out.');
    expect(signInButton).to.exist;
    expect(signInButton.textContent).to.contain('sign in');
  });

  it('should call saveAndRedirectToReturnUrl and include returnUrl from page config if logged in', () => {
    const saveAndRedirectToReturnUrl = sinon.spy();
    const route = {
      pageConfig: {
        pageKey: 'testPage',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: '',
        returnUrl: '/testing2',
      },
      pageList: [
        {
          path: 'testing',
        },
      ],
    };
    const { container } = render(
      <div>
        <SaveFormLink
          {...props({ saveAndRedirectToReturnUrl })}
          route={route}
        />
      </div>,
    );

    // "Save" the form
    fireEvent.click($('.schemaform-sip-save-link', container));

    expect(saveAndRedirectToReturnUrl.called);
    expect(saveAndRedirectToReturnUrl.args[0][3]).to.eq('/testing2');
  });

  it('should call pageConfig and formConfig onFormExit callbacks before redirecting', () => {
    const saveAndRedirectToReturnUrl = sinon.spy();
    const exitSpy = sinon.spy();
    const exitCallback = data => {
      const alteredData = { ...data, testIndex: data.testIndex + 1 };
      exitSpy(alteredData);
      return alteredData;
    };
    const route = {
      pageConfig: {
        pageKey: 'testPage',
        schema: {},
        uiSchema: {},
        errorMessages: {},
        title: '',
        returnUrl: '/testing2',
        onFormExit: exitCallback,
      },
      pageList: [
        {
          path: 'testing',
        },
      ],
    };
    render(
      <div>
        <SaveFormLink
          {...props({
            data: { testIndex: 0 },
            saveAndRedirectToReturnUrl,
          })}
          route={route}
          formConfig={{ rootUrl: '', onFormExit: exitCallback }}
        />
      </div>,
    );

    // "Save" the form
    fireEvent.click($('.schemaform-sip-save-link'));

    expect(exitSpy.firstCall.args[0]).to.deep.equal({ testIndex: 1 });
    expect(exitSpy.secondCall.args[0]).to.deep.equal({ testIndex: 2 });

    expect(saveAndRedirectToReturnUrl.called);
    expect(saveAndRedirectToReturnUrl.args[0][1]).to.deep.equal({
      testIndex: 2,
    });
  });

  it('should call saveInProgressForm if logged in', () => {
    const saveInProgressForm = sinon.spy();
    const { container } = render(
      // Wrapped in a div because I SaveFormLink only returns an anchor and I
      //  didn't want to just .click() the tree (if that would even work).
      <div>
        <SaveFormLink {...props({ saveInProgressForm })} />
      </div>,
    );

    // "Save" the form
    fireEvent.click($('.schemaform-sip-save-link', container));

    expect(saveInProgressForm.called);
  });
});
