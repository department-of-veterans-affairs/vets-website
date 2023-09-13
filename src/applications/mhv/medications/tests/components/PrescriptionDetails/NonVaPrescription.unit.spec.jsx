import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import nonVaRxDetailsResponse from '../../fixtures/nonVaPrescription.json';
import NonVaPrescription from '../../../components/PrescriptionDetails/NonVaPrescription';

describe('nonVaPrescription details container', () => {
  const prescription = nonVaRxDetailsResponse.data.attributes;
  const setup = () => {
    return renderWithStoreAndRouter(<NonVaPrescription {...prescription} />, {
      initialState: {},
      reducers: {},
      path: '/prescriptions/1234567891',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays the status', () => {
    const screen = setup();
    const { refillStatus } = nonVaRxDetailsResponse.data.attributes;
    const status = screen.getAllByText(
      refillStatus.charAt(0).toUpperCase() + refillStatus.slice(1),
    );
    expect(status).to.exist;
  });
});
