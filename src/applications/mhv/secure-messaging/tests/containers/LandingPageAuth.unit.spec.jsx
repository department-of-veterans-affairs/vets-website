import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import LandingPageAuth from '../../containers/LandingPageAuth';
import { PageTitles, ErrorMessages } from '../../util/constants';
import reducer from '../../reducers';
import folders from '../fixtures/folder-inbox-response.json';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

describe('Landing dashboard', () => {
  const initialState = {
    sm: {
      folders: { folder: folders.inbox },
    },
    user: {
      profile: {
        session: {
          ssoe: true,
        },
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<LandingPageAuth />, {
      initialState: state,
      reducers: reducer,
    });
  };

  it('verifies page title tag for landing page', async () => {
    setup();
    await waitFor(() => {
      expect(global.document.title).to.equal(PageTitles.DEFAULT_PAGE_TITLE_TAG);
    });
  });

  it('renders without errors', async () => {
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

  it('displays a number of unread messsages', async () => {
    const screen = setup();
    await waitFor(() => {
      expect(
        screen.getByText(
          `${folders.inbox.unreadCount} unread messages in your inbox`,
        ),
      ).to.exist;
    });
  });

  it('displays an error when unable to retrieve a folder', () => {
    const testState = {
      ...initialState,
      sm: { folders: { folder: null } },
    };
    const screen = setup(testState);
    expect(screen.getByText(ErrorMessages.LandingPage.GET_INBOX_ERROR)).to
      .exist;
  });

  it('displays a View Inbox button', () => {
    const screen = setup();
    expect(screen.getByText(`Go to your inbox`)).to.exist;
  });

  it('displays a Welcome message', () => {
    const screen = setup();
    expect(screen.getByText(`What to know as you try out this tool`)).to.exist;
  });

  it('displays a MHV URL Link', () => {
    const screen = setup();
    const link = screen.getByText(
      `Go back to the previous version of secure messaging`,
      {
        selector: 'a',
      },
    );
    expect(link).to.have.attribute(
      'href',
      mhvUrl(isAuthenticatedWithSSOe(initialState), 'secure-messaging'),
    );
    expect(link).to.have.attribute('target', '_blank');
  });

  it('displays a FAQ component', () => {
    const screen = setup();
    expect(screen.getByText(`Questions about using messages`)).to.exist;
  });
});
