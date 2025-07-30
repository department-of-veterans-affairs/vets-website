import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { AddressWithAutofillReviewField } from '../../../../components/FormReview/AddressWithAutofillReviewField';
import content from '../../../../locales/en/content.json';

// declare static values
const DEFAULT_DATA = {
  street: '1350 I St. NW',
  street2: 'Suite 550',
  city: 'Washington',
  state: 'DC',
  postalCode: '20005',
  county: 'Arlington',
};

describe('CG <AddressWithAutofillReviewField>', () => {
  const subject = ({ data = DEFAULT_DATA, autofill = false } = {}) => {
    const props = {
      formData: { ...data, 'view:autofill': autofill },
      inputLabel: content['primary-input-label'],
    };
    const { getByTestId } = render(
      <AddressWithAutofillReviewField {...props} />,
    );
    const selectors = () => ({
      street: getByTestId('cg-address-street'),
      street2: getByTestId('cg-address-street2'),
      city: getByTestId('cg-address-city'),
      state: getByTestId(/cg-address-state/),
      postalCode: getByTestId('cg-address-postalCode'),
      autofill: getByTestId('cg-address-autofill'),
    });
    return { selectors };
  };

  it('should render street address, city, state and postal code by default', () => {
    const { selectors } = subject();
    const reviewRows = Object.fromEntries(
      Object.entries(selectors).filter(e => e[0] !== 'autofill'),
    );
    Object.keys(reviewRows).forEach(key => {
      if (key === 'state') {
        expect(reviewRows[key]).to.contain.text('District Of Columbia');
        return;
      }
      expect(reviewRows[key]).to.contain.text(DEFAULT_DATA[key]);
    });
  });

  it('should render autofill field when selected', () => {
    const { selectors } = subject({ autofill: true });
    const { autofill } = selectors();
    expect(autofill).to.exist;
    expect(autofill.querySelector('dt')).to.contain.text(
      content['caregiver-address-same-as-vet-label'],
    );
    expect(autofill.querySelector('dd')).to.contain.text('Yes');
  });

  it('should render empty when form data is empty', () => {
    const { selectors } = subject({ data: {} });
    const reviewRows = Object.fromEntries(
      Object.entries(selectors).filter(e => e[0] !== 'autofill'),
    );
    Object.keys(reviewRows).forEach(key => expect(reviewRows[key]).to.be.empty);
  });
});
