/* eslint-disable camelcase */
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';

import TimezoneDiscrepancyMessage from '../../components/TimezoneDiscrepancyMessage';

// Helper function to create store with dynamic toggle control
const getStore = (toggleEnabled = true) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_timezone_discrepancy_mitigation: toggleEnabled,
    },
  }));

describe('<TimezoneDiscrepancyMessage>', () => {
  let timezoneStub;

  beforeEach(() => {
    // Stub CST timezone (-360 = UTC-6) for all tests by default
    // Individual tests can override by restoring and re-stubbing
    timezoneStub = sinon
      .stub(Date.prototype, 'getTimezoneOffset')
      .returns(-360);
  });

  afterEach(() => {
    if (timezoneStub) {
      timezoneStub.restore();
      timezoneStub = null;
    }
  });

  it('should render message with correct text', () => {
    const { getByText } = render(
      <Provider store={getStore(true)}>
        <TimezoneDiscrepancyMessage />
      </Provider>,
    );

    expect(getByText(/Files uploaded (after|before).*will show (with|as)/)).to
      .exist;
  });

  it('should display time and timezone abbreviation in message', () => {
    const { getByText } = render(
      <Provider store={getStore(true)}>
        <TimezoneDiscrepancyMessage />
      </Provider>,
    );

    const message = getByText(/Files uploaded (after|before)/);
    // Should include time format (H:MM a.m./p.m.) and timezone abbreviation
    expect(message.textContent).to.match(/\d{1,2}:\d{2}\s+(a|p)\.m\./);
    expect(message.textContent).to.match(
      /\d{1,2}:\d{2}\s+(a|p)\.m\.\s+[A-Z]{2,4}/,
    );
  });

  it('should include "Files uploaded after/before" prefix text', () => {
    const { getByText } = render(
      <Provider store={getStore(true)}>
        <TimezoneDiscrepancyMessage />
      </Provider>,
    );

    // Message should start with either "Files uploaded after" or "Files uploaded before"
    const message = getByText(/Files uploaded (after|before)/);
    expect(message.textContent).to.match(/^Files uploaded (after|before)/);
  });

  it('should include generic day reference for static messages', () => {
    const { getByText } = render(
      <Provider store={getStore(true)}>
        <TimezoneDiscrepancyMessage />
      </Provider>,
    );

    // Should include either "next day's date" or "previous day's date" for static messages
    const message = getByText(/Files uploaded (after|before)/);
    expect(message.textContent).to.match(/(next|previous) day's date/);
  });

  it('should NOT display message when in UTC timezone (offset = 0)', () => {
    // Restore beforeEach stub and re-stub with UTC timezone (0)
    timezoneStub.restore();
    timezoneStub = sinon.stub(Date.prototype, 'getTimezoneOffset').returns(0);

    const { queryByText } = render(
      <Provider store={getStore(true)}>
        <TimezoneDiscrepancyMessage />
      </Provider>,
    );

    // Message should NOT exist when timezone offset is 0 (UTC)
    expect(queryByText(/Files uploaded/)).to.not.exist;
    expect(queryByText(/will show (with|as)/)).to.not.exist;
  });

  it('should NOT display message when feature toggle is disabled', () => {
    const { queryByText } = render(
      <Provider store={getStore(false)}>
        <TimezoneDiscrepancyMessage />
      </Provider>,
    );

    // Message should NOT exist when toggle is disabled
    expect(queryByText(/Files uploaded/)).to.not.exist;
    expect(queryByText(/will show (with|as)/)).to.not.exist;
  });

  it('should conditionally render message based on feature toggle', () => {
    // Test with toggle ENABLED
    const { getByText, rerender, queryByText } = render(
      <Provider store={getStore(true)}>
        <TimezoneDiscrepancyMessage />
      </Provider>,
    );

    // Initially message should exist (toggle enabled)
    expect(getByText(/Files uploaded/)).to.exist;

    // Re-render with toggle DISABLED
    rerender(
      <Provider store={getStore(false)}>
        <TimezoneDiscrepancyMessage />
      </Provider>,
    );

    // Message should NOT exist after toggle disabled
    expect(queryByText(/Files uploaded/)).to.not.exist;
  });
});
