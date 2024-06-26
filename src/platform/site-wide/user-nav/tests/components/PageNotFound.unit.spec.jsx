import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import PageNotFound, { notFoundTitle } from '../../components/PageNotFound';

describe('PageNotFound Component', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    // const { getByRole } = render(<PageNotFound {...props} />);
    // const heading = getByRole('heading', { name: notFoundHeading });
    const { container } = render(<PageNotFound {...props} />);
    const heading = $('h1', container);
    expect(heading).to.exist;
    expect(document.activeElement).to.eq(heading);
    expect(document.title).to.eql(notFoundTitle);
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledWith({ event: 'nav-404-error' })).to.be.true;
    });
  });
});
