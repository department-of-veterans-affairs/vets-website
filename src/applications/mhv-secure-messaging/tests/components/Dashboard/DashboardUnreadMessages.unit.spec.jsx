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
      },
    );
  };

  it('should not render alert header if inbox is undefined', () => {
    const { container } = setup(undefined);
    expect(container).to.not.be.empty;
    expect(container.querySelector('h2')).to.not.exist;
  });

  it('should render error message if inbox is null', () => {
    const { getByText } = setup(null);
    expect(getByText(ErrorMessages.LandingPage.GET_INBOX_ERROR)).to.exist;

    expect(getByText('Go to your inbox')).to.have.attribute(
      'href',
      Paths.INBOX,
    );
    expect(getByText('Start a new message')).to.have.attribute(
      'href',
      Paths.COMPOSE,
    );
  });

  it('should render unread message count if inbox is defined', () => {
    const customInbox = { ...inbox, unreadCount: 15 };
    const { getByText } = setup(customInbox);
    expect(
      getByText(`${customInbox.unreadCount} unread messages in your inbox`),
    ).to.exist;
    expect(getByText('Go to your inbox')).to.have.attribute(
      'href',
      Paths.INBOX,
    );
    expect(getByText('Start a new message')).to.have.attribute(
      'href',
      Paths.COMPOSE,
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
    const { getByText } = setup(customInbox);
    expect(
      getByText(`${customInbox.unreadCount} unread messages in your inbox`),
    ).to.exist;
    expect(getByText('Go to your inbox')).to.have.attribute(
      'href',
      Paths.INBOX,
    );
    expect(getByText('Start a new message')).to.have.attribute(
      'href',
      Paths.COMPOSE,
    );
  });
});
