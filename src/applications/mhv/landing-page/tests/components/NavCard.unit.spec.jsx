import React from 'react';
import { expect } from 'chai';
import { render, within } from '@testing-library/react';
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
  it('includes unread message count when greater than 0', () => {
    const unreadMessageCount = 4;
    const { getByRole } = renderCards(unreadMessageCount);

    const indicator = getByRole('status');
    const message = within(indicator).getByText(
      `${unreadMessageCount} unread messages`,
    );

    expect(indicator).to.exist;
    expect(message).to.exist;
  });

  it('does not include unread message count when message count is 0', () => {
    const unreadMessageCount = 0;
    const { queryByRole, queryByText } = renderCards(unreadMessageCount);

    const indicator = queryByRole('status');
    const message = queryByText(`${unreadMessageCount} unread messages`);

    expect(indicator).not.to.exist;
    expect(message).not.to.exist;
  });

  it('renders if message count is undefined', () => {
    const unreadMessageCount = undefined;
    const { getByRole } = renderCards(unreadMessageCount);

    const link = getByRole('link', { name: /inbox/i });

    expect(link).to.exist;
  });

  it('does not include unread message count when message count is undefined', () => {
    const unreadMessageCount = undefined;
    const { queryByRole, queryByText } = renderCards(unreadMessageCount);

    const indicator = queryByRole('status');
    const message = queryByText(`${unreadMessageCount} unread messages`);

    expect(indicator).not.to.exist;
    expect(message).not.to.exist;
  });
});
