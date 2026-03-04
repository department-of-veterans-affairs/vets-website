import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as monitoring from '~/platform/monitoring/record-event';
import GovBanner from '~/platform/site-wide/representative/components/header/GovBanner';

describe('GovBanner', () => {
  let recordEventStub;

  beforeEach(() => {
    recordEventStub = sinon.stub(monitoring, 'default');
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  const subject = () => render(<GovBanner />);

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });

  it('calls recordEvent with accordion-expand on first click', () => {
    const { getByTestId } = subject();
    const toggleButton = getByTestId('official-govt-site-toggle');

    fireEvent.click(toggleButton);

    expect(recordEventStub.calledOnce).to.be.true;
    expect(recordEventStub.calledWith({ event: 'int-accordion-expand' })).to.be
      .true;
  });

  it('calls recordEvent with accordion-collapse on second click', () => {
    const { getByTestId } = subject();
    const toggleButton = getByTestId('official-govt-site-toggle');

    fireEvent.click(toggleButton); // Expand
    fireEvent.click(toggleButton); // Collapse

    expect(recordEventStub.calledTwice).to.be.true;
    expect(
      recordEventStub.firstCall.calledWith({ event: 'int-accordion-expand' }),
    ).to.be.true;
    expect(
      recordEventStub.secondCall.calledWith({
        event: 'int-accordion-collapse',
      }),
    ).to.be.true;
  });
});
