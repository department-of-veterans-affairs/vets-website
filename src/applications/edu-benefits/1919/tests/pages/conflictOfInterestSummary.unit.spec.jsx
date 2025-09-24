import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { conflictOfInterestSummary } from '../../pages';

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('Conflict of Interest Step 3 - Page 1/5', () => {
  const { schema, uiSchema } = conflictOfInterestSummary;

  const initialState = {
    form: {
      data: {
        'conflict-of-interest': [],
      },
    },
  };
  const store = mockStore(initialState);

  it('should render with a yesNo radio button', () => {
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('should render an error message if no radio button is selected', async () => {
    const { container, getByRole } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect($$('va-radio-option', container).length).to.equal(2);
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect($$('va-radio[error]', container).length).to.equal(1);
    });
  });
});
