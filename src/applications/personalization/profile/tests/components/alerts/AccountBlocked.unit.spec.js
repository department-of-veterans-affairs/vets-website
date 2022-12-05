import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { AccountBlocked } from '@@profile/components/alerts/AccountBlocked';

// Import the recordCustomProfileEvent function from the util file
import { recordCustomProfileEvent } from '@@profile/util';

describe('AccountBlocked', () => {
  let clock;
  let recordCustomProfileEventSpy;

  beforeEach(() => {
    // Create a spy for recordCustomProfileEvent using sinon.spy()
    recordCustomProfileEventSpy = sinon.spy();

    // Replace the real recordCustomProfileEvent function with the spy
    recordCustomProfileEvent = recordCustomProfileEventSpy;

    // Create a clock for testing time-dependent behavior using sinon.useFakeTimers()
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    // Restore the original recordCustomProfileEvent function
    recordCustomProfileEvent.restore();

    // Restore the original timing functions
    clock.restore();
  });

  it('calls recordCustomProfileEvent with the correct arguments', () => {
    render(<AccountBlocked />);

    // Assert that recordCustomProfileEvent was called once
    expect(recordCustomProfileEventSpy.calledOnce).to.be.true;

    // Assert that recordCustomProfileEvent was called with the correct arguments
    expect(
      recordCustomProfileEventSpy.calledWith({
        status: 'Fiduciary Flag Views',
        title: `We can't show your information`,
      }),
    ).to.be.true;
  });
});
