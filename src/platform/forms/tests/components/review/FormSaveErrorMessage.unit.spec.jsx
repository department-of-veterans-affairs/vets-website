// libs
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

// platform
import createCommonStore from 'platform/startup/store';
import FormSaveErrorMessage from 'platform/forms/components/review/FormSaveErrorMessage';

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

describe('FormSaveErrorMessage component', () => {
  it('should render', () => {
    const formConfig = createFormConfig();
    const store = createStore();

    const tree = render(
      <Provider store={store}>
        <FormSaveErrorMessage testId="12345" formConfig={formConfig} />
      </Provider>,
    );

    expect(
      tree.getByText(
        'We’re sorry. We can’t submit your application right now.',
      ),
    ).to.not.be.null;

    tree.unmount();
  });

  it('should render a custom error', () => {
    const formConfig = createFormConfig({
      submissionError: () => <div data-testid={'12345'} />,
    });
    const goBack = sinon.spy();
    const onSubmit = sinon.spy();
    const saveAndRedirectToReturnUrl = sinon.spy();
    const toggleLoginModal = sinon.spy();

    const store = createStore();

    const tree = render(
      <Provider store={store}>
        <FormSaveErrorMessage
          testId="12345"
          formConfig={formConfig}
          goBack={goBack}
          hasSaveError={false}
          location={{}}
          onSubmit={onSubmit}
          saveAndRedirectToReturnUrl={saveAndRedirectToReturnUrl}
          toggleLoginModal={toggleLoginModal}
        />
      </Provider>,
    );

    expect(tree.getByTestId('12345')).to.not.be.null;

    tree.unmount();
  });
});
