// libs
import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import createCommonStore from 'platform/startup/store';
import createSchemaFormReducer from 'platform/forms-system/src/js/state';
import reducers from 'platform/forms-system/src/js/state/reducers';

import GenericError from 'platform/forms-system/src/js/review/submit-states/GenericError';

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
    router: options?.router || {},
  });
};

const createformReducer = (options = {}) =>
  createSchemaFormReducer(
    options?.formConfig || {},
    options?.formConfig || {},
    reducers,
  );

const getFormConfig = (options = {}) => ({
  ariaDescribedBySubmit: '22-0994-submit-application',
  preSubmitInfo: {
    required: true,
    field: 'privacyAgreementAccepted',
    notice: '<div>Notice</div>',
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

describe('Schemaform review: <GenericError />', () => {
  it('has a pre-submit section', () => {
    const onSubmit = sinon.spy();

    const form = createForm();
    const formConfig = getFormConfig();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <GenericError
          appType="test"
          formConfig={formConfig}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    expect(tree.container.querySelector('va-privacy-agreement')).does.exist;
  });

  it('the "submit again" button appears in dev mode', () => {
    const onSubmit = sinon.spy();

    const form = createForm();
    const formConfig = getFormConfig();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <GenericError
          appType="test"
          formConfig={formConfig}
          onSubmit={onSubmit}
          testId="12345"
        />
      </Provider>,
    );

    const submitButton = tree.getByText('Submit again');
    expect(submitButton).to.not.be.null;
    fireEvent.click(submitButton);
    expect(onSubmit.called).to.be.true;

    tree.unmount();
  });

  it('has the expected error in prod mode', () => {
    const buildtype = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const onSubmit = sinon.spy();

    const form = createForm();
    const formConfig = getFormConfig();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <GenericError
          appType="test"
          formConfig={formConfig}
          onSubmit={onSubmit}
          testId="12345"
        />
      </Provider>,
    );

    expect(tree.getByTestId('12345')).to.have.attribute('role', 'alert');
    expect(tree.getByText('Go Back to VA.gov')).to.not.be.null;

    tree.unmount();

    // Reset buildtype
    process.env.NODE_ENV = buildtype;
  });

  it('renders custom error element', () => {
    const onSubmit = sinon.spy();

    const form = createForm();
    const formConfig = getFormConfig();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <GenericError
          appType="test"
          formConfig={formConfig}
          onSubmit={onSubmit}
          testId="12345"
        />
      </Provider>,
    );

    expect(
      tree.getByText(
        'We’re sorry. We can’t submit your application right now.',
      ),
    ).to.not.be.null;

    tree.unmount();
  });

  it('renders default non save-in-progress error', () => {
    const onSubmit = sinon.spy();

    const form = createForm();
    const formConfig = getFormConfig({ disableSave: true });

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <GenericError
          appType="test"
          formConfig={formConfig}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    expect(tree.getByText('We’re sorry, the test didn’t go through.')).to.not.be
      .null;

    tree.unmount();
  });

  it('renders custom non save-in-progress error', () => {
    const onSubmit = sinon.spy();

    const form = createForm();
    const formConfig = getFormConfig({
      disableSave: true,
      submissionError: () => <div>Custom Error Message</div>,
    });

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <GenericError
          appType="test"
          formConfig={formConfig}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    expect(tree.getByText('Custom Error Message')).to.not.be.null;

    tree.unmount();
  });
});
