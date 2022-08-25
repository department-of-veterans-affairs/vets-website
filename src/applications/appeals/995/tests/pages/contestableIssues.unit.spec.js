import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import { $ } from '../../utils/ui';

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
  } = formConfig.chapters.issues.pages.contestableIssues;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <div>
        <Provider store={mockStore()}>
          <DefinitionTester
            definitions={{}}
            schema={schema}
            uiSchema={uiSchema}
            data={{}}
          />
        </Provider>
      </div>,
    );

    const formDOM = getFormDOM(form);
    expect($('a.add-new-issue', formDOM)).to.exist;
  });
});
