import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
// import { render, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import * as trainingProviderDetails from '../../pages/trainingProviderDetails';

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('Training Provider Step 3 - Page 2 Details', () => {
  const { schema, uiSchema } = trainingProviderDetails;

  const initialState = {
    form: {
      data: {
        trainingProvider: [],
      },
    },
  };
  const store = mockStore(initialState);

  it('should render with all input and select fields', () => {
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(7);
    expect($$('va-select', container).length).to.equal(1);
  });

  // it('should render errors on required inputs', async () => {
  //   const { container, getByRole } = render(
  //     <Provider store={store}>
  //       <DefinitionTester
  //         definitions={formConfig.defaultDefinitions}
  //         schema={schema}
  //         uiSchema={uiSchema}
  //       />
  //     </Provider>,
  //   );

  //   getByRole('button', { name: /submit/i }).click();
  //   await waitFor(() => {
  //     expect($$('va-text-input[error]', container).length).to.equal(4);
  //     expect($$('va-select[error]', container).length).to.equal(1);
  //   });
  // });
});
