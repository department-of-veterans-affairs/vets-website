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

describe('add issue page', () => {
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
