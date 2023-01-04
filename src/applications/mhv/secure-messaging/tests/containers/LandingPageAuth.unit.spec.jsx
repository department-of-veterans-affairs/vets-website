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

  it('renders without errors', () => {
    const screen = setup();
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
    const screen = setup();
    const unreadCount = unreadCountAllFolders(folderList);
    expect(screen.getByText(`You have ${unreadCount} unread messages`)).to
      .exist;
  });

  it('displays a View Inbox button', () => {
    const screen = setup();
    expect(screen.getByText(`View Inbox`)).to.exist;
  });

  it('displays a Welcome message', () => {
    const screen = setup();
    expect(screen.getByText(`Welcome to the updated messaging tool`)).to.exist;
  });

  it('displays a search component', () => {
    const screen = setup();
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
    const screen = setup();
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
    const screen = setup();
    expect(screen.getByText(`Questions about this messaging tool`)).to.exist;
  });
});
