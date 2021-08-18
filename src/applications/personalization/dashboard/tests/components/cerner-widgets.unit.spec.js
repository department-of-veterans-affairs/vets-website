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
      `For ${facilityNames[0]}: Use My VA Health`,
    );
  });
  it('renders the correct primary CTA link', () => {
    const myVAHealthLink = view.getByRole('link', {
      name: /Use My VA Health/i,
    });
    expect(myVAHealthLink.href).to.equal(
      'https://staging-patientportal.myhealth.va.gov/',
    );
  });
  it('renders the correct secondary CTA link', () => {
    const ctaLink = view.getByRole('link', {
      name: /Use My HealtheVet/i,
    });
    expect(ctaLink.href).to.contain(
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home',
    );
  });
});
