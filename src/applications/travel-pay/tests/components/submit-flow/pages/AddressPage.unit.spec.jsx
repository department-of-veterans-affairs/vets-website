import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

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

const mailing = {
  ...home,
  addressLine1: '123 Mailing Address St.',
  addressLine2: 'Ste. B',
  addressLine3: 'Building 2',
  addressPou: 'CORRESPONDENCE',
};

describe('Address page', () => {
  const setPageIndex = sinon.spy();
  const setIsUnsupportedClaimType = sinon.spy();

  const getData = ({ homeAddress, mailingAddress } = {}) => {
    return {
      user: {
        profile: {
          vapContactInfo: {
            residentialAddress: homeAddress,
            mailingAddress,
          },
        },
      },
    };
  };

  const props = {
    pageIndex: 3,
    setPageIndex,
    yesNo: {
      mileage: 'yes',
      vehicle: 'yes',
      address: '',
    },
    setYesNo: () => {},
    setIsUnsupportedClaimType,
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

  it('should render with mail address if no home address', () => {
    const screen = renderWithStoreAndRouter(<AddressPage {...props} />, {
      initialState: getData({
        mailingAddress: mailing,
      }),
    });

    expect(screen.getByTestId('address-test-id')).to.exist;
    expect(screen.findByText('123 Mailing Address St')).to.exist;
    expect(screen.findByText('Ste. B')).to.exist;
    expect($('va-button-pair')).to.exist;
  });

  it('should show an alert if no address', () => {
    const screen = renderWithStoreAndRouter(<AddressPage {...props} />, {
      initialState: getData(),
    });

    expect(screen.queryByTestId('address-test-id')).to.not.exist;
    expect($('va-button-pair')).to.not.exist;
    expect($('va-alert')).to.exist;
    expect(screen.findByText(/You don't have an address on file/i)).to.exist;
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

  it('should render an error selection is "no"', async () => {
    const screen = renderWithStoreAndRouter(
      <AddressPage {...props} yesNo={{ ...props.yesNo, address: 'no' }} />,
      {
        initialState: getData({
          homeAddress: home,
        }),
      },
    );
    $('va-button-pair').__events.primaryClick(); // continue

    expect(setIsUnsupportedClaimType.calledWith(true)).to.be.true;
    await waitFor(() => {
      expect(
        screen.findByText(
          /We can’t file this type of travel reimbursement claim in this tool at this time/i,
        ),
      ).to.exist;
    });
  });

  it('should move on to the next step if selection is "yes"', () => {
    renderWithStoreAndRouter(
      <AddressPage {...props} yesNo={{ ...props.yesNo, address: 'yes' }} />,
      {
        initialState: getData({
          homeAddress: home,
        }),
      },
    );
    $('va-button-pair').__events.primaryClick(); // continue

    expect(setIsUnsupportedClaimType.calledWith(false)).to.be.true;
    expect(setPageIndex.calledWith(4)).to.be.true;
  });

  it('should move back a step', () => {
    renderWithStoreAndRouter(<AddressPage {...props} />, {
      initialState: getData({
        homeAddress: home,
      }),
    });
    $('va-button-pair').__events.secondaryClick(); // back

    expect(setIsUnsupportedClaimType.calledWith(false)).to.be.true;
    expect(setPageIndex.calledWith(2)).to.be.true;
  });
});
