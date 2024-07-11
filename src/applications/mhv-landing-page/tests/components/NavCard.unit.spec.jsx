import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  resolveLandingPageLinks,
  resolveUnreadMessageAriaLabel,
} from '../../utilities/data';
import NavCard, { externalLinkText } from '../../components/NavCard';

describe('NavCard component', () => {
  describe('unread message indicator', () => {
    function renderCards(unreadMessageCount) {
      const unreadMessageAriaLabel = resolveUnreadMessageAriaLabel(
        unreadMessageCount,
      );
      const { cards } = resolveLandingPageLinks(
        undefined,
        { featureToggles: {} },
        unreadMessageAriaLabel,
      );

      return render(
        cards.map(c => (
          <NavCard
            key={c.title}
            icon={c.icon}
            title={c.title}
            links={c.links}
            aria-label={c.ariaLabel}
          />
        )),
      );
    }

    const messagesMessage = 'You have unread messages. Go to your inbox.';

    it('includes unread messages message when greater than 0', () => {
      const unreadMessageCount = 4;
      const { getByText } = renderCards(unreadMessageCount);

      const inboxSpan = getByText('Go to inbox');
      const message = inboxSpan.parentNode.getAttribute('aria-label');

      expect(inboxSpan).to.exist;
      expect(message).to.equal(messagesMessage);
    });

    it('does not include unread messages message when message count is 0', () => {
      const unreadMessageCount = 0;
      const { queryByRole, getByText } = renderCards(unreadMessageCount);
      const indicator = queryByRole('status');

      expect(indicator).not.to.exist;

      const inboxSpan = getByText('Go to inbox');
      const message = inboxSpan.parentNode.getAttribute('aria-label');

      expect(message).to.not.exist;
    });

    it('renders if message count is undefined', () => {
      const { getByRole } = renderCards(undefined);

      const link = getByRole('link', { name: /inbox/i });

      expect(link).to.exist;
    });

    it('does not include unread messages message when message count is undefined', () => {
      const { queryByRole } = renderCards(undefined);

      const indicator = queryByRole('status');

      expect(indicator).not.to.exist;
    });
  });

  describe('link rendering', () => {
    it('internal links', () => {
      const links = [{ text: 'some text', href: 'https://www.va.gov' }];
      const { getByRole } = render(
        <NavCard title="Card title" links={links} />,
      );
      const linkElement = getByRole('link');
      expect(linkElement.text).to.not.include(externalLinkText);
    });

    it('external links', () => {
      const links = [
        { text: 'some text', href: 'https://www.google.com', isExternal: true },
      ];
      const { getByRole } = render(
        <NavCard title="Card title" links={links} />,
      );
      const linkElement = getByRole('link');
      expect(linkElement.text).to.include(externalLinkText);
    });
  });
});
