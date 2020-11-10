import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import createCommonStore from 'platform/startup/store';
import { testkit } from 'platform/testing/unit/sentry';

import { SubmitController } from '../../../src/js/review/SubmitController';

import createSchemaFormReducer from 'platform/forms-system/src/js/state';
import reducers from 'platform/forms-system/src/js/state/reducers';

import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

const createformReducer = (options = {}) =>
  createSchemaFormReducer(
    options?.formConfig || {},
    options?.formConfig || {},
    reducers,
  );

// Return fresh objects from templates for use with individual tests
// Default setup: Valid (but empty) form, privacy agreement not set
const createFormConfig = options => ({
  urlPrefix: '/',
  trackingPrefix: 'test-',
  prefillEnabled: true,
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
  loadedData: { metadata: { inProgressFormId: '123' } },
  ...options,
});

const createPageList = () => [
  {
    path: 'page-1',
    pageKey: 'page1',
  },
  {
    path: 'page-2',
    pageKey: 'page2',
  },
  {
    path: 'page-3',
    pageKey: 'page3',
  },
];

const createUserLogIn = (status = true) => ({
  login: {
    currentlyLoggedIn: status,
  },
});

const createStore = (options = {}) => {
  return createCommonStore({
    form: createForm(options?.form || {}),
    router: options?.router || {},
  });
};

