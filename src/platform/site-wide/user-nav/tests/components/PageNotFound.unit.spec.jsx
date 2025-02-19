import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import PageNotFound, {
  notFoundHeading,
  notFoundTitle,
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

  it('renders', async () => {
    const props = { recordEvent };
    const { getByRole, getByTestId } = render(<PageNotFound {...props} />);
    const heading = getByRole('heading', { name: notFoundHeading });
    expect(heading).to.exist;
    getByTestId('page-not-found');

    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledWith({ event: 'nav-404-error' })).to.be.true;
      expect(document.activeElement).to.eq(heading);
      expect(document.title).to.eql(notFoundTitle);
    });
  });
});
