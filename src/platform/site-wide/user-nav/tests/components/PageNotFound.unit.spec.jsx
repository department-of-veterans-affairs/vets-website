import React from 'react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import PageNotFound, {
  notFoundHeading,
  hasPageNotFound,
} from '../../components/PageNotFound';

describe('PageNotFound Component', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const { getByRole } = render(<PageNotFound {...props} />);
    expect(getByRole('heading', { name: notFoundHeading })).to.exist;
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledWith({ event: 'nav-404-error' })).to.be.true;
    });
  });

  it('can detect a page not found in children', async () => {
    expect(hasPageNotFound(null)).to.be.false;
    expect(hasPageNotFound(undefined)).to.be.false;
    expect(hasPageNotFound(<></>)).to.be.false;
    expect(
      hasPageNotFound(
        <div>
          <div />
        </div>,
      ),
    ).to.be.false;
    expect(hasPageNotFound(<PageNotFound />)).to.be.true;
    expect(
      hasPageNotFound(
        <div>
          <div>
            <PageNotFound />
          </div>
        </div>,
      ),
    ).to.be.true;
  });

  it('hides the VA breadcrumbs', async () => {
    const { container } = render(
      <>
        <va-breadcrumbs class="va-nav-breadcrumbs">
          <a href="/">Home</a>S
        </va-breadcrumbs>
        <PageNotFound />
      </>,
    );
    expect($('.va-nav-breadcrumbs', container)).to.exist;
    expect($('.va-nav-breadcrumbs', container).style.display).to.equal('none');
  });
});
