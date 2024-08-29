import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { AddressWithAutofillReviewField } from '../../../../components/FormReview/AddressWithAutofillReviewField';
import content from '../../../../locales/en/content.json';

describe('CG <AddressWithAutofillReviewField>', () => {
  const defaultData = {
    street: '1350 I St. NW',
    street2: 'Suite 550',
    city: 'Washington',
    state: 'DC',
    postalCode: '20005',
    county: 'Arlington',
  };

  const getData = ({ data = defaultData, autofill = false }) => ({
    props: {
      formData: {
        ...data,
        'view:autofill': autofill,
      },
      inputLabel: content['primary-input-label'],
    },
  });

  const getSelectors = props => {
    const { container } = render(<AddressWithAutofillReviewField {...props} />);
    return {
      street: container.querySelector('[data-testid="cg-address-street"]'),
      street2: container.querySelector('[data-testid="cg-address-street2"]'),
      city: container.querySelector('[data-testid="cg-address-city"]'),
      state: container.querySelector('[data-testid="cg-address-state"]'),
      postalCode: container.querySelector(
        '[data-testid="cg-address-postalcode"]',
      ),
      autofill: container.querySelector('[data-testid="cg-address-autofill"]'),
    };
  };

  it('should render street address, city, state and postal code by default', () => {
    const { props } = getData({});
    const selectors = Object.fromEntries(
      Object.entries(getSelectors(props)).filter(e => e[0] !== 'autofill'),
    );
    Object.keys(selectors).forEach(key => {
      if (key === 'state') {
        expect(selectors[key]).to.contain.text('District Of Columbia');
        return;
      }
      expect(selectors[key]).to.contain.text(defaultData[key]);
    });
  });

  it('should render autofill field when selected', () => {
    const { props } = getData({ autofill: true });
    const { autofill } = getSelectors(props);
    expect(autofill).to.exist;
    expect(autofill.querySelector('dt')).to.contain.text(
      content['caregiver-address-same-as-vet-label'],
    );
    expect(autofill.querySelector('dd')).to.contain.text('Yes');
  });

  it('should render empty when form data is empty', () => {
    const { props } = getData({ data: {} });
    const selectors = Object.fromEntries(
      Object.entries(getSelectors(props)).filter(e => e[0] !== 'autofill'),
    );
    Object.keys(selectors).forEach(key => {
      expect(selectors[key]).to.be.empty;
    });
  });
});
