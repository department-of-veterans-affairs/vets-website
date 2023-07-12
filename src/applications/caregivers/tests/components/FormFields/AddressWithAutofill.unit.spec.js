import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import AddressWithAutofill from '../../../components/FormFields/AddressWithAutofill';

const { address } = fullSchema.definitions;

const mockStore = {
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
};

describe('CG <AddressWithAutofill>', () => {
  const defaultProps = {
    formContext: { reviewMode: false, submitted: undefined },
    formData: {
      street: '1350 I St. NW',
      street2: 'Suite 550',
      city: 'Washington',
      state: 'DC',
      postalCode: '20005',
      'view:autofill': false,
    },
    errorSchema: {
      city: { __errors: ['Please provide a response'] },
      postalCode: { __errors: ['Please provide a response'] },
      state: { __errors: ['Please provide a response'] },
      street: { __errors: ['Please provide a response'] },
      street2: { __errors: [] },
      'view:autofill': { __errors: [] },
    },
    idSchema: {
      $id: 'root_primaryAddress',
      city: { $id: 'root_primaryAddress_city' },
      postalCode: { $id: 'root_primaryAddress_postalCode' },
      state: { $id: 'root_primaryAddress_state' },
      street: { $id: 'root_primaryAddress_street' },
      street2: { $id: 'root_primaryAddress_street2' },
      'view:autofill': { $id: 'root_primaryAddress_view:autofill' },
    },
    schema: address,
    onChange: () => {},
  };

  describe('when review mode is `false`', () => {
    it('should render the form', () => {
      const view = render(
        <Provider store={mockStore}>
          <AddressWithAutofill {...defaultProps} />
        </Provider>,
      );
      const selectors = {
        fieldset: view.container.querySelector('.cg-address-with-autofill'),
        inputs: view.container.querySelectorAll(
          'va-checkbox, va-text-input, va-select',
        ),
      };
      expect(selectors.fieldset).to.exist;
      expect(selectors.fieldset).to.not.be.empty;
      expect(selectors.inputs).to.have.lengthOf(6);
    });
  });

  describe('when review mode is `true`', () => {
    it('should render the just the address fields when autofill is `false`', () => {
      const props = {
        ...defaultProps,
        formContext: {
          ...defaultProps.formContext,
          reviewMode: true,
        },
      };
      const view = render(
        <Provider store={mockStore}>
          <AddressWithAutofill {...props} />
        </Provider>,
      );
      const selector = view.container.querySelectorAll('.review-row');
      expect(selector).to.have.lengthOf(5);
    });

    it('should render the address fields and autofill description when autofill is `true`', () => {
      const props = {
        ...defaultProps,
        formContext: {
          ...defaultProps.formContext,
          reviewMode: true,
        },
        formData: {
          ...defaultProps.formData,
          'view:autofill': true,
        },
      };
      const view = render(
        <Provider store={mockStore}>
          <AddressWithAutofill {...props} />
        </Provider>,
      );
      const selector = view.container.querySelectorAll('.review-row');
      expect(selector).to.have.lengthOf(6);
    });
  });
});
