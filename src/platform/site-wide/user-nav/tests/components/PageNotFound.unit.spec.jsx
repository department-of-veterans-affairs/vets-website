import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import PageNotFound, {
  pageNotFoundHeading,
  pageNotFoundTitle,
  pageNotFoundTestId,
  pageNotFoundEvent,
} from '../../components/PageNotFound';

describe('PageNotFound Component', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const { getByRole, getByTestId } = render(<PageNotFound {...props} />);
    const heading = getByRole('heading', { name: pageNotFoundHeading });
    expect(heading).to.exist;
    getByTestId(pageNotFoundTestId);

    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledWith({ event: pageNotFoundEvent })).to.be.true;
      expect(document.activeElement).to.eq(heading);
      expect(document.title).to.eql(pageNotFoundTitle);
    });
  });
});
