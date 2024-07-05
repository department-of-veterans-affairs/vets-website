import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { addressWithAutofillSchema } from '../../../../definitions/sharedSchema';
import AddressWithAutofill from '../../../../components/FormFields/AddressWithAutofill';
import content from '../../../../locales/en/content.json';

const { address } = fullSchema.definitions;

describe('CG <AddressWithAutofill>', () => {
  const errorSchemas = {
    empty: { __errors: [] },
    required: { __errors: [content['validation-default-required']] },
  };
  const getData = ({ autofill = false, reviewMode = false }) => ({
    props: {
      formContext: { reviewMode, submitted: undefined },
      formData: {
        street: '1350 I St. NW',
        street2: 'Suite 550',
        city: 'Washington',
        state: 'DC',
        postalCode: '20005',
        county: 'Arlington',
        'view:autofill': autofill,
      },
      errorSchema: {
        city: errorSchemas.required,
        county: errorSchemas.required,
        postalCode: errorSchemas.required,
        state: errorSchemas.required,
        street: errorSchemas.required,
        street2: errorSchemas.empty,
        'view:autofill': errorSchemas.empty,
      },
      idSchema: {
        $id: 'root_caregiverAddress',
        city: { $id: 'root_caregiverAddress_city' },
        county: { $id: 'root_caregiverAddress_county' },
        postalCode: { $id: 'root_caregiverAddress_postalCode' },
        state: { $id: 'root_caregiverAddress_state' },
        street: { $id: 'root_caregiverAddress_street' },
        street2: { $id: 'root_caregiverAddress_street2' },
        'view:autofill': { $id: 'root_caregiverAddress_view:autofill' },
      },
      schema: addressWithAutofillSchema(address),
      onChange: () => {},
    },
    mockStore: {
      getState: () => ({
        form: {
          data: {
            veteranAddress: {
              street: '1350 I St. NW',
              street2: 'Suite 550',
              city: 'Washington',
              state: 'DC',
              postalCode: '20005',
            },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  context('when not in review mode', () => {
    const { mockStore, props } = getData({});

    it('should render the form', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <AddressWithAutofill {...props} />
        </Provider>,
      );
      const expectedFieldTypes = 'va-checkbox, va-text-input, va-select';
      const selectors = {
        fieldset: container.querySelector('.cg-address-with-autofill'),
        inputs: container.querySelectorAll(expectedFieldTypes),
      };
      expect(selectors.fieldset).to.exist;
      expect(selectors.fieldset).to.not.be.empty;
      expect(selectors.inputs).to.have.lengthOf(7);
    });
  });

  context('when in review mode', () => {
    it('should render just the address fields when autofill is `false`', () => {
      const { mockStore, props } = getData({ reviewMode: true });
      const { container } = render(
        <Provider store={mockStore}>
          <AddressWithAutofill {...props} />
        </Provider>,
      );
      const selector = container.querySelectorAll('.review-row');
      expect(selector).to.have.lengthOf(6);
    });

    it('should render the address fields and autofill description when autofill is `true`', () => {
      const { mockStore, props } = getData({
        autofill: true,
        reviewMode: true,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <AddressWithAutofill {...props} />
        </Provider>,
      );
      const selector = container.querySelectorAll('.review-row');
      expect(selector).to.have.lengthOf(7);
    });
  });
});
