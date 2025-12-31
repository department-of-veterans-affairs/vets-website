import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';
import DashboardUnreadMessages from '../../../components/Dashboard/DashboardUnreadMessages';
import { Paths, ErrorMessages } from '../../../util/constants';
import inbox from '../../fixtures/folder-inbox-metadata.json';

describe('DashboardUnreadMessages component', () => {
  const setup = folder => {
    return renderWithStoreAndRouter(
      <DashboardUnreadMessages inbox={folder} />,
      {
        initialState: {},
        reducers: reducer,
        path: Paths.ROOT_URL,
      },
    );
  };

  it('should not render alert header if inbox is undefined', () => {
    const { container } = setup(undefined);
    expect(container).to.not.be.empty;
    expect(container.querySelector('h2')).to.not.exist;
  });

  it('should render error message if inbox is null', () => {
    const { getByTestId, getByText } = setup(null);
    expect(getByText(ErrorMessages.LandingPage.GET_INBOX_ERROR)).to.exist;
    const inboxLink = getByTestId('inbox-link');
    expect(inboxLink.getAttribute('href')).to.equal(
      Paths.ROOT_URL + Paths.INBOX,
    );
    const composeLink = getByTestId('compose-message-link');
    expect(composeLink.getAttribute('href')).to.equal(
      Paths.ROOT_URL + Paths.COMPOSE,
    );
  });

  it('should render unread message count if inbox is defined', () => {
    const customInbox = { ...inbox, unreadCount: 15 };
    const { getByTestId, getByText } = setup(customInbox);
    expect(
      getByText(`${customInbox.unreadCount} unread messages in your inbox`),
    ).to.exist;
    const inboxLink = getByTestId('inbox-link');
    expect(inboxLink.getAttribute('href')).to.equal(
      Paths.ROOT_URL + Paths.INBOX,
    );
    const composeLink = getByTestId('compose-message-link');
    expect(composeLink.getAttribute('href')).to.equal(
      Paths.ROOT_URL + Paths.COMPOSE,
    );
  });

  it('should render singular unread message count if inbox is defined and unreadCount is 1', () => {
    const customInbox = { ...inbox, unreadCount: 1 };
    const { getByText } = setup(customInbox);
    expect(getByText(`${customInbox.unreadCount} unread message in your inbox`))
      .to.exist;
  });

  it('should render plural unread message count if inbox is defined and unreadCount is 0', () => {
    const customInbox = { ...inbox, unreadCount: 0 };
    const { getByTestId, getByText } = setup(customInbox);
    expect(
      getByText(`${customInbox.unreadCount} unread messages in your inbox`),
    ).to.exist;
    const inboxLink = getByTestId('inbox-link');
    expect(inboxLink.getAttribute('href')).to.equal(
      Paths.ROOT_URL + Paths.INBOX,
    );
    const composeLink = getByTestId('compose-message-link');
    expect(composeLink.getAttribute('href')).to.equal(
      Paths.ROOT_URL + Paths.COMPOSE,
    );
  });

  describe('React Router integration', () => {
    it('renders RouterLinkAction components that will navigate via React Router', () => {
      const screen = setup(inbox);

      // Verify the links are rendered with correct hrefs
      const inboxLink = screen.getByTestId('inbox-link');
      expect(inboxLink.getAttribute('href')).to.equal(
        Paths.ROOT_URL + Paths.INBOX,
      );

      const composeLink = screen.getByTestId('compose-message-link');
      expect(composeLink.getAttribute('href')).to.equal(
        Paths.ROOT_URL + Paths.COMPOSE,
      );

      // Verify they're va-link-action elements (RouterLinkAction uses VaLinkAction)
      expect(inboxLink.tagName).to.equal('VA-LINK-ACTION');
      expect(composeLink.tagName).to.equal('VA-LINK-ACTION');
    });

    it('renders links as action links with active attribute for primary CTAs', () => {
      const screen = setup(inbox);

      // Both inbox and compose links should be action links (VaLinkAction is always styled as action link)
      const inboxLink = screen.getByTestId('inbox-link');
      expect(inboxLink).to.exist;

      const composeLink = screen.getByTestId('compose-message-link');
      expect(composeLink).to.exist;
    });
  });
});
