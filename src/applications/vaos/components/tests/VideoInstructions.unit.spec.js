import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import VideoInstructions from '../VideoInstructions';

describe('VAOS Component: VideoInstructions', () => {
  it('should display instructions for video visit', async () => {
    // Arrange & Act
    const screen = render(<VideoInstructions />);

    // Assert
    expect(
      screen.container.querySelector(
        'va-additional-info[trigger="How to setup your device"]',
      ),
    ).to.be.ok;

    expect(
      screen.getByRole('heading', {
        name: /Before your appointment:/g,
      }),
    ).to.be.ok;

    expect(
      screen.getByRole('heading', {
        name: /To have the best possible video experience, we recommend you:/g,
      }),
    ).to.be.ok;

    expect(
      screen.getByRole('link', {
        name: /VA Video Connect iOS app Link opens in a new tab/i,
      }),
    ).to.be.ok;
  });
});
