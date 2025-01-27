import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import AddressPage from '../../../../components/submit-flow/pages/AddressPage';

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

const mailingAddress = {
  addressLine1: '123 Mailing Address St.',
  addressLine2: null,
  addressLine3: null,
  addressPou: 'CORRESPONDENCE',
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

describe('Address page', () => {
  const props = {
    pageIndex: 3,
    setPageIndex: () => {},
    yesNo: {
      mileage: 'yes',
      vehicle: 'yes',
      address: '',
    },
    setYesNo: () => {},
    setIsUnsupportedClaimType: () => {},
  };

  it('should render with user home address', async () => {
    const screen = render(<AddressPage {...props} address={homeAddress} />);

    expect(screen.getByTestId('address-test-id')).to.exist;
    expect(screen.findByText('345 Home Address St')).to.exist;
    expect($('va-button-pair')).to.exist;

    fireEvent.click(
      $(
        `va-additional-info[trigger="If you didn't travel from your home address"]`,
      ),
    );
    await waitFor(() => {
      expect(screen.findByText(/If you traveled from a different address/i)).to
        .exist;
    });
  });

  it('should render with mail address if no home address', () => {
    const screen = render(<AddressPage {...props} address={mailingAddress} />);

    expect(screen.getByTestId('address-test-id')).to.exist;
    expect(screen.findByText('123 Mailing Address St')).to.exist;
    expect($('va-button-pair')).to.exist;
  });

  it('should show an alert if no address', () => {
    const screen = render(<AddressPage {...props} address={null} />);

    expect(screen.queryByTestId('address-test-id')).to.not.exist;
    expect($('va-button-pair')).to.not.exist;
    expect($('va-alert')).to.exist;
    expect(screen.findByText(/You don't have an address on file/i)).to.exist;
  });

  it('should render an error if no selection made', async () => {
    const screen = render(<AddressPage {...props} address={homeAddress} />);

    expect(screen.getByTestId('address-test-id')).to.exist;
    $('va-button-pair').__events.primaryClick(); // continue
    await waitFor(() => {
      expect(screen.findByText(/You must make a selection/i)).to.exist;
    });
  });
});
