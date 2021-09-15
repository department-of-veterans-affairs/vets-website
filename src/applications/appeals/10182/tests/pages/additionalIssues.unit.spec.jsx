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
import { getDate } from '../../utils/dates';

const mockStore = data => ({
  getState: () => ({
    form: {
      data: {
        ...data,
        contestableIssues: [],
      },
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

describe('add issues page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.conditions.pages.additionalIssues;
  const validDate = getDate({ offset: { months: -2 } });

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

    expect(form.find('AddIssuesField').length).to.equal(1);
    form.unmount();
  });

  it('should not submit when no issues are added or checked', () => {
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
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  // can't get eligible issues cards to render - data isn't getting passed into
  // the widget
  it('should render additional issues cards', () => {
    const onSubmit = sinon.spy();
    const data = {
      // commenting this next line out will cause a React render error
      // contestableIssues: [],
      additionalIssues: [
        {
          issue: 'Back sprain',
          decisionDate: validDate,
          [SELECTED]: false,
        },
        {
          issue: 'Ankle sprain',
          decisionDate: validDate,
        },
      ],
    };
    const form = mount(
      <Provider store={mockStore(data)}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    expect(form.find('input[name^="root_additionalIssues"]').length).to.eq(2);
    expect(form.find('.edit').length).to.equal(2);
    form.unmount();
  });

  // Test not working - contestableIssues isn't being passed to widget
  it('should submit when an added issue is checked', () => {
    const onSubmit = sinon.spy();
    const onError = sinon.spy();
    const data = {
      additionalIssues: [
        {
          issue: 'Back sprain',
          decisionDate: validDate,
          // [SELECTED]: true,
        },
        {
          issue: 'Ankle sprain',
          decisionDate: validDate,
        },
      ],
    };
    const form = mount(
      <Provider store={mockStore(data)}>
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

    selectCheckbox(form, 'root_additionalIssues_0', true);

    form.find('form').simulate('submit');
    expect(form.find('#root_additionalIssues_0').props().checked).to.be.true;
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
