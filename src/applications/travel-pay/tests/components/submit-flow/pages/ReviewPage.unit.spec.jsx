import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ReviewPage from '../../../../components/submit-flow/pages/ReviewPage';

const appointment = require('../../../fixtures/appointment.json');

const homeAddress = {
  addressLine1: '345 Home Address St.',
  addressLine2: null,
  addressLine3: null,
  addressPou: 'RESIDENCE/CHOICE',
  addressType: 'DOMESTIC',
  city: 'San Francisco',
  countryName: 'United States',
  countryCodeIso2: 'US',
  countryCodeIso3: 'USA',
  countryCodeFips: null,
  countyCode: null,
  countyName: null,
  internationalPostalCode: null,
  sourceSystemUser: null,
  stateCode: 'CA',
  zipCode: '94118',
};

describe('Revew page', () => {
  const props = {
    address: homeAddress,
    appointment,
    onSubmit: () => {},
    isAgreementChecked: false,
    setIsAgreementChecked: () => {},
    setPageIndex: () => {},
    setYesNo: () => {},
  };
  it('should render properly with all data', () => {
    const screen = render(<ReviewPage {...props} />);

    expect(screen.getByText('Review your travel claim')).to.exist;
    expect(screen.findByText(/What you’re claiming/i)).to.exist;
    expect(screen.findByText(/How you traveled/)).to.exist;
    expect(screen.findByText(/Where you traveled from/)).to.exist;
    expect(screen.findByText(/345 Home Address St./i)).to.exist;
    expect($('va-button[text="View beneficiary travel agreement"]')).to.exist;
    expect(
      screen.findByText(/You must accept the beneficiary travel agreement/i),
    ).to.exist;
    expect($('va-button-pair')).to.exist;
  });

  it('should open the travel agreement modal', async () => {
    const screen = render(<ReviewPage {...props} />);

    fireEvent.click(screen.getByTestId('open-agreement-modal'));
    await waitFor(() => {
      expect(screen.getByTestId('agreement-modal')).to.have.attribute(
        'visible',
        'true',
      );
    });
  });
});
