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
    const { dispStatus } = nonVaRxDetailsResponse.data.attributes;
    const status = screen.getAllByText(dispStatus);
    expect(status).to.exist;
  });

  //   it('displays the disclaimer', () => {
  //     const prescriptionWithDisclaimer = {...nonVaRxDetailsResponse.data.attributes, disclaimer: "TEST DISCLAIMER"}
  //     console.log(prescriptionWithDisclaimer)
  //     const screen = () => {
  //       return renderWithStoreAndRouter(<NonVaPrescription {...prescriptionWithDisclaimer} />, {
  //         initialState: {},
  //         reducers: {},
  //         path: '/prescriptions/1234567891',
  //       });}
  //     const disclaimer = screen.getAllByText("TEST DISCLAIMER")
  //     expect(disclaimer).to.exist
  //   });
});
