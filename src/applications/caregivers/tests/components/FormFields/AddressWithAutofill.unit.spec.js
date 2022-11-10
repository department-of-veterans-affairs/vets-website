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

const canAutofillAddress = true;
const errorSchema = {
  city: { __errors: ['Please provide a response'] },
  postalCode: { __errors: ['Please provide a response'] },
  state: { __errors: ['Please provide a response'] },
  street: { __errors: ['Please provide a response'] },
  street2: { __errors: [] },
  'view:autofill': { __errors: [] },
};
const idSchema = {
  $id: 'root_primaryAddress',
  city: { $id: 'root_primaryAddress_city' },
  postalCode: { $id: 'root_primaryAddress_postalCode' },
  state: { $id: 'root_primaryAddress_state' },
  street: { $id: 'root_primaryAddress_street' },
  street2: { $id: 'root_primaryAddress_street2' },
  'view:autofill': { $id: 'root_primaryAddress_view:autofill' },
};
const onChange = () => {};
const schema = address;
const formData = {
  street: '1350 I St. NW',
  street2: 'Suite 550',
  city: 'Washington',
  state: 'DC',
  postalCode: '20005',
  'view:autofill': false,
};

describe('CG <AddressWithAutofill>', () => {
  it('should render AddressWithAutofill component as a form with checkbox and inputs', () => {
    const formContext = { reviewMode: false, submitted: undefined };
    const view = render(
      <Provider store={mockStore}>
        <AddressWithAutofill
          canAutofillAddress={canAutofillAddress}
          errorSchema={errorSchema}
          idSchema={idSchema}
          onChange={onChange}
          schema={schema}
          formContext={formContext}
          formData={formData}
        />
      </Provider>,
    );

    expect(
      view.container.querySelector('va-checkbox#root_primaryAddress_autofill'),
    ).to.exist;
    expect(
      view.container.querySelector('va-text-input#root_primaryAddress_street'),
    ).to.exist;
    expect(
      view.container.querySelector('va-text-input#root_primaryAddress_street2'),
    ).to.exist;
    expect(
      view.container.querySelector('va-text-input#root_primaryAddress_city'),
    ).to.exist;
    expect(view.container.querySelector('va-select#root_primaryAddress_state'))
      .to.exist;
    expect(
      view.container.querySelector(
        'va-text-input#root_primaryAddress_postalCode',
      ),
    ).to.exist;
  });

  it('should render AddressWithAutofill component as a review field', () => {
    const formContext = { reviewMode: true, submitted: undefined };
    const view = render(
      <Provider store={mockStore}>
        <AddressWithAutofill
          canAutofillAddress={canAutofillAddress}
          errorSchema={errorSchema}
          idSchema={idSchema}
          onChange={onChange}
          schema={schema}
          formContext={formContext}
          formData={formData}
        />
      </Provider>,
    );

    // street
    expect(view.container.querySelectorAll('dt')[0]).to.contain.text(
      'current street address',
    );
    expect(view.container.querySelectorAll('dd')[0]).to.contain.text(
      '1350 I St. NW',
    );

    // street2
    expect(view.container.querySelectorAll('dt')[1]).to.contain.text(
      'Street address line 2',
    );
    expect(view.container.querySelectorAll('dd')[1]).to.contain.text(
      'Suite 550',
    );

    // city
    expect(view.container.querySelectorAll('dt')[2]).to.contain.text('City');
    expect(view.container.querySelectorAll('dd')[2]).to.contain.text(
      'Washington',
    );

    // state
    expect(view.container.querySelectorAll('dt')[3]).to.contain.text('State');
    expect(view.container.querySelectorAll('dd')[3]).to.contain.text(
      'District Of Columbia',
    );

    // zip
    expect(view.container.querySelectorAll('dt')[4]).to.contain.text(
      'Postal code',
    );
    expect(view.container.querySelectorAll('dd')[4]).to.contain.text('20005');
  });
});
