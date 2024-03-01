import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import VaPrescription from '../../../components/PrescriptionDetails/VaPrescription';
import rxDetailsResponse from '../../fixtures/prescriptionDetails.json';
import { dateFormat } from '../../../util/helpers';

describe('vaPrescription details container', () => {
  const prescription = rxDetailsResponse.data.attributes;
  const newRx = { ...prescription, phoneNumber: '1234567891' };
  const setup = (rx = newRx) => {
    return renderWithStoreAndRouter(<VaPrescription {...rx} />, {
      initialState: {},
      reducers: {},
      path: '/prescriptions/1234567891',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });
  it('displays the formatted ordered date', () => {
    const screen = setup();
    const formattedDate = screen.getAllByText(
      dateFormat(rxDetailsResponse.data.attributes?.orderedDate),
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(formattedDate).to.exist;
  });

  it('displays the facility', () => {
    const screen = setup();
    const location = screen.getAllByText(
      rxDetailsResponse.data.attributes.facilityName,
    );
    expect(location).to.exist;
  });

  it('displays Shipped on in Refill History', () => {
    const screen = setup();
    const shippedOn = screen.getAllByText(
      dateFormat(
        rxDetailsResponse.data.attributes.trackingList[0][1][0]
          .completeDateTime,
      ),
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(shippedOn).to.exist;
  });
  it('displays the tracking number within Tracking Info', () => {
    const screen = setup();

    const trackingNumber = screen.getByTestId('tracking-number');

    expect(trackingNumber).to.exist;
    expect(trackingNumber).to.have.text(
      rxDetailsResponse.data.attributes.trackingList[0][1][0].trackingNumber,
    );
  });
  it('displays none noted if no phone number is provided', () => {
    const screen = setup(prescription);
    const pharmacyPhone = screen.queryByTestId('pharmacy-phone');

    expect(pharmacyPhone).to.not.exist;
  });
  it('displays "You haven’t filled this prescription yet" if there is no refil history', () => {
    const rxWithNoRefillHistory = {
      ...prescription,
      rxRfRecords: [],
      dispensedDate: undefined,
    };
    const screen = setup(rxWithNoRefillHistory);
    const haventFilledRxNotification = screen.getByText(
      'You haven’t filled this prescription yet.',
    );

    expect(haventFilledRxNotification).to.exist;
  });
});
