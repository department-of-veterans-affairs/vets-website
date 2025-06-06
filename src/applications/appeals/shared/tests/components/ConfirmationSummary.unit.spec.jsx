import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import {
  ConfirmationSummary,
  ConfirmationReturnLink,
} from '../../components/ConfirmationSummary';

describe('ConfirmationSummary', () => {
  it('should render a page summary without a download summary', () => {
    const { container } = render(
      <ConfirmationSummary name="testing1" downloadUrl="" />,
    );

    const screenContent = $('.screen-only', container);
    const h3s = $$('h3', screenContent);
    const ps = $$('p', screenContent);

    expect(h3s.length).to.eq(1);
    expect(ps.length).to.eq(1);
    expect($('va-button', container).getAttribute('text')).to.contain(
      'Print this page',
    );
  });

  it('should render a page summary with a download summary', () => {
    mockApiRequest({});
    const { container } = render(
      <ConfirmationSummary name="testing2" downloadUrl="test" />,
    );

    const screenContent = $('.screen-only', container);
    expect($$('h3', screenContent).length).to.eq(2);
    expect($$('p', screenContent).length).to.eq(4);
  });
});

describe('ConfirmationReturnLink', () => {
  it('should render page title', () => {
    const { container } = render(<ConfirmationReturnLink />);
    const screenContent = $('.screen-only', container);
    const link = $('va-link-action', screenContent);

    expect(link.getAttribute('href')).to.eq('/');
    expect(link.getAttribute('text')).to.contain('Go back to VA.gov');
  });
});
