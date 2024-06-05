import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { render } from '@testing-library/react';
import { MockAppointment } from '../../../../tests/mocks/unit-test-helpers';
import { VIDEO_TYPES } from '../../../../utils/constants';
import VideoInstructionsLink from '../VideoInstructionsLink';

describe('VAOS Component: VAInstructionsLink', () => {
  it('should display instructions for video visit', async () => {
    // Arrange
    const mockAppointment = new MockAppointment({ start: moment() });
    mockAppointment.setComment('Video Visit Preparation');
    mockAppointment.setKind(VIDEO_TYPES.mobile);

    // Act
    const screen = render(
      <VideoInstructionsLink appointment={mockAppointment} />,
    );

    // Assert
    const heading = await screen.getByRole('heading', {
      name: /Before your appointment:/g,
    });
    expect(heading).to.be.ok;

    const link = await screen.findByRole('link', {
      name: /VA Video Connect iOS app Link opens in a new tab/i,
    });
    expect(link).to.be.ok;
  });

  it('should display instructions for medication review', async () => {
    // Arrange
    const mockAppointment = new MockAppointment({ start: moment() });
    mockAppointment.setComment('Medication Review');
    mockAppointment.setKind(VIDEO_TYPES.mobile);

    // Act
    const screen = render(
      <VideoInstructionsLink appointment={mockAppointment} />,
    );

    // Assert
    const link = await screen.findByRole('heading', {
      name: /Medication review/i,
    });
    expect(link).to.be.ok;
  });
});
