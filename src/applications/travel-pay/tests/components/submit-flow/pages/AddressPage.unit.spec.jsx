import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import AddressPage from '../../../../components/submit-flow/pages/AddressPage';

const home = {
  addressLine1: '345 Home Address St.',
  addressLine2: 'Apt. 22B',
  addressLine3: 'Building 2',
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
  const setPageIndex = sinon.spy();
  const setIsUnsupportedClaimType = sinon.spy();

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
    setPageIndex,
    yesNo: {
      mileage: 'yes',
      vehicle: 'yes',
      address: '',
    },
    setYesNo: () => {},
    setIsUnsupportedClaimType,
  };

  it('should render with user home address', () => {
    const screen = renderWithStoreAndRouter(<AddressPage {...props} />, {
      initialState: getData({
        homeAddress: home,
      }),
    });

    expect(screen.getByTestId('address-test-id')).to.exist;
    expect($('va-radio')).to.have.attribute(
      'label',
      'Did you travel from your home address?',
    );
    expect($('va-radio')).to.not.have.attribute('error');

    expect(screen.getByText(/345 Home Address St/i)).to.exist;
    expect(screen.getByText(/Apt. 22B/i)).to.exist;
    expect(screen.getByText(/Building 2/i)).to.exist;
    expect($('va-button-pair')).to.exist;

    fireEvent.click(
      $(
        `va-additional-info[trigger="If you didn't travel from your home address"]`,
      ),
    );
    expect(screen.getByText(/If you traveled from a different address/i)).to
      .exist;
  });

  it('should show an alert if no address', () => {
    const screen = renderWithStoreAndRouter(<AddressPage {...props} />, {
      initialState: getData(),
    });

    expect(screen.queryByTestId('address-test-id')).to.not.exist;
    expect($('va-button-pair')).to.not.exist;
    expect($('va-alert')).to.exist;
    expect(
      screen.getByText(`We can’t file this claim in this tool at this time`),
    ).to.exist;
    expect(screen.getByText('We need your home address')).to.exist;
    expect($('va-link[href="/profile/contact-information"]')).to.exist;
  });

  it('should render an error if no selection made', () => {
    renderWithStoreAndRouter(<AddressPage {...props} />, {
      initialState: getData({
        homeAddress: home,
      }),
    });
    $('va-button-pair').__events.primaryClick(); // continue
    expect($('va-radio')).to.have.attribute(
      'error',
      'You must make a selection to continue.',
    );
  });

  it('should render an error selection is "no"', async () => {
    renderWithStoreAndRouter(
      <AddressPage {...props} yesNo={{ ...props.yesNo, address: 'no' }} />,
      {
        initialState: getData({
          homeAddress: home,
        }),
      },
    );
    $('va-button-pair').__events.primaryClick(); // continue

    expect(setIsUnsupportedClaimType.calledWith(true)).to.be.true;
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
