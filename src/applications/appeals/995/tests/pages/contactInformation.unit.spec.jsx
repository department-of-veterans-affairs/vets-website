import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import { $, $$ } from '../../utils/ui';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.infoPages.pages.confirmContactInformation;

const mockStore = data => ({
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
  dispatch: () => ({
    setFormData: () => {},
  }),
});

describe('contact information page', () => {
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <div>
        <Provider store={mockStore()}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={{}}
            formData={{}}
          />
        </Provider>
      </div>,
    );

    const formDOM = getFormDOM(form);
    expect($('h3', formDOM).textContent).to.contain('Contact Information');
    expect($$('a[aria-label^="Edit "]', formDOM).length).to.eq(4);
  });
});
