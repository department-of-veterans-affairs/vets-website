import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import LandingPageAuth from '../../containers/LandingPageAuth';
import reducer from '../../reducers';
import folderList from '../fixtures/folder-response.json';
import { unreadCountAllFolders } from '../../util/helpers';

describe('Landing dashboard', () => {
  const initialState = {
    sm: {
      folders: { folderList },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<LandingPageAuth />, {
      initialState: state,
      reducers: reducer,
    });
  };

  let screen = null;
  beforeEach(() => {
    screen = setup();
  });

  it('renders without errors', () => {
    expect(
      screen.getByText(
        'Communicate privately and securely with your VA health care team online.',
        {
          exact: true,
        },
      ),
    ).to.exist;
  });

  it('displays a number of unread messsages', () => {
    const unreadCount = unreadCountAllFolders(folderList);
    expect(screen.getByText(`You have ${unreadCount} unread messages`)).to
      .exist;
  });

  it('displays a View Inbox button', () => {
    expect(screen.getByText(`View Inbox`)).to.exist;
  });

  it('displays a Welcome message', () => {
    expect(screen.getByText(`Welcome to the updated messaging tool`)).to.exist;
  });

  it('displays a search component', () => {
    expect(
      screen.getByText(`Search for messages`, {
        exact: true,
      }),
    ).to.exist;
    expect(
      screen.getByText(`Search messages`, {
        exact: true,
      }),
    ).to.exist;
  });

  it('displays a Folders List component', () => {
    expect(
      screen.getByText(`Folders`, {
        exact: true,
      }),
    ).to.exist;
    expect(
      screen.getByText(`TESTAGAIN`, {
        exact: true,
        selector: 'a',
      }),
    ).to.exist;
  });

  it('displays a FAQ component', () => {
    expect(screen.getByText(`Questions about this messaging tool`)).to.exist;
  });
});
