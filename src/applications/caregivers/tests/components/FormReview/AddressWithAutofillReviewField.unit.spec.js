import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { AddressWithAutofillReviewField } from '../../../components/FormReview/AddressWithAutofillReviewField';

describe('CG <AddressWithAutofillReviewField>', () => {
  it('should render address, city, state and zip', () => {
    const canAutofillAddress = false;
    const formData = {
      street: '1350 I St. NW',
      street2: 'Suite 550',
      city: 'Washington',
      state: 'DC',
      postalCode: '20005',
      'view:autofill': false,
    };
    const inputLabel = "Primary Family Caregiver's";

    const view = render(
      <AddressWithAutofillReviewField
        canAutofillAddress={canAutofillAddress}
        formData={formData}
        inputLabel={inputLabel}
      />,
    );

    // street
    expect(
      view.container.querySelector('[data-testid="cg-address-street"]'),
    ).to.contain.text('1350 I St. NW');

    // street2
    expect(
      view.container.querySelector('[data-testid="cg-address-street2"]'),
    ).to.contain.text('Suite 550');

    // city
    expect(
      view.container.querySelector('[data-testid="cg-address-city"]'),
    ).to.contain.text('Washington');

    // state
    expect(
      view.container.querySelector('[data-testid="cg-address-state"]'),
    ).to.contain.text('District Of Columbia');

    // zip
    expect(
      view.container.querySelector('[data-testid="cg-address-postalcode"]'),
    ).to.contain.text('20005');
  });
});
