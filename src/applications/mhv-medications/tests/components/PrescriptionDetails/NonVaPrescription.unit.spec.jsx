import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import nonVaRxDetailsResponse from '../../fixtures/nonVaPrescription.json';
import NonVaPrescription from '../../../components/PrescriptionDetails/NonVaPrescription';

describe('nonVaPrescription details container', () => {
  const prescription = nonVaRxDetailsResponse.data.attributes;
  const setup = (rx = prescription) => {
    return renderWithStoreAndRouter(<NonVaPrescription {...rx} />, {
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
    const { dispStatus } = nonVaRxDetailsResponse.data.attributes;
    const status = screen.getAllByText(dispStatus);
    expect(status).to.exist;
  });

  it('displays prescription disclaimer', () => {
    const screen = setup({ ...prescription, disclaimer: 'test disclaimer' });
    expect(screen.findByText('test disclaimer')).to.exist;
  });
});
