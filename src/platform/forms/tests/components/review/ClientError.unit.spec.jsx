// libs
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';

// platform
import createCommonStore from 'platform/startup/store';
import ClientError from 'platform/forms/components/review/ClientError';

// Return fresh objects from templates for use with individual tests
// Default setup: Valid (but empty) form, privacy agreement not set
const createFormConfig = options => ({
  urlPrefix: '/',
  trackingPrefix: 'test-',
  preSubmitInfo: {
    required: true,
    field: 'privacyAgreementAccepted',
    notice: '<div>Notice</div>',
    label: 'I accept the privacy agreement',
    error: 'You must accept the privacy agreement',
  },
  chapters: {
    chapter1: {
      pages: {
        page1: {
          schema: {},
        },
        page2: {
          schema: {},
        },
      },
    },
    chapter2: {
      pages: {
        page3: {
          schema: {},
        },
      },
    },
  },
  ...options,
});

const createForm = options => ({
  submission: {
    hasAttemptedSubmit: false,
    status: false,
  },
  pages: {
    page1: {
      schema: {},
    },
    page2: {
      schema: {},
    },
    page3: {
      schema: {},
    },
  },
  data: {},
  ...options,
});

const createStore = (options = {}) => {
  return createCommonStore({
    form: createForm(options?.form || {}),
  });
};

describe('ClientError component', () => {
  it('should render', () => {
    const formConfig = createFormConfig();
    const goBack = sinon.spy();
    const onSubmit = sinon.spy();

    const store = createStore();

    const tree = render(
      <Provider store={store}>
        <ClientError
          testId="12345"
          formConfig={formConfig}
          goBack={goBack}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    expect(tree.getByTestId('12345')).to.not.be.null;
    tree.unmount();
  });

  it('should submit if Submit application is clicked', () => {
    const formConfig = createFormConfig();
    const goBack = sinon.spy();
    const onSubmit = sinon.spy();

    const store = createStore();

    const tree = render(
      <Provider store={store}>
        <ClientError
          testId="12345"
          formConfig={formConfig}
          goBack={goBack}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    const submitButton = tree.getByText('Submit application');
    fireEvent.click(submitButton);

    expect(onSubmit.called).to.be.true;
    tree.unmount();
  });

  it('should should go back if back button is clicked', () => {
    const formConfig = createFormConfig();
    const goBack = sinon.spy();
    const onSubmit = sinon.spy();

    const store = createStore();

    const tree = render(
      <Provider store={store}>
        <ClientError
          testId="12345"
          formConfig={formConfig}
          goBack={goBack}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    const backButton = tree.getByText('Back');
    fireEvent.click(backButton);

    expect(goBack.called).to.be.true;
    tree.unmount();
  });
});
