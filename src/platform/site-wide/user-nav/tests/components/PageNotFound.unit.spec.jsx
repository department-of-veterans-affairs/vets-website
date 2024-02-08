import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import PageNotFound from '../../components/PageNotFound';

describe('PageNotFound Component', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const { getByRole } = render(<PageNotFound {...props} />);
    getByRole('heading', { name: /we can’t find that page/ });
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledWith({ event: 'nav-404-error' })).to.be.true;
    });
  });
});
