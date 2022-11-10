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
    expect(view.container.querySelectorAll('dt')[0]).to.contain.text(
      "Primary Family Caregiver's current street address",
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
