import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { AddressWithAutofillReviewField } from '../../../components/FormReview/AddressWithAutofillReviewField';

describe('CG <AddressWithAutofillReviewField>', () => {
  const getSelectors = view => ({
    street: view.container.querySelector('[data-testid="cg-address-street"]'),
    street2: view.container.querySelector('[data-testid="cg-address-street2"]'),
    city: view.container.querySelector('[data-testid="cg-address-city"]'),
    state: view.container.querySelector('[data-testid="cg-address-state"]'),
    postalCode: view.container.querySelector(
      '[data-testid="cg-address-postalcode"]',
    ),
    autofill: view.container.querySelector(
      '[data-testid="cg-address-autofill"]',
    ),
  });

  const defaultProps = {
    canAutofillAddress: false,
    formData: {
      street: '1350 I St. NW',
      street2: 'Suite 550',
      city: 'Washington',
      state: 'DC',
      postalCode: '20005',
      'view:autofill': false,
    },
    inputLabel: 'Primary Family Caregiver\u2019s',
  };

  const subject = (props = defaultProps) => {
    const view = render(<AddressWithAutofillReviewField {...props} />);
    return getSelectors(view);
  };

  it('should render address, city, state and zip by default', () => {
    const selectors = subject();
    expect(selectors.street).to.contain.text('1350 I St. NW');
    expect(selectors.street2).to.contain.text('Suite 550');
    expect(selectors.city).to.contain.text('Washington');
    expect(selectors.state).to.contain.text('District Of Columbia');
    expect(selectors.postalCode).to.contain.text('20005');
  });

  it('should not render autofill field when not selected', () => {
    const props = {
      ...defaultProps,
      canAutofillAddress: true,
    };
    const selectors = subject(props);
    expect(selectors.autofill).to.not.exist;
  });

  it('should render autofill field when selected', () => {
    const props = {
      ...defaultProps,
      canAutofillAddress: true,
      formData: {
        ...defaultProps.formData,
        'view:autofill': true,
      },
    };
    const selectors = subject(props);
    expect(selectors.autofill).to.exist;
    expect(selectors.autofill.querySelector('dt')).to.contain.text(
      'Use the same address as the Veteran',
    );
    expect(selectors.autofill.querySelector('dd')).to.contain.text('Selected');
  });

  it('renders empty when no address form data is passed', () => {
    const props = {
      ...defaultProps,
      formData: {
        ...defaultProps.formData,
        street: '',
        street2: '',
        city: '',
        state: '',
        postalCode: '',
      },
    };
    const selectors = subject(props);
    expect(selectors.street).to.contain.text('');
    expect(selectors.street2).to.contain.text('');
    expect(selectors.city).to.contain.text('');
    expect(selectors.state).to.contain.text('');
    expect(selectors.postalCode).to.contain.text('');
  });
});
