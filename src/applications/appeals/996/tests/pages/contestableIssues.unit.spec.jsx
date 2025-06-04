import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

const mockStore = data => ({
  getState: () => ({
    form: {
      data: {
        ...data,
        contestedIssues: [],
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
  dispatch: () => ({
    setFormData: () => {},
  }),
});

// Skipping this test because its only assertion is checking that a plain link still exists
// Since this has been changed to a web component and now uses the shadow DOM, we can't do this
// Created a ticket to revisit this test later: https://github.com/department-of-veterans-affairs/va.gov-team/issues/110705
xdescribe('add issue page', () => {
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

    expect(form.find('a.add-new-issue').length).to.equal(1);
    form.unmount();
  });
});
