import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  MhvUnauthorizedContent,
  mhvUnauthorizedHeading,
  mhvUnauthorizedTitle,
  mhvUnauthorizedTestId,
  mhvUnauthorizedEvent,
} from '../../components/MhvUnauthorized';

let sandbox;
let recordEvent;

describe('MhvUnauthorized Component', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    recordEvent = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('can be asserted in other specs via its test id', () => {
    const { getByTestId } = render(<MhvUnauthorizedContent />);
    getByTestId(mhvUnauthorizedTestId);
  });

  it('renders a relevant h1, and sets as the active element', async () => {
    const { getByRole } = render(<MhvUnauthorizedContent />);
    const heading = getByRole('heading', {
      name: mhvUnauthorizedHeading,
      level: 1,
    });
    expect(heading).to.exist;

    await waitFor(() => {
      expect(document.activeElement).to.eq(heading);
    });
  });

  it('sets the page title', async () => {
    render(<MhvUnauthorizedContent />);
    await waitFor(() => {
      expect(document.title).to.eql(mhvUnauthorizedTitle);
    });
  });

  it('reports to analytics', async () => {
    const props = { recordEvent };
    render(<MhvUnauthorizedContent {...props} />);

    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledWith({ event: mhvUnauthorizedEvent })).to.be
        .true;
    });
  });
});
