import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';

import useSkipLinkFix from '../../hooks/useSkipLinkFix';

describe('useSkipLinkFix', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('updates the skip link to target the chatbot header', () => {
    const skipLink = document.createElement('a');
    skipLink.className = 'show-on-focus';
    skipLink.setAttribute('href', '#content');
    skipLink.setAttribute('onclick', 'return false');
    skipLink.innerHTML = 'Skip to content';
    document.body.appendChild(skipLink);

    renderHook(() => useSkipLinkFix());

    expect(skipLink.hasAttribute('onclick')).to.be.false;
    expect(skipLink.innerHTML).to.equal('Skip to chatbot');
    expect(skipLink.getAttribute('href')).to.equal('#chatbot-header');
  });

  it('ignores the DOM when the skip link does not match', () => {
    const otherLink = document.createElement('a');
    otherLink.className = 'show-on-focus';
    otherLink.setAttribute('href', '#other');
    document.body.appendChild(otherLink);

    renderHook(() => useSkipLinkFix());

    expect(otherLink.getAttribute('href')).to.equal('#other');
    expect(otherLink.innerHTML).to.equal('');
  });
});
