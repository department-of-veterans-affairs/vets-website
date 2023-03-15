import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import createCommonStore from 'platform/startup/store';
import createSchemaFormReducer from 'platform/forms-system/src/js/state';
import reducers from 'platform/forms-system/src/js/state/reducers';

import Submitted from '../../../../src/js/review/submit-states/Submitted';

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

describe('Schemaform review: <Submitted />', () => {
  it('has a pre-submit section', () => {
    const onBack = sinon.spy();
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
        <Submitted
          formConfig={formConfig}
          onBack={onBack}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    expect(tree.container.querySelector('va-privacy-agreement')).does.exist;

    tree.unmount();
  });

  it('has a back button', () => {
    const onBack = sinon.spy();
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
        <Submitted
          formConfig={formConfig}
          onBack={onBack}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    const backButton = tree.getByText('Back');
    expect(backButton).to.not.be.null;
    fireEvent.click(backButton);
    expect(onBack.called).to.be.true;

    tree.unmount();
  });

  it('has a disabled submitted button', () => {
    const onBack = sinon.spy();
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
        <Submitted
          formConfig={formConfig}
          onBack={onBack}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    const submitButton = tree.getByText('Submitted');
    expect(submitButton).to.not.be.null;
    expect(submitButton).to.have.attribute('disabled');
    expect(submitButton).to.have.attr;
    fireEvent.click(submitButton);
    expect(onBack.called).to.be.false;

    tree.unmount();
  });
});
