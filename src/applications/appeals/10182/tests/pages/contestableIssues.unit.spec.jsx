import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
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
  } = formConfig.chapters.issues.pages.contestableIssues;

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

    expect($('va-link-action[class="add-new-issue"]', container)).to.exist;
  });
});
