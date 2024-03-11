import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { format, addHours } from 'date-fns';
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

  const downtimeApproaching = maintenanceWindows => {
    return createServiceMap(
      maintenanceWindows.map(maintenanceWindow => {
        return {
          attributes: {
            externalService: maintenanceWindow,
            status: 'downtimeApproaching',
            startTime: format(addHours(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
            endTime: format(addHours(new Date(), 3), "yyyy-LL-dd'T'HH:mm:ss"),
          },
        };
      }),
    );
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
    expect(screen.getByText(`Start a new message`)).to.exist;
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

  it('displays a FAQ component with phase 1 copy if phase 1 is enabled', () => {
    const customState = {
      featureToggles: {},
      ...initialState,
    };
    customState.featureToggles[`${'mhv_secure_messaging_to_phase_1'}`] = true;
    const screen = renderWithStoreAndRouter(<LandingPageAuth />, {
      initialState: customState,
      reducers: reducer,
    });
    expect(screen.queryByText(/Who can I send messages to?/)).to.exist;
    expect(screen.queryByText(/Who can I communicate with in messages?/)).to.not
      .exist;
  });

  it('displays a FAQ component with phase 1 copy if phase 1 is disabled', () => {
    const customState = {
      featureToggles: {},
      ...initialState,
    };
    customState.featureToggles[`${'mhv_secure_messaging_to_phase_1'}`] = false;
    const screen = renderWithStoreAndRouter(<LandingPageAuth />, {
      initialState: customState,
      reducers: reducer,
    });
    expect(screen.queryByText(/Who can I send messages to?/)).to.not.exist;
    expect(screen.queryByText(/Who can I communicate with in messages?/)).to
      .exist;
  });

  it('displays a no-fees FAQ component if phase 1 is enabled', () => {
    const customState = {
      featureToggles: {},
      ...initialState,
    };
    customState.featureToggles[`${'mhv_secure_messaging_to_phase_1'}`] = true;
    const screen = renderWithStoreAndRouter(<LandingPageAuth />, {
      initialState: customState,
      reducers: reducer,
    });
    expect(
      screen.queryByText(
        /Will I need to pay a copay for using this messaging tool?/,
      ),
    ).to.exist;
    const allFAQs = screen.getAllByTestId('faq-accordion-item');
    expect(allFAQs.length).to.equal(5);
  });

  it('does not display a no-fees FAQ component if phase 1 is disabled', () => {
    const customState = {
      featureToggles: {},
      ...initialState,
    };
    customState.featureToggles[`${'mhv_secure_messaging_to_phase_1'}`] = false;
    const screen = renderWithStoreAndRouter(<LandingPageAuth />, {
      initialState: customState,
      reducers: reducer,
    });
    expect(
      screen.queryByText(
        /Will I need to pay a copay for using this messaging tool?/,
      ),
    ).to.not.exist;
    const allFAQs = screen.getAllByTestId('faq-accordion-item');
    expect(allFAQs.length).to.equal(4);
  });

  it('displays downtimeNotification when downtimeApproaching is true', () => {
    const customState = {
      featureToggles: {},
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: downtimeApproaching(['mhv_sm']),
        dismissedDowntimeWarnings: [],
      },
      ...initialState,
    };
    customState.featureToggles[`${'mhv_secure_messaging_to_phase_1'}`] = false;
    const screen = renderWithStoreAndRouter(<LandingPageAuth />, {
      initialState: customState,
      reducers: reducer,
    });

    expect(
      screen.getByText('Upcoming maintenance on My HealtheVet', {
        selector: 'h2',
        exact: true,
      }),
    );
    expect(
      screen.getByText(
        'We’ll be working on My HealtheVet soon. The maintenance will last 2 hours',
        {
          exact: false,
        },
      ),
    );
  });
});
