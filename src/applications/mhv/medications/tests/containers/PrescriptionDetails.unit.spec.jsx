import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import PrescriptionDetails from '../../containers/PrescriptionDetails';
import rxDetailsResponse from '../fixtures/prescriptionDetails.json';
import nonVaRxResponse from '../fixtures/nonVaPrescription.json';
import { dateFormat } from '../../util/helpers';

describe('Prescription details container', () => {
  const initialState = {
    rx: {
      prescriptions: {
        prescriptionDetails: rxDetailsResponse.data.attributes,
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

  it('displays the prescription name and filled by date', () => {
    const screen = setup();

    const rxName = screen.findByText(
      rxDetailsResponse.data.attributes.prescriptionName,
    );

    expect(screen.getByTestId('rx-last-filled-date')).to.have.text(
      `Last filled on ${dateFormat(
        rxDetailsResponse.data.attributes.refillDate,
        'MMMM D, YYYY',
      )}`,
    );
    expect(rxName).to.exist;
  });
  it('displays "Information entered on" instead of "filled by" date, when med is non VA', () => {
    const nonVaRxState = {
      rx: {
        prescriptions: {
          prescriptionDetails: nonVaRxResponse.data.attributes,
        },
      },
    };
    const screen = setup(nonVaRxState);

    expect(screen.getByTestId('rx-last-filled-date')).to.have.text(
      `Information entered on ${dateFormat(
        nonVaRxResponse.data.attributes.orderedDate,
        'MMMM D, YYYY',
      )}`,
    );
  });
});
