import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import formConfig from '../../config/form';

const mockStore = configureStore();

const mockData = {
  primaryOfficialDetails: {
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

  it('Renders the page with the correct number of inputs', async () => {
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

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-memorable-date[error]', container).length).to.equal(1);
    });
  });
  it('Renders the page with the correct required inputs when training exempt is true', () => {
    const formData = {
      primaryOfficialTraining: {
        trainingExempt: true,
      },
    };

    const resultSchema = uiSchema.primaryOfficialTraining[
      'ui:options'
    ].updateSchema(formData, schema, null, 0);
    expect(resultSchema.required).to.deep.equal([]);
  });
});
