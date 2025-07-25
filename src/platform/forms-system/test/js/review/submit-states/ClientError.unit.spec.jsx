// libs
import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import createCommonStore from 'platform/startup/store';
import createSchemaFormReducer from 'platform/forms-system/src/js/state';
import reducers from 'platform/forms-system/src/js/state/reducers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ClientError from '../../../../src/js/review/submit-states/ClientError';

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

const getFormConfig = (useWebComponents = false) => ({
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
  formOptions: {
    useWebComponentForNavigation: useWebComponents,
  },
});

describe('Schemaform review: <ClientError />', () => {
  context('with React components', () => {
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
          <ClientError
            buttonText="test"
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
          <ClientError
            buttonText="test"
            formConfig={formConfig}
            onBack={onBack}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      expect(tree.container.querySelector('va-privacy-agreement')).does.exist;

      tree.unmount();
    });

    it('has an enabled submit button', () => {
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
          <ClientError
            buttonText="custom text"
            formConfig={formConfig}
            onBack={onBack}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      const submitButton = tree.getByText('custom text');
      expect(submitButton).to.not.be.null;
      expect(submitButton).to.not.have.attribute('disabled');
      expect(submitButton).to.have.attr;
      fireEvent.click(submitButton);
      expect(onBack.called).to.be.false;

      tree.unmount();
    });

    it('has the expected error message', () => {
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
          <ClientError
            buttonText="test"
            formConfig={formConfig}
            onBack={onBack}
            onSubmit={onSubmit}
            testId="12345"
          />
        </Provider>,
      );

      expect(
        tree.getByText('Please check your Internet connection and try again.'),
      ).to.not.be.null;
      expect(tree.getByTestId('12345')).to.have.attribute('role', 'alert');

      tree.unmount();
    });
  });

  context('with Web components', () => {
    const useWebComponents = true;
    it('has a back button', () => {
      const onBack = sinon.spy();
      const onSubmit = sinon.spy();

      const form = createForm();
      const formConfig = getFormConfig(useWebComponents);

      const formReducer = createformReducer({
        formConfig: form,
      });

      const store = createStore();
      store.injectReducer('form', formReducer);

      const tree = render(
        <Provider store={store}>
          <ClientError
            buttonText="test"
            formConfig={formConfig}
            onBack={onBack}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      const backButton = $('va-button[text="Back"]', tree.container);
      expect(backButton).to.not.be.null;
      fireEvent.click(backButton);
      expect(onBack.called).to.be.true;

      tree.unmount();
    });

    it('has a pre-submit section', () => {
      const onBack = sinon.spy();
      const onSubmit = sinon.spy();

      const form = createForm();
      const formConfig = getFormConfig(useWebComponents);

      const formReducer = createformReducer({
        formConfig: form,
      });

      const store = createStore();
      store.injectReducer('form', formReducer);

      const tree = render(
        <Provider store={store}>
          <ClientError
            buttonText="test"
            formConfig={formConfig}
            onBack={onBack}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      expect($('va-privacy-agreement', tree.container)).does.exist;

      tree.unmount();
    });

    it('has an enabled submit button', () => {
      const onBack = sinon.spy();
      const onSubmit = sinon.spy();

      const form = createForm();
      const formConfig = getFormConfig(useWebComponents);

      const formReducer = createformReducer({
        formConfig: form,
      });

      const store = createStore();
      store.injectReducer('form', formReducer);

      const tree = render(
        <Provider store={store}>
          <ClientError
            buttonText="custom text"
            formConfig={formConfig}
            onBack={onBack}
            onSubmit={onSubmit}
          />
        </Provider>,
      );

      const submitButton = $('va-button[text="custom text"]', tree.container);
      expect(submitButton).to.not.be.null;
      expect(submitButton).to.not.have.attribute('disabled');
      expect(submitButton).to.have.attr;
      fireEvent.click(submitButton);
      expect(onBack.called).to.be.false;

      tree.unmount();
    });

    it('has the expected error message', () => {
      const onBack = sinon.spy();
      const onSubmit = sinon.spy();

      const form = createForm();
      const formConfig = getFormConfig(useWebComponents);

      const formReducer = createformReducer({
        formConfig: form,
      });

      const store = createStore();
      store.injectReducer('form', formReducer);

      const tree = render(
        <Provider store={store}>
          <ClientError
            buttonText="test"
            formConfig={formConfig}
            onBack={onBack}
            onSubmit={onSubmit}
            testId="12345"
          />
        </Provider>,
      );

      expect(
        tree.getByText('Please check your Internet connection and try again.'),
      ).to.not.be.null;
      expect(tree.getByTestId('12345')).to.have.attribute('role', 'alert');

      tree.unmount();
    });
  });
});
