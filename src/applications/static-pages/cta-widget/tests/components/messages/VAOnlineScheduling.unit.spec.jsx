import React from 'react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { mockLocation } from 'platform/testing/unit/helpers';
import VAOnlineScheduling from '../../../components/messages/VAOnlineScheduling';

describe('VAOnlineScheduling', () => {
  let restoreLocation;

  beforeEach(() => {
    // Use cross-origin URL to enable location assignment spying
    restoreLocation = mockLocation('https://va.gov/');
  });

  afterEach(() => {
    restoreLocation?.();
  });

  it('should redirect to appointments on button click', () => {
    const { container } = render(
      <VAOnlineScheduling
        featureToggles={{ vaOnlineSchedulingCommunityCare: true }}
      />,
    );
    const button = container.querySelector('va-button');
    expect(button).to.exist;
    userEvent.click(button);
    const location = window.location.href || window.location;
    expect(location).to.include('/my-health/appointments');
  });
});
