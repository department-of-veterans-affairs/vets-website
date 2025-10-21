import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import TimezoneDiscrepancyMessage from '../../components/TimezoneDiscrepancyMessage';

describe('<TimezoneDiscrepancyMessage>', () => {
  let timezoneStub;

  afterEach(() => {
    if (timezoneStub) {
      timezoneStub.restore();
      timezoneStub = null;
    }
  });

  it('should render message with correct text', () => {
    const { getByText } = render(<TimezoneDiscrepancyMessage />);

    expect(getByText(/Files uploaded after.*will show as received/)).to.exist;
    expect(getByText(/but we record your submissions when you upload them/)).to
      .exist;
  });

  it('should display time and timezone abbreviation in message', () => {
    const { getByText } = render(<TimezoneDiscrepancyMessage />);

    const message = getByText(/Files uploaded (after|before)/);
    // Should include time format (H:MM a.m./p.m.) and timezone abbreviation
    expect(message.textContent).to.match(/\d{1,2}:\d{2}\s+(a|p)\.m\./);
    expect(message.textContent).to.match(
      /\d{1,2}:\d{2}\s+(a|p)\.m\.\s+[A-Z]{2,4}/,
    );
  });

  it('should include "Files uploaded after/before" prefix text', () => {
    const { getByText } = render(<TimezoneDiscrepancyMessage />);

    // Message should start with either "Files uploaded after" or "Files uploaded before"
    const message = getByText(/Files uploaded (after|before)/);
    expect(message.textContent).to.match(/^Files uploaded (after|before)/);
  });

  it('should include ending disclaimer text', () => {
    const { getByText } = render(<TimezoneDiscrepancyMessage />);

    expect(getByText(/but we record your submissions when you upload them/)).to
      .exist;
  });

  it('should NOT display message when in UTC timezone', () => {
    timezoneStub = sinon.stub(Date.prototype, 'getTimezoneOffset').returns(0);

    const { queryByText } = render(<TimezoneDiscrepancyMessage />);

    // Message should NOT exist
    expect(queryByText(/Files uploaded/)).to.not.exist;
    expect(queryByText(/will show as received/)).to.not.exist;
  });

  it('should conditionally render message based on timezone offset', () => {
    const { getByText, rerender, queryByText } = render(
      <TimezoneDiscrepancyMessage />,
    );

    // Initially message should exist
    expect(getByText(/Files uploaded/)).to.exist;

    // Mock UTC timezone
    timezoneStub = sinon.stub(Date.prototype, 'getTimezoneOffset').returns(0);

    // Re-render component
    rerender(<TimezoneDiscrepancyMessage />);

    // Message should NOT exist after timezone change
    expect(queryByText(/Files uploaded/)).to.not.exist;
  });
});