describe('Schemaform review: SubmitController', () => {
  beforeEach(() => {
    testkit.reset();
  });
  afterEach(() => {
    testkit.reset();
  });
  it('should route to confirmation page after submit', () => {
    const form = createForm();
    const formConfig = createFormConfig();
    const pageList = createPageList();
    const user = createUserLogIn();
    const router = { push: sinon.spy() };
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submitForm = sinon.spy();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <SubmitController
          form={form}
          formConfig={formConfig}
          pageList={[]}
          route={{ formConfig, pageList }}
          router={router}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    tree.rerender(
      <Provider store={store}>
        <SubmitController
          form={createForm({ submission: { status: 'applicationSubmitted' } })}
          formConfig={formConfig}
          pageList={[]}
          route={{ formConfig, pageList }}
          router={router}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    // // BUG: this assumes there is always a confirmation page with this route
    expect(router.push.calledWith('/confirmation')).to.be.true;
    tree.unmount();
  });

  it('should not submit when privacy agreement not accepted', () => {
    const form = createForm();
    const formConfig = createFormConfig();
    const user = createUserLogIn();
    const router = { push: sinon.spy() };
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submitForm = sinon.spy();

    const store = createStore({
      form,
    });

    const tree = render(
      <Provider store={store}>
        <SubmitController
          form={form}
          formConfig={formConfig}
          pageList={[]}
          router={router}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    const submitButton = tree.getByText('Submit application');
    fireEvent.click(submitButton);

    expect(submitForm.called).to.be.false;
    expect(setSubmission.calledWith('hasAttemptedSubmit')).to.be.true;
    tree.unmount();
  });

  it('should not submit when invalid data is entered', () => {
    // Form with missing required field
    const page = {
      title: 'Missing stuff',
      schema: {
        type: 'object',
        required: ['stuff'],
        properties: {
          stuff: { type: 'string' },
        },
      },
    };
    const form = createForm({
      data: { privacyAgreementAccepted: true },
      pages: { page1: { schema: page.schema } },
    });
    const formConfig = createFormConfig({
      chapters: {
        chapter1: {
          pages: {
            page1: page,
          },
        },
      },
    });
    const pageList = [
      { path: 'page-1', pageKey: 'page1', schema: page.schema },
    ];
    const user = createUserLogIn();
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submitForm = sinon.spy();
    const autoSaveForm = sinon.spy();

    const store = createStore({
      form,
    });

    const tree = render(
      <Provider store={store}>
        <SubmitController
          autoSaveForm={autoSaveForm}
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    const submitButton = tree.getByText('Submit application');
    fireEvent.click(submitButton);

    expect(submitForm.called).to.be.false;
    expect(setSubmission.calledWith('hasAttemptedSubmit')).to.be.true;
    expect(setSubmission.calledWith('status', 'validationError')).to.be.true;
    expect(autoSaveForm.called).to.be.true;
    tree.unmount();
  });

  it('should not submit when invalid data is entered, and not call autoSaveForm when not logged in', () => {
    // Form with missing required field
    const page = {
      title: 'Missing stuff',
      schema: {
        type: 'object',
        required: ['stuff'],
        properties: {
          stuff: { type: 'string' },
        },
      },
    };
    const form = createForm({
      data: { privacyAgreementAccepted: true },
      pages: { page1: { schema: page.schema } },
    });
    const formConfig = createFormConfig({
      chapters: {
        chapter1: {
          pages: {
            page1: page,
          },
        },
      },
    });
    const pageList = [
      { path: 'page-1', pageKey: 'page1', schema: page.schema },
    ];
    const user = createUserLogIn(false);
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submitForm = sinon.spy();
    const autoSaveForm = sinon.spy();

    const store = createStore({
      form,
    });

    const tree = render(
      <Provider store={store}>
        <SubmitController
          autoSaveForm={autoSaveForm}
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    const submitButton = tree.getByText('Submit application');
    fireEvent.click(submitButton);

    expect(submitForm.called).to.be.false;
    expect(setSubmission.calledWith('hasAttemptedSubmit')).to.be.true;
    expect(setSubmission.calledWith('status', 'validationError')).to.be.true;
    expect(autoSaveForm.notCalled).to.be.true;
    tree.unmount();
  });

  it('should submit submission error data to Sentry', () => {
    // Form with missing required field
    const page = {
      title: 'Missing stuff',
      schema: {
        type: 'object',
        required: ['stuff'],
        properties: {
          stuff: { type: 'string' },
        },
      },
    };
    const form = createForm({
      data: { privacyAgreementAccepted: true },
      pages: { page1: { schema: page.schema } },
    });
    const formConfig = createFormConfig({
      chapters: {
        chapter1: {
          pages: {
            page1: page,
          },
        },
      },
    });
    const pageList = [
      { path: 'page-1', pageKey: 'page1', schema: page.schema },
    ];
    const user = createUserLogIn();
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submitForm = sinon.spy();
    const autoSaveForm = sinon.spy();

    const store = createStore({
      form,
    });

    const tree = render(
      <Provider store={store}>
        <SubmitController
          autoSaveForm={autoSaveForm}
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    const submitButton = tree.getByText('Submit application');
    fireEvent.click(submitButton);

    expect(submitForm.called).to.be.false;

    const sentryReports = testkit.reports();
    expect(sentryReports.length).to.equal(1);
    expect(sentryReports[0].extra.inProgressFormId).to.equal('123');
    expect(sentryReports[0].extra.prefix).to.equal('test-');
    expect(sentryReports[0].extra.errors)
      .to.be.an('array')
      .with.length('1');
    expect(autoSaveForm.called).to.be.true;

    tree.unmount();
  });

  it('should submit when valid', () => {
    const form = createForm({
      data: { privacyAgreementAccepted: true },
    });
    const formConfig = createFormConfig();
    const pageList = createPageList();
    const user = createUserLogIn();
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submitForm = sinon.spy();
    const autoSaveForm = sinon.spy();

    const store = createStore({
      form,
    });

    const tree = render(
      <Provider store={store}>
        <SubmitController
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          autoSaveForm={autoSaveForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    // tree.find('.usa-button-primary').simulate('click');
    const submitButton = tree.getByText('Submit application');
    fireEvent.click(submitButton);

    expect(submitForm.called).to.be.true;
    expect(autoSaveForm.called).to.be.true;
    tree.unmount();
  });

  it('should submit when valid, but not call autoSaveForm when not logged in', () => {
    const form = createForm({
      data: { privacyAgreementAccepted: true },
    });
    const formConfig = createFormConfig();
    const pageList = createPageList();
    const user = createUserLogIn(false);
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submitForm = sinon.spy();
    const autoSaveForm = sinon.spy();

    const store = createStore({
      form,
    });

    const tree = render(
      <Provider store={store}>
        <SubmitController
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          autoSaveForm={autoSaveForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    // tree.find('.usa-button-primary').simulate('click');
    const submitButton = tree.getByText('Submit application');
    fireEvent.click(submitButton);

    expect(submitForm.called).to.be.true;
    expect(autoSaveForm.notCalled).to.be.true;
    tree.unmount();
  });

  it('should submit when valid and no preSubmit specified', () => {
    const form = createForm();
    const formConfig = createFormConfig({
      preSubmitInfo: undefined,
    });
    const pageList = createPageList();
    const user = createUserLogIn();
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submitForm = sinon.spy();
    const autoSaveForm = sinon.spy();

    const store = createStore({
      form,
    });

    const tree = render(
      <Provider store={store}>
        <SubmitController
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          autoSaveForm={autoSaveForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    const submitButton = tree.getByText('Submit application');
    fireEvent.click(submitButton);

    expect(submitForm.called).to.be.true;
    tree.unmount();
  });

  it('should submit when valid and only preSubmit.notice specified', () => {
    const form = createForm();
    const formConfig = createFormConfig({
      preSubmitInfo: {
        notice: <p className="presubmit-notice">NOTICE</p>,
        required: false,
      },
    });
    const pageList = createPageList();
    const user = createUserLogIn();
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submitForm = sinon.spy();
    const autoSaveForm = sinon.spy();

    const store = createStore({
      form,
    });

    const tree = render(
      <Provider store={store}>
        <SubmitController
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          autoSaveForm={autoSaveForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    const submitButton = tree.getByText('Submit application');
    fireEvent.click(submitButton);

    expect(tree.getByText('NOTICE')).to.not.be.null;
    expect(submitForm.called).to.be.true;
    expect(autoSaveForm.called).to.be.true;

    tree.unmount();
  });

  it('should change the preSubmit value when the checkbox is clicked', () => {
    const form = createForm();
    const formConfig = createFormConfig({
      preSubmitInfo: {
        required: true,
        field: 'yep',
        label: 'Count me in!',
      },
    });
    const pageList = createPageList();
    const user = createUserLogIn();
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submitForm = sinon.spy();

    const formReducer = createformReducer({
      formConfig: form,
    });

    const store = createStore();
    store.injectReducer('form', formReducer);

    const tree = render(
      <Provider store={store}>
        <SubmitController
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    store.dispatch(setPreSubmitAction('yep', true));

    tree.rerender(
      <Provider store={store}>
        <SubmitController
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    expect(store.getState().form.data.yep).to.be.true;
    tree.unmount();
  });

  it('should render a CustomComponent, and override default PreSubmitSection', () => {
    const CustomPreSubmitInfo = () => (
      <>
        <h1 className="custom-preSubmitInfo">Hello from CustomComponent!</h1>
      </>
    );

    const form = createForm();
    const formConfig = createFormConfig({
      preSubmitInfo: {
        required: true,
        CustomComponent: CustomPreSubmitInfo,
      },
    });
    const pageList = createPageList();
    const user = createUserLogIn();
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submission = {
      hasAttemptedSubmit: false,
    };
    const submitForm = sinon.spy();

    const store = createStore({
      form,
    });

    const tree = render(
      <Provider store={store}>
        <SubmitController
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          submission={submission}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    const customComponent = tree.getByText('Hello from CustomComponent!');
    const defaultComponent = tree.queryAllByText(
      'I agree to the terms and conditions.',
    );

    expect(customComponent).to.not.be.null;
    expect(defaultComponent).to.be.an('array').that.is.empty;

    tree.unmount();
  });

  it('should render the PreSubmitSection, and NOT a CustomComponent', () => {
    const form = createForm();
    const formConfig = createFormConfig({
      preSubmitInfo: {
        required: true,
      },
    });
    const pageList = createPageList();
    const user = createUserLogIn();
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submission = {
      hasAttemptedSubmit: false,
    };
    const submitForm = sinon.spy();

    const store = createStore({
      form,
    });

    const tree = render(
      <Provider store={store}>
        <SubmitController
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          submission={submission}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    const customComponent = tree.queryAllByText('Hello from CustomComponent!');
    const defaultComponent = tree.getByText(
      'I agree to the terms and conditions.',
    );

    expect(customComponent).to.be.an('array').that.is.empty;
    expect(defaultComponent).to.not.be.null;

    tree.unmount();
  });

  it('should go back', () => {
    const form = createForm({
      data: { privacyAgreementAccepted: true },
    });
    const formConfig = createFormConfig();
    const pageList = createPageList();
    const user = createUserLogIn();
    const router = { push: sinon.spy() };
    const setPreSubmit = sinon.spy();
    const setSubmission = sinon.spy();
    const submission = {
      hasAttemptedSubmit: false,
    };
    const submitForm = sinon.spy();

    const store = createStore({
      form,
    });

    const tree = render(
      <Provider store={store}>
        <SubmitController
          form={form}
          formConfig={formConfig}
          pageList={pageList}
          route={{ formConfig, pageList }}
          router={router}
          setPreSubmit={setPreSubmit}
          setSubmission={setSubmission}
          submitForm={submitForm}
          submission={submission}
          trackingPrefix={formConfig.trackingPrefix}
          user={user}
        />
      </Provider>,
    );

    // SubmitButtons .usa-button-secondary is the back button
    const backButton = tree.getByText('Back');
    fireEvent.click(backButton);

    // BUG: The code is making a bunch of bogus assumptions about routes
    // and pages since it always adds review and confirmation routes.
    expect(router.push.calledWith('page-2')).to.be.true;
    tree.unmount();
  });
});
