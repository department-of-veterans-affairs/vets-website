import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import PrescriptionDetails from '../../containers/PrescriptionDetails';
import prescriptions from '../fixtures/presciptions.json';
import { dateFormat } from '../../util/helpers';

describe('Prescription details container', () => {
  const initialState = {
    rx: {
      prescriptions: {
        prescriptionDetails: prescriptions[0],
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<PrescriptionDetails />, {
      initialState: state,
      reducers: reducer,
      path: '/prescriptions/1234567891',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays a print button', () => {
    const screen = setup();
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the prescription name', () => {
    const screen = setup();

    const prescriptionName = screen.getByText(
      initialState.rx.prescriptions.prescriptionDetails.prescriptionName,
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(prescriptionName).to.exist;
  });

  it('displays the formatted ordered date', () => {
    const screen = setup();
    const formattedDate = screen.getAllByText(
      dateFormat(
        initialState.rx.prescriptions.prescriptionDetails?.orderedDate,
        'MMMM D, YYYY',
      ),
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
      initialState.rx.prescriptions.prescriptionDetails.facilityName,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(location).to.exist;
  });

  it('displays Shipped on in Refill History', () => {
    const screen = setup();
    const shippedOn = screen.getAllByText(
      dateFormat(
        initialState.rx.prescriptions.prescriptionDetails.trackingList[0][1][1]
          .completeDateTime,
        'MMMM D, YYYY [at] h:mm z',
      ),
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(shippedOn).to.exist;
  });
});
