import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { resolveLandingPageLinks } from '../../utilities/data';
import NavCard from '../../components/NavCard';

describe('unread message indicator', () => {
  function renderCards(unreadMessageCount) {
    const { cards } = resolveLandingPageLinks(
      undefined,
      { featureToggles: {} },
      unreadMessageCount,
    );

    return render(
      cards.map(c => (
        <NavCard key={c.title} icon={c.icon} title={c.title} links={c.links} />
      )),
    );
  }

  const messagesMessage = 'You have unread messages. Go to your inbox.';

  it('includes unread messages message when greater than 0', () => {
    const unreadMessageCount = 4;
    const { getByText } = renderCards(unreadMessageCount);

    const inboxSpan = getByText('Inbox');
    const message = inboxSpan.parentNode.getAttribute('aria-label');

    expect(inboxSpan).to.exist;
    expect(message).to.equal(messagesMessage);
  });

  it('does not include unread messages message when message count is 0', () => {
    const unreadMessageCount = 0;
    const { queryByRole } = renderCards(unreadMessageCount);

    const indicator = queryByRole('status');

    expect(indicator).not.to.exist;
  });

  it('renders if message count is undefined', () => {
    const unreadMessageCount = undefined;
    const { getByRole } = renderCards(unreadMessageCount);

    const link = getByRole('link', { name: /inbox/i });

    expect(link).to.exist;
  });

  it('does not include unread messages message when message count is undefined', () => {
    const unreadMessageCount = undefined;
    const { queryByRole } = renderCards(unreadMessageCount);

    const indicator = queryByRole('status');

    expect(indicator).not.to.exist;
  });
});
