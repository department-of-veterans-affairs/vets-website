import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { CernerWidget } from '../../components/cerner-widgets';

describe('General Widget', () => {
  const facilityNames = ['Facility Name'];
  let view;
  beforeEach(() => {
    view = render(<CernerWidget facilityNames={facilityNames} />);
  });
  it('renders the correct text, including the facility names', () => {
    expect(view.getByTestId('facilities').textContent).to.equal(
      `For ${facilityNames[0]}: `,
    );
  });
  it('renders the correct primary CTA button', () => {
    const myVAHealthButton = view.getByRole('link', {
      name: /Use My VA Health/i,
    });
    expect(myVAHealthButton.href).to.equal(
      'https://staging-patientportal.myhealth.va.gov/',
    );
  });
  it('renders the correct secondary CTA button', () => {
    const ctaButton = view.getByRole('link', {
      name: /Use My HealtheVet/i,
    });
    expect(ctaButton.href).to.contain(
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home',
    );
  });
});
