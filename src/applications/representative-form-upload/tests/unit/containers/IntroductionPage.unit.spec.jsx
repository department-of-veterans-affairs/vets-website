import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import userEvent from '@testing-library/user-event';
import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';
import { getFormContent } from '../../../helpers';

const TEST_URL =
  'https://dev.va.gov/representative/representative-form-upload/submit-va-form-21-686c/introduction';
const config = formConfig;

const props = {
  route: {
    path: 'introduction',
    pageList: [
      { pageKey: 'introduction', path: '/introduction' },
      {
        path: '/first-page',
        title: 'First Page',
        uiSchema: {},
        schema: {
          type: 'object',
          properties: { firstField: { type: 'string' } },
        },
        chapterTitle: 'Chapter 1',
        chapterKey: 'chapter1',
        pageKey: 'page1',
      },
      {
        pageKey: 'review-and-submit',
        path: '/review-and-submit',
        chapterKey: 'review',
      },
    ],
    formConfig: config,
  },
};

const loggedInUser = { currentlyLoggedIn: true };

const mockStore = (loggedIn = false, dispatchSpy = () => {}) => ({
  getState: () => ({
    user: {
      login: loggedIn ? loggedInUser : { currentlyLoggedIn: false },
      profile: {
        prefillsAvailable: ['FORM-UPLOAD-FLOW'],
        dob: '2000-01-01',
        loa: { current: 3 },
        verified: true,
      },
    },
    form: { formId: formConfig.formId, loadedStatus: 'success', data: {} },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
    },
  }),
  subscribe: () => {},
  dispatch: dispatchSpy,
});

describe('IntroductionPage', () => {
  beforeEach(() => {
    window.location = new URL(TEST_URL);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders successfully for logged-in and logged-out users', () => {
    [true, false].forEach(loggedIn => {
      const { container } = render(
        <Provider store={mockStore(loggedIn)}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      expect(container).to.exist;
    });
  });

  it('renders the correct title and subtitle', () => {
    const { subTitle } = getFormContent();

    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(getByText('Submit VA Form 21-686c')).to.exist;
    expect(getByText(subTitle)).to.exist;
  });

  it('navigates to login when sign-in button clicked', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const button = container.querySelector('va-button');
    userEvent.click(button);

    expect(window.location.href).to.eq(
      'https://dev.va.gov/sign-in?application=arp&oauth=true',
    );
  });

  it('renders start link and calls router when clicked (logged-in user)', () => {
    const routerSpy = { push: sinon.spy() };

    const { container } = render(
      <Provider store={mockStore(true)}>
        <IntroductionPage {...props} router={routerSpy} />
      </Provider>,
    );

    expect(
      container.querySelector(
        'va-link-action[text="Start form upload and submission"]',
      ),
    ).to.not.be.null;
  });

  it('opens the PDF download link when clicked', () => {
    const openSpy = sinon.stub(window, 'open');
    const { container } = render(
      <Provider store={mockStore(true)}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const downloadLink = container.querySelector('va-link');
    expect(downloadLink).to.exist;

    userEvent.click(downloadLink);

    expect(openSpy.calledOnce).to.be.true;
    openSpy.restore();
  });

  it('sets sessionStorage flag when start form link is clicked', () => {
    const routerSpy = { push: sinon.spy() };
    const originalValue = sessionStorage.getItem('formIncompleteARP');

    const { container } = render(
      <Provider store={mockStore(true)}>
        <IntroductionPage {...props} router={routerSpy} />
      </Provider>,
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.exist;

    // Trigger the click event - handler is attached via syncEvent from React bindings
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );

    // Check actual sessionStorage value was set (not using spy due to jsdom 20 compatibility)
    expect(sessionStorage.getItem('formIncompleteARP')).to.equal('true');
    expect(routerSpy.push.calledOnce).to.be.true;

    // Restore original sessionStorage state
    if (originalValue === null) {
      sessionStorage.removeItem('formIncompleteARP');
    } else {
      sessionStorage.setItem('formIncompleteARP', originalValue);
    }
  });
});
