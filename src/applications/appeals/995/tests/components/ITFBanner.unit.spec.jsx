import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ITFBanner from '../../components/ITFBanner';

describe('ITFBanner', () => {
  it('should render an error message', async () => {
    const { container } = render(<ITFBanner status="error" />);
    const h2 = $('va-alert h2', container);
    expect(h2.textContent).to.contain(
      'We’re sorry. Something went wrong on our end.',
    );
    await waitFor(() => {
      expect(document.activeElement).to.eq(h2);
    });
  });

  it('should render an itf found message', async () => {
    const { container } = render(<ITFBanner status="itf-found" />);
    const h2 = $('va-alert h2', container);
    expect(h2.textContent).to.contain('You already have an Intent to File');
    await waitFor(() => {
      expect(document.activeElement).to.eq(h2);
    });
  });

  it('should render an itf created message', async () => {
    const { container } = render(<ITFBanner status="itf-created" />);
    const h2 = $('va-alert h2', container);
    expect(h2.textContent).to.contain('You submitted an Intent to File');
    await waitFor(() => {
      expect(document.activeElement).to.eq(h2);
    });
  });

  it('should throw an error', () => {
    expect(() => {
      render(<ITFBanner status="nonsense" />);
    }).to.throw();
  });

  it('should navigate back from error', () => {
    const router = { push: sinon.spy() };
    const { container } = render(<ITFBanner status="error" router={router} />);
    fireEvent.click($('a', container)); // back
  });
  it('should navigate back from ITF found page', () => {
    const router = { push: sinon.spy() };
    const { container } = render(
      <ITFBanner status="itf-found" router={router} />,
    );
    $('va-button-pair', container).__events.secondaryClick(); // back
    expect(router.push.args[0][0]).to.contain('/introduction');
  });
  it('should dismiss ITF page', () => {
    const { container } = render(
      <ITFBanner status="itf-found">
        <div id="done">hello</div>
      </ITFBanner>,
    );
    $('va-button-pair', container).__events.primaryClick(); // continue
    expect($('#done', container)).to.exist;
  });
});
