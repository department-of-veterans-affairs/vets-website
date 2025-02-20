import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import PageNotFound, {
  pageNotFoundHeading,
  pageNotFoundTitle,
  pageNotFoundTestId,
  pageNotFoundEvent,
  helpfulLinks,
} from '../../components/PageNotFound';

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
    const { getByTestId } = render(<PageNotFound />);
    getByTestId(pageNotFoundTestId);
  });

  it('renders a relevant h1, and sets as the active element', async () => {
    const { getByRole } = render(<PageNotFound />);
    const heading = getByRole('heading', {
      name: pageNotFoundHeading,
      level: 1,
    });
    expect(heading).to.exist;

    await waitFor(() => {
      expect(document.activeElement).to.eq(heading);
    });
  });

  it('sets the page title', async () => {
    render(<PageNotFound />);
    await waitFor(() => {
      expect(document.title).to.eql(pageNotFoundTitle);
    });
  });

  it('reports to analytics', async () => {
    const props = { recordEvent };
    render(<PageNotFound {...props} />);

    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledWith({ event: pageNotFoundEvent })).to.be.true;
    });
  });

  it('renders helpful links', () => {
    const { findByRole } = render(<PageNotFound />);
    helpfulLinks.forEach(({ href, text }) => {
      findByRole('link', { name: text, href });
    });
  });
});
