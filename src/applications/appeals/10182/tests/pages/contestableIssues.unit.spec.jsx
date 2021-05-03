import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';
import { SELECTED } from '../../constants';

const mockStore = (data = {}) => ({
  getState: () => ({
    form: {
      data,
    },
    formContext: {
      onReviewPage: false,
      reviewMode: false,
      touched: {},
      submitted: false,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('NOD contestable issues page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.conditions.pages.contestableIssues;

  it('should render', () => {
    const form = mount(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect(form.find('AdditionalInfo').length).to.equal(1);
    expect(form.find('EligibleIssuesWidget').length).to.equal(1);
    expect(form.find('NewIssuesField').length).to.equal(1);
    form.unmount();
  });

  it('should not submit when no issues are checked', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  // can't get eligible issues cards to render - data isn't getting passed into
  // the widget
  it('should render additional issues card', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            // commenting this next line out will cause a React render error
            // contestableIssues: [],
            additionalIssues: [
              {
                issue: 'Back sprain',
                decisionDate: '2020-11-15',
                [SELECTED]: false,
              },
              {
                issue: 'Ankle sprain',
                decisionDate: '2020-11-16',
              },
            ],
            socOptIn: true,
          }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    expect(form.find('input[name^="root_additionalIssues"]').length).to.eq(2);
    expect(form.find('.edit').length).to.equal(2);
    form.unmount();
  });

  // Test not working - contestableIssues isn't being passed to widget
  it.skip('should submit when an added issue is checked', () => {
    const onSubmit = sinon.spy();
    const onError = sinon.spy();
    const data = {
      additionalIssues: [
        {
          issue: 'Back sprain',
          decisionDate: '2020-11-15',
          [SELECTED]: true,
        },
        {
          issue: 'Ankle sprain',
          decisionDate: '2020-11-16',
        },
      ],
      socOptIn: true,
    };
    const issues = {
      // this array is not passed to the EligibleIssuesWidget and adding it to
      // it as a data definition within the DefintiionTester causes a React
      // error
      contestableIssues: [
        {
          type: 'contestableIssue',
          attributes: {
            ratingIssueSubjectText: 'Tinnitus',
            description: 'Rinnging in the ears.',
            ratingIssuePercentNumber: 10,
            approxDecisionDate: '2020-11-01',
          },
          [SELECTED]: false,
        },
        {
          type: 'contestableIssue',
          attributes: {
            ratingIssueSubjectText: 'Headaches',
            description: 'Acute chronic head pain',
            ratingIssuePercentNumber: 50,
            approxDecisionDate: '2020-11-10',
          },
        },
      ],
      ...data,
    };
    const form = mount(
      <Provider store={mockStore(issues)}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          onSubmit={onSubmit}
          onError={onError}
        />
      </Provider>,
    );

    // these don't work? I had to set the [SELECTED] in the data
    selectCheckbox(form, 'root_additionalIssues_0', true);
    selectCheckbox(form, 'root_socOptIn', true);

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    // console.log(onSubmit)
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
