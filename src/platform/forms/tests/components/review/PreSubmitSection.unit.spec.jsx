// libs
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';

import createCommonStore from 'platform/startup/store';
import createSchemaFormReducer from 'platform/forms-system/src/js/state';
import reducers from 'platform/forms-system/src/js/state/reducers';

import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';

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

describe('Review PreSubmitSection component', () => {
  it('should render', () => {
    const form = createForm();
    const formConfig = getFormConfig();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const { container } = render(
      <Provider store={store}>
        <PreSubmitSection formConfig={formConfig} />
      </Provider>,
    );

    expect(container.querySelector('va-privacy-agreement')).does.exist;
  });

  it('should render save link', () => {
    const form = createForm();
    const formConfig = getFormConfig();

    const store = {
      getState: () => ({
        form,
        user: { login: { currentlyLoggedIn: true } },
        location: { pathname: '/review-and-submit' },
        navigation: { showLoginModal: false },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const tree = render(
      <Provider store={store}>
        <PreSubmitSection formConfig={formConfig} />
      </Provider>,
    );

    expect(tree.getByText('Finish this application later')).to.exist;

    tree.unmount();
  });
  it('should render a custom save link', () => {
    const form = createForm();
    const formConfig = {
      ...getFormConfig(),
      customText: {
        finishAppLaterMessage: 'custom save link',
      },
    };
    const store = {
      getState: () => ({
        form,
        user: { login: { currentlyLoggedIn: true } },
        location: { pathname: '/review-and-submit' },
        navigation: { showLoginModal: false },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const tree = render(
      <Provider store={store}>
        <PreSubmitSection formConfig={formConfig} />
      </Provider>,
    );

    expect(tree.getByText('custom save link')).to.exist;

    tree.unmount();
  });

  it('should render a CustomComponent', () => {
    const form = createForm({
      submission: {
        hasAttemptedSubmit: true,
      },
    });
    const formConfig = getFormConfig({
      preSubmitInfo: {
        required: true,
        field: 'privacyAgreementAccepted',
        notice: '<div>Notice</div>',
        CustomComponent: () => (
          <div data-testid="12345">i am custom component</div>
        ),
      },
    });

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <PreSubmitSection formConfig={formConfig} />
      </Provider>,
    );

    expect(tree.getByTestId('12345')).to.not.be.null;
    expect(tree.container.innerHTML).to.eq(
      '<div data-testid="12345">i am custom component</div><div class="vads-u-margin-top--4"></div>',
    );

    tree.unmount();
  });

  it('should render presubmit error', () => {
    const form = createForm({
      submission: {
        hasAttemptedSubmit: true,
      },
    });
    const formConfig = getFormConfig();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <PreSubmitSection formConfig={formConfig} showPreSubmitError />
      </Provider>,
    );

    expect(
      tree.container
        .querySelector('va-privacy-agreement')
        .getAttribute('show-error'),
    ).to.equal('You must accept the agreement before submitting.');
  });

  it('should render statement of truth', () => {
    const form = createForm({
      data: {
        veteran: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      },
    });
    const formConfig = getFormConfig({
      preSubmitInfo: {
        statementOfTruth: {
          body: 'Test',
        },
      },
    });

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <PreSubmitSection formConfig={formConfig} />
      </Provider>,
    );

    expect(tree.container.querySelector('h3').innerHTML).to.equal(
      'Statement of truth',
    );

    tree.unmount();
  });
});
