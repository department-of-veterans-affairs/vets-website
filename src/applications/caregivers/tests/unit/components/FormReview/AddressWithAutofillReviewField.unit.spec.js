import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import AddressWithAutofillReviewField from '../../../../components/FormReview/AddressWithAutofillReviewField';
import content from '../../../../locales/en/content.json';

const defaultData = {
  street: '1350 I St. NW',
  street2: 'Suite 550',
  city: 'Washington',
  state: 'DC',
  postalCode: '20005',
  county: 'Arlington',
};

describe('CG <AddressWithAutofillReviewField>', () => {
  const subject = ({ data = defaultData, autofill = false } = {}) => {
    const props = {
      formData: {
        ...data,
        'view:autofill': autofill,
      },
      inputLabel: content['primary-input-label'],
    };
    const { container } = render(<AddressWithAutofillReviewField {...props} />);
    const selectors = () => ({
      street: container.querySelector('[data-testid="cg-address-street"]'),
      street2: container.querySelector('[data-testid="cg-address-street2"]'),
      city: container.querySelector('[data-testid="cg-address-city"]'),
      state: container.querySelector('[data-testid="cg-address-state"]'),
      postalCode: container.querySelector(
        '[data-testid="cg-address-postalcode"]',
      ),
      autofill: container.querySelector('[data-testid="cg-address-autofill"]'),
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
      expect(reviewRows[key]).to.contain.text(defaultData[key]);
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
    Object.keys(reviewRows).forEach(key => {
      expect(reviewRows[key]).to.be.empty;
    });
  });
});
