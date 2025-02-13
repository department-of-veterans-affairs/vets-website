import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import AddressPage from '../../../../components/submit-flow/pages/AddressPage';

const home = {
  addressLine1: '345 Home Address St.',
  addressPou: 'RESIDENCE/CHOICE',
  addressType: 'DOMESTIC',
  city: 'San Francisco',
  countryName: 'United States',
  countryCodeIso2: 'US',
  countryCodeIso3: 'USA',
  stateCode: 'CA',
  zipCode: '94118',
};

describe('Address page', () => {
  const getData = ({ homeAddress } = {}) => {
    return {
      user: {
        profile: {
          vapContactInfo: {
            residentialAddress: homeAddress,
          },
        },
      },
    };
  };

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
    const screen = renderWithStoreAndRouter(<AddressPage {...props} />, {
      initialState: getData({
        homeAddress: home,
      }),
    });

    await waitFor(() => {
      expect(screen.getByTestId('address-test-id')).to.exist;
      expect(screen.findByText('345 Home Address St')).to.exist;
      expect($('va-button-pair')).to.exist;
    });

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

  it('should show an alert if no address', () => {
    const screen = renderWithStoreAndRouter(<AddressPage {...props} />, {
      initialState: getData(),
    });

    expect(screen.queryByTestId('address-test-id')).to.not.exist;
    expect($('va-button-pair')).to.not.exist;
    expect($('va-alert')).to.exist;
    expect(
      screen.findByText(`We can’t file this claim in this tool at this time`),
    ).to.exist;
    expect(screen.findByText(/We need your home address/i)).to.exist;
    expect($('va-link[href="/profile/contact-information"]')).to.exist;
  });

  it('should render an error if no selection made', async () => {
    const screen = renderWithStoreAndRouter(<AddressPage {...props} />, {
      initialState: getData({
        homeAddress: home,
      }),
    });
    $('va-button-pair').__events.primaryClick(); // continue
    await waitFor(() => {
      expect(screen.findByText(/You must make a selection/i)).to.exist;
    });
  });
});
