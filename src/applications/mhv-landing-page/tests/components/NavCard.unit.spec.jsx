import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
import * as recordEventModule from 'platform/monitoring/record-event';
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
      expect(linkElement).to.have.attribute('href', 'https://www.va.gov');
      expect(linkElement).to.not.have.attribute('target', '_blank');
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
      expect(linkElement).to.have.attribute('href', 'https://www.google.com');
      expect(linkElement).to.have.attribute('target', '_blank');
      expect(linkElement.text).to.include(externalLinkText);
    });

    it('external links with omitExternalLinkText', () => {
      const links = [
        {
          text: 'some text',
          href: 'https://www.google.com',
          isExternal: true,
          omitExternalLinkText: true,
        },
      ];
      const { getByRole } = render(
        <NavCard title="Card title" links={links} />,
      );
      const linkElement = getByRole('link');
      expect(linkElement).to.have.attribute('href', 'https://www.google.com');
      expect(linkElement).to.not.have.attribute('target', '_blank');
      expect(linkElement.text).to.not.include(externalLinkText);
    });

    it('calls recordEvent and datadogRum when a link is clicked', async () => {
      const recordEventSpy = sinon.stub(recordEventModule, 'default');
      const datadogRumSpy = sinon.spy(datadogRum, 'addAction');
      const title = 'Card title';
      const text = 'some text';
      const links = [
        {
          text,
          href: 'https://www.google.com',
          isExternal: true,
          omitExternalLinkText: true,
        },
      ];
      const { getByRole } = render(<NavCard title={title} links={links} />);
      const linkElement = getByRole('link');

      linkElement.click();
      await waitFor(() => {
        expect(recordEventSpy.calledOnce).to.be.true;
        expect(datadogRumSpy.called).to.be.true;
      });
      expect(
        recordEventSpy.calledWithMatch({
          event: 'nav-linkslist',
          'links-list-header': text,
          'links-list-section-header': title,
        }),
      ).to.be.true;

      recordEventSpy.restore();
      datadogRumSpy.restore();
    });
  });

  describe('renders other properties', () => {
    it('introduction and tag', () => {
      const intructionText = 'This is my introduction.';
      const tagText = 'NEW';
      const { getByText, getAllByText } = render(
        <NavCard
          title="Card title"
          introduction={intructionText}
          tag={tagText}
        />,
      );
      expect(getByText(intructionText)).to.exist;
      expect(getAllByText(tagText)).to.exist;
    });
  });
});
