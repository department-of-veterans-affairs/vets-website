import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import LandingPageAuth from '../../containers/LandingPageAuth';
import { PageTitles } from '../../util/constants';
import reducer from '../../reducers';
import folderList from '../fixtures/folder-response.json';
import { unreadCountInbox } from '../../util/helpers';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

describe('Landing dashboard', () => {
  const initialState = {
    sm: {
      folders: { folderList },
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

  let screen = null;
  beforeEach(() => {
    screen = setup();
  });

  it('verifies page title tag for landing page', async () => {
    await waitFor(() => {
      expect(global.document.title).to.equal(PageTitles.DEFAULT_PAGE_TITLE_TAG);
    });
  });

  it('renders without errors', async () => {
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
    const unreadCount = unreadCountInbox(folderList);
    await waitFor(() => {
      expect(screen.getByText(`${unreadCount} unread messages in your inbox`))
        .to.exist;
    });
  });

  it('displays a View Inbox button', () => {
    expect(screen.getByText(`Go to your inbox`)).to.exist;
  });

  it('displays a Welcome message', () => {
    expect(screen.getByText(`What to know as you try out this tool`)).to.exist;
  });

  it('displays a MHV URL Link', () => {
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
    expect(screen.getByText(`Questions about using messages`)).to.exist;
  });
});
