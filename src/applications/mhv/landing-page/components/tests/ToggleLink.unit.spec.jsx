import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ToggleLink from '../ToggleLink';

describe('ToggleLink', () => {
  it('renders the new href, when available', async () => {
    const link = {
      href: '/foo',
      oldHref: '/bar',
      text: 'This is a link',
      toggle: '',
    };
    const screen = render(<ToggleLink link={link} />);
    const anchorLink = await screen.findByText('This is a link');
    expect(anchorLink).to.exist;
    expect(anchorLink.href.endsWith(link.href)).to.be.true;
  });

  it('renders the old href, when no new href is available', async () => {
    const link = {
      href: null,
      oldHref: '/bar',
      text: 'This is a link',
      toggle: '',
    };
    const screen = render(<ToggleLink link={link} />);
    const anchorLink = await screen.findByText('This is a link');
    expect(anchorLink).to.exist;
    expect(anchorLink.href.endsWith(link.oldHref)).to.be.true;
  });

  // TODO: Test feature toggle affecting which link is displayed
  it('renders the old href if the feature toggle is off');
  it('renders the new href if the feature toggle is on');
});
