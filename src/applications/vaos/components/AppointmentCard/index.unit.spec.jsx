import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import AppointmentCard from '.';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';

describe('VAOS Component: AppointmentCard', () => {
  const initialState = {};

  it('should display appointment card with children', async () => {
    // Arrange
    const response = MockAppointmentResponse.createPhoneResponse();
    const appointment = MockAppointmentResponse.getTransformedResponse(
      response,
    );

    // Act
    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard appointment={appointment}>
        <h1 className="vads-u-margin-y--2p5">
          <p>This is a test</p>
        </h1>
      </AppointmentCard>,
      {
        initialState,
      },
    );

    // Assert
    expect(wrapper.getByTestId('appointment-card')).to.exist;
    expect(wrapper.getByText(/This is a test/i)).to.be.ok;
  });
});
