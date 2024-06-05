import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

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

    const spans = $$('span', container);
    const spanList = ['You entered:', 'Suggested Addresses:'];

    expect($('h2', container).textContent).to.eq(
      'Veteran Address Confirmation',
    );

    spans.forEach(
      span => expect(spanList.includes(span.textContent.trim())).to.be.true,
    );
  });
});
