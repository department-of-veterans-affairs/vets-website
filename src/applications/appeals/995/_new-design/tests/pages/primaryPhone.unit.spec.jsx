import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.infoPages.pages.choosePrimaryPhone;

const mockStore = () => ({
  getState: () => ({
    form: {
      data: {},
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

describe('primary phone page', () => {
  it('should render a page', () => {
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
    expect($('button[type="submit"]', formDOM)).to.exist;
  });
});
