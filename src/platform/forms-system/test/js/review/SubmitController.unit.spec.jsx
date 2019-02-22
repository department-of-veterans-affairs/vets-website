import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { SubmitController } from '../../../src/js/review/SubmitController';

// Return fresh objects from templates for use with individual tests
// Default setup: Valid (but empty) form, privacy agreement not set
const createFormConfig = options => ({
  urlPrefix: '/',
  preSubmitInfo: {
    required: true,
    field: 'privacyAgreementAccepted',
    notice: '<div>Notice</div>',
    label: 'I accept the privacy agreement',
    error: 'You must accept the privacy agreement'
  },
  chapters: {
    chapter1: {
      pages: {
        page1: {
          schema: {}
        },
        page2: {
          schema: {}
        }
      }
    },
    chapter2: {
      pages: {
        page3: {
          schema: {}
        }
      }
    }
  },
  ...options
});

const createForm = options => ({
  submission: {
    hasAttemptedSubmit: false,
    status: false
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
    }
  },
  data: {},
  ...options
});

const createPageList = () => ([
  {
    path: 'page-1',
    pageKey: 'page1'
  },
  {
    path: 'page-2',
    pageKey: 'page2'
  },
  {
    path: 'page-3',
    pageKey: 'page3'
  }
]);

const createPagesByChapter = () => ({
  chapter1: [
    {
      chapterKey: 'chapter1',
      pageKey: 'page1'
    },
    {
      chapterKey: 'chapter1',
      pageKey: 'page2'
    }
  ],
  chapter2: [
    {
      chapterKey: 'chapter2',
      pageKey: 'page3'
    }
  ]
});

describe('Schemaform review: SubmitController', () => {
  it('should route to confirmation page after submit', () => {
    const formConfig = createFormConfig();
    const form = createForm();
    const pageList = createPageList();
    const router = { push: sinon.spy() };

    const tree = shallow(
      <SubmitController
        form={form}
        formConfig={formConfig}
        route={{ formConfig, pageList }}
        router={router}/>
    );

    tree.setProps({
      route: {},
      formConfig,
      form: createForm({
        submission: { status: 'applicationSubmitted' },
        data: { privacyAgreementAccepted: true }
      })
    });

    // BUG: this assumes there is always a confirmation page with this route
    expect(router.push.calledWith('/confirmation')).to.be.true;
  });
  it('should not submit when privacy agreement not accepted', () => {
    const form = createForm();
    const pagesByChapter = createPagesByChapter();
    const formConfig = createFormConfig();
    const submitForm = sinon.spy();
    const setSubmission = sinon.spy();

    const tree = mount(
      <SubmitController
        setSubmission={setSubmission}
        submitForm={submitForm}
        formConfig={formConfig}
        form={form}
        pagesByChapter={pagesByChapter}/>
    );

    // SubmitButtons .usa-button-primary is the submit button
    tree.find('.usa-button-primary').simulate('click');

    expect(submitForm.called).to.be.false;
    expect(setSubmission.calledWith('hasAttemptedSubmit')).to.be.true;
  });
  it('should not submit when invalid', () => {
    // Form with missing rquired field
    const formConfig = createFormConfig({
      chapters: {
        chapter1: {
          pages: {
            page1: {
              title: 'Missing stuff',
              schema: {
                type: 'object',
                required: ['stuff'],
                properties: {
                  stuff: { type: 'string' }
                }
              }
            }
          }
        }
      },
      data: { privacyAgreementAccepted: true }
    });
    const pagesByChapter = createPagesByChapter();
    const form = createForm();
    const pageList = createPageList();
    const submitForm = sinon.spy();
    const setSubmission = sinon.spy();

    const tree = mount(
      <SubmitController
        setSubmission={setSubmission}
        submitForm={submitForm}
        form={form}
        formConfig={formConfig}
        pagesByChapter={pagesByChapter}
        pageList={pageList}
        route={{ formConfig, pageList }}/>
    );

    tree.find('.usa-button-primary').simulate('click');

    expect(submitForm.called).to.be.false;
    expect(setSubmission.calledWith('hasAttemptedSubmit')).to.be.true;
  });
  it('should submit when valid', () => {
    const formConfig = createFormConfig();
    const pagesByChapter = createPagesByChapter();
    const form = createForm({
      data: { privacyAgreementAccepted: true }
    });
    const pageList = createPageList();
    const submitForm = sinon.spy();

    const tree = mount(
      <SubmitController
        submitForm={submitForm}
        formConfig={formConfig}
        form={form}
        pagesByChapter={pagesByChapter}
        pageList={pageList}
        route={{ formConfig, pageList }}/>
    );

    tree.find('.usa-button-primary').simulate('click');

    expect(submitForm.called).to.be.true;
  });
  it('should submit when valid and no preSubmit specified', () => {
    const formConfig = createFormConfig({
      preSubmitInfo: undefined
    });
    const pagesByChapter = createPagesByChapter();
    const form = createForm();
    const pageList = createPageList();
    const submitForm = sinon.spy();

    const tree = mount(
      <SubmitController
        submitForm={submitForm}
        formConfig={formConfig}
        form={form}
        pagesByChapter={pagesByChapter}
        pageList={pageList}
        route={{ formConfig, pageList }}/>
    );

    tree.find('.usa-button-primary').simulate('click');

    expect(submitForm.called).to.be.true;
  });
  it('should submit when valid and only preSubmit.notice specified', () => {
    const formConfig = createFormConfig({
      preSubmitInfo: {
        notice: <p className="presubmit-notice">NOTICE</p>,
        required: false
      }
    });
    const pagesByChapter = createPagesByChapter();
    const form = createForm();
    const pageList = createPageList();
    const submitForm = sinon.spy();

    const tree = mount(
      <SubmitController
        submitForm={submitForm}
        formConfig={formConfig}
        form={form}
        pagesByChapter={pagesByChapter}
        pageList={pageList}
        route={{ formConfig, pageList }}/>
    );

    tree.find('.usa-button-primary').simulate('click');

    expect(tree.find('.presubmit-notice').text()).to.equal('NOTICE');
    expect(submitForm.called).to.be.true;
  });
  it('should change the preSubmit value when the checkbox is clicked', () => {
    const formConfig = createFormConfig({
      preSubmitInfo: {
        required: true,
        field: 'yep',
        label: 'Count me in!'
      }
    });
    const pagesByChapter = createPagesByChapter();
    const form = createForm();
    const pageList = createPageList();
    const setPreSubmit = sinon.spy();

    const tree = mount(
      <SubmitController
        submitForm={f => f}
        setPreSubmit={setPreSubmit}
        formConfig={formConfig}
        form={form}
        pagesByChapter={pagesByChapter}
        pageList={pageList}
        route={{ formConfig, pageList }}/>
    );

    tree.find('[type="checkbox"]').simulate('change', { target: { checked: true } });
    expect(setPreSubmit.calledWith('yep', true)).to.be.true;
  });
  it('should go back', () => {
    const formConfig = createFormConfig();
    const pageList = createPageList();
    const form = createForm({
      data: { privacyAgreementAccepted: true }
    });
    const router = { push: sinon.spy() };
    const submission = {
      hasAttemptedSubmit: false
    };

    const tree = mount(
      <SubmitController
        form={form}
        formConfig={formConfig}
        pageList={pageList}
        router={router}
        submission={submission}/>
    ).instance();

    tree.goBack();

    // BUG: The code is making a bunch of bogus assumptions about routes
    // and pages since it always adds review and confirmation routes.
    expect(router.push.calledWith('page-2')).to.be.true;
  });
});
