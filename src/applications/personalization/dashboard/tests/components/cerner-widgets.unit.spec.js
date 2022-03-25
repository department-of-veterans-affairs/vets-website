import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { getCernerURL } from 'platform/utilities/cerner';
import { CernerWidget } from '../../components/cerner-widgets';

describe('General Widget', () => {
  const facilityLocations = ['Facility Name'];
  let view;
  beforeEach(() => {
    view = render(<CernerWidget facilityLocations={facilityLocations} />);
  });
  it('renders the correct text, including the facility names', () => {
    expect(view.getByTestId('facilities').textContent).to.contain(
      `For ${facilityLocations[0]}:`,
    );
  });
  it('renders the correct primary CTA link', () => {
    const myVAHealthLink = view.getByRole('link', {
      name: /Use My VA Health/i,
    });
    const cernerURL = getCernerURL('');
    expect(myVAHealthLink.href).to.equal(cernerURL);
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
