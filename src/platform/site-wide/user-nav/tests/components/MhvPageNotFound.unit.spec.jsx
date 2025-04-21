import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import MhvPageNotFound, {
  mhvPageNotFoundHeading,
  mhvPageNotFoundTitle,
  mhvPageNotFoundTestId,
  mhvPageNotFoundEvent,
  healthResources,
} from '../../components/MhvPageNotFound';

let sandbox;
let recordEvent;

describe('PageNotFound Component', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    recordEvent = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('can be asserted in other specs via its test id', () => {
    const { getByTestId } = render(<MhvPageNotFound />);
    getByTestId(mhvPageNotFoundTestId);
  });

  it('renders a relevant h1, and sets as the active element', async () => {
    const { getByRole } = render(<MhvPageNotFound />);
    const heading = getByRole('heading', {
      name: mhvPageNotFoundHeading,
      level: 1,
    });
    expect(heading).to.exist;

    await waitFor(() => {
      expect(document.activeElement).to.eq(heading);
    });
  });

  it('sets the page title', async () => {
    render(<MhvPageNotFound />);
    await waitFor(() => {
      expect(document.title).to.eql(mhvPageNotFoundTitle);
    });
  });

  it('reports to analytics', async () => {
    const props = { recordEvent };
    render(<MhvPageNotFound {...props} />);

    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledWith({ event: mhvPageNotFoundEvent })).to.be
        .true;
    });
  });

  it('renders links to health resources', () => {
    const { findByRole } = render(<MhvPageNotFound />);
    healthResources.forEach(({ href, text }) => {
      findByRole('link', { name: text, href });
    });
  });
});
