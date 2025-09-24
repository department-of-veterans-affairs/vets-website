import React from 'react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import VAOnlineScheduling from '../../../components/messages/VAOnlineScheduling';

describe('VAOnlineScheduling', () => {
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
