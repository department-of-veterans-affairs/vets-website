import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';

import useSkipLinkFix from '../../../shared/hooks/useSkipLinkFix';

describe('useSkipLinkFix', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('adds a chatbot skip link after the content skip link', () => {
    const skipLink = document.createElement('a');
    skipLink.className = 'show-on-focus';
    skipLink.setAttribute('href', '#content');
    skipLink.setAttribute('onclick', 'return false');
    skipLink.innerHTML = 'Skip to content';
    document.body.appendChild(skipLink);

    renderHook(() => useSkipLinkFix());

    expect(skipLink.hasAttribute('onclick')).to.be.true;
    expect(skipLink.innerHTML).to.equal('Skip to content');
    expect(skipLink.getAttribute('href')).to.equal('#content');

    const chatbotSkipLink = skipLink.nextElementSibling;
    expect(chatbotSkipLink).to.not.equal(null);
    expect(chatbotSkipLink.className).to.equal('show-on-focus');
    expect(chatbotSkipLink.getAttribute('href')).to.equal('#chatbot-header');
    expect(chatbotSkipLink.innerHTML).to.equal('Skip to Chatbot');
  });

  it('ignores the DOM when the skip link does not match', () => {
    const otherLink = document.createElement('a');
    otherLink.className = 'show-on-focus';
    otherLink.setAttribute('href', '#other');
    document.body.appendChild(otherLink);

    renderHook(() => useSkipLinkFix());

    expect(otherLink.getAttribute('href')).to.equal('#other');
    expect(otherLink.innerHTML).to.equal('');
    expect(otherLink.nextElementSibling).to.equal(null);
  });
});
