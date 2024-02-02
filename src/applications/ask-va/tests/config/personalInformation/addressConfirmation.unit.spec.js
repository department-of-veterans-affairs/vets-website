import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformation.pages.yourAddressConfirmation_generalquestion;

describe('addressConfirmationPage', () => {
  it('should render', () => {
    const mockStore = {
      getState: () => ({
        form: {
          data: {
            selectCategory: 'Benefits Issues Outside the US',
            address: {
              city: 'Queens',
              country: 'USA',
              postalCode: '11106',
              state: 'NY',
              street: '123 Main street',
              street2: 'Apt 3B',
            },
          },
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            userFullName: {
              first: 'Peter',
              middle: 'B',
              last: 'Parker',
            },
          },
        },
        askVA: {
          categoryID: '2',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    expect($('h3', container).textContent).to.eq(
      'Veteran Address Confirmation',
    );
    expect($('span', container).textContent).to.eq('You entered:');
  });
});
