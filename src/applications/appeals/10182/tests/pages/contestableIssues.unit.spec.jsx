import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
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
    contestableIssues: {
      status: '',
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
    getContestableIssues: () => {},
  }),
});

describe('add issue page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.conditions.pages.contestableIssues;

  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect(container.querySelector('.add-new-issue')).to.exist;
  });
});
