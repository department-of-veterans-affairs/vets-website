import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import formConfig from '../../config/form';

const mockStore = configureStore();

const mockData = {
  primaryOfficial: {
    fullName: {
      first: 'John',
      last: 'Doe',
    },
  },
  primaryOfficialTraining: {
    trainingExempt: false,
  },
};

describe('Primary certifying official training page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.primaryOfficialChapter.pages.primaryOfficialTraining;

  it('Renders the page with the correct number of inputs', () => {
    const store = mockStore({ form: { data: mockData } });
    const { container, getByRole } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
        />
        ,
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-checkbox', container).length).to.equal(1);
    getByRole('button', { name: /submit/i }).click();
    expect($$('va-memorable-date[error]', container).length).to.equal(1);
  });
});
