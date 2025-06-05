import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';
import AlertBackgroundBox from '../../../components/shared/AlertBackgroundBox';
import { Alerts, Errors, Paths } from '../../../util/constants';

describe('Alert Background Box component', () => {
  const { SERVER_ERROR_500_MESSAGES_HEADING } = Alerts.Message;
  const { SERVER_ERROR_500_MESSAGES_CONTENT } = Alerts.Message;
  const { SERVER_ERROR_503 } = Alerts.Message;
  const { SERVICE_OUTAGE } = Errors.Code;

  const baseAlert = {
    datestamp: '2024-10-07T19:25:32.832Z',
    isActive: true,
    alertType: 'error',
    header: 'Error',
    content: 'Some error occurred.',
  };

  const getState = alertList => ({
    sm: {
      alerts: {
        alertVisible: true,
        alertList,
      },
      folders: {},
      threadDetails: {},
    },
  });

  it('renders the alert with provided header and content without errors', async () => {
    const initialState = getState([baseAlert]);
    const screen = renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
      initialState,
      reducers: reducer,
      path: Paths.INBOX,
    });

    await waitFor(() => {
      expect(screen.getByTestId('alert-text')).to.exist;
      expect(screen.getByText(SERVER_ERROR_503)).to.exist;
    });
  });

  it('renders SERVER_ERROR_503 on non-thread, non-folder, non-contact-list path with service outage', async () => {
    const outageAlert = {
      ...baseAlert,
      response: { code: SERVICE_OUTAGE },
    };
    const initialState = getState([outageAlert]);
    const screen = renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
      initialState,
      reducers: reducer,
      path: '/some-other-path',
    });

    await waitFor(() => {
      expect(screen.getByText(SERVER_ERROR_503)).to.exist;
    });
  });

  it('renders SERVER_ERROR_500_MESSAGES_HEADING and BODY on /thread/ path with service outage', async () => {
    const outageAlert = {
      ...baseAlert,
      alertType: 'error',
      response: { code: SERVICE_OUTAGE },
    };
    const initialState = getState([outageAlert]);
    const screen = renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
      initialState,
      reducers: reducer,
      path: Paths.MESSAGE_THREAD,
    });

    await waitFor(() => {
      expect(document.querySelector('h1').textContent).to.equal(
        SERVER_ERROR_500_MESSAGES_HEADING,
      );
      expect(screen.getByText(SERVER_ERROR_500_MESSAGES_CONTENT)).to.exist;
    });
  });

  it('does not render alert if alertList is empty', async () => {
    const initialState = getState([]);
    const screen = renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
      initialState,
      reducers: reducer,
      path: Paths.INBOX,
    });

    await waitFor(() => {
      screen;
      const vaAlert = document.querySelector('va-alert');
      expect(vaAlert).to.not.exist;
    });
  });

  it('should announce current folder if path is folders/:folderId', async () => {
    const activeAlertObj = {
      datestamp: '2022-10-07T19:25:32.832Z',
      isActive: true,
      alertType: 'success',
      header: 'Success',
      content: 'Message conversation was successfully moved.',
    };
    const customState = {
      sm: {
        alerts: {
          alertVisible: true,
          alertList: [activeAlertObj],
        },
        folders: {
          folder: {
            name: 'Test Mock Folder',
            count: 4,
            unreadCount: 0,
            systemFolder: false,
            folderId: 861387,
          },
        },
      },
    };
    const setup = initialState =>
      renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
        initialState,
        reducers: reducer,
        path: `${Paths.FOLDERS}${customState.sm.folders.folder.folderId}/`,
      });

    const screen = setup(customState);

    await waitFor(() => {
      const alert = document.querySelector('va-alert');
      expect(alert)
        .to.have.attribute('status')
        .to.equal('success');
      expect(alert).to.have.attribute(
        'close-btn-aria-label',
        'Close notification',
      );
      expect(screen.getByText(activeAlertObj.content)).to.exist;
      expect(screen.getByText('You are in Test Mock Folder.')).to.exist;
    });
  });

  it('should announce "my folders page" if path is folders/', async () => {
    const activeAlertObj = {
      datestamp: '2022-10-07T19:25:32.832Z',
      isActive: true,
      alertType: 'success',
      header: 'Success',
      content: 'Folder was successfully deleted.',
    };
    const customState = {
      sm: {
        alerts: {
          alertVisible: true,
          alertList: [activeAlertObj],
        },
      },
    };
    const setup = initialState =>
      renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
        initialState,
        reducers: reducer,
        path: `${Paths.FOLDERS}`,
      });

    const screen = setup(customState);

    await waitFor(() => {
      const alert = document.querySelector('va-alert');
      expect(alert)
        .to.have.attribute('status')
        .to.equal('success');
      expect(alert).to.have.attribute(
        'close-btn-aria-label',
        'Close notification',
      );
      expect(screen.getByText(activeAlertObj.content)).to.exist;
      expect(screen.getByText('You are in the my folders page.')).to.exist;
    });
  });

  it('should announce current message header if path is thread/:messageId', async () => {
    const activeAlertObj = {
      datestamp: '2022-10-07T19:25:32.832Z',
      isActive: true,
      alertType: 'success',
      header: 'Success',
      content: 'Message conversation was successfully moved.',
    };
    const customState = {
      sm: {
        alerts: {
          alertVisible: true,
          alertList: [activeAlertObj],
        },
        threadDetails: {
          messages: [
            {
              messageId: 3648726,
              category: 'Medication',
              subject: 'Prescription Inquiry',
            },
          ],
        },
      },
    };
    const setup = initialState =>
      renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
        initialState,
        reducers: reducer,
        path: `${Paths.MESSAGE_THREAD}${
          customState.sm.threadDetails.messages[0].messageId
        }/`,
      });

    const screen = setup(customState);

    await waitFor(() => {
      const alert = document.querySelector('va-alert');
      expect(alert)
        .to.have.attribute('status')
        .to.equal('success');
      expect(alert).to.have.attribute(
        'close-btn-aria-label',
        'Close notification',
      );
      expect(screen.getByText(activeAlertObj.content)).to.exist;
      expect(
        screen.getByText(
          'You are in Medication: Prescription Inquiry message thread.',
        ),
      ).to.exist;
    });
  });

  it('should announce current message header if path is reply/:messageId', async () => {
    const activeAlertObj = {
      datestamp: '2022-10-07T19:25:32.832Z',
      isActive: true,
      alertType: 'success',
      header: 'Success',
      content: 'Message conversation was successfully moved.',
    };
    const customState = {
      sm: {
        alerts: {
          alertVisible: true,
          alertList: [activeAlertObj],
        },
        threadDetails: {
          messages: [
            {
              messageId: 3648726,
              category: 'OTHER',
              subject: 'Help Inquiry',
            },
          ],
        },
      },
    };
    const setup = initialState =>
      renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
        initialState,
        reducers: reducer,
        path: `${Paths.REPLY}${
          customState.sm.threadDetails.messages[0].messageId
        }/`,
      });

    const screen = setup(customState);

    await waitFor(() => {
      const alert = document.querySelector('va-alert');
      expect(alert)
        .to.have.attribute('status')
        .to.equal('success');
      expect(alert).to.have.attribute(
        'close-btn-aria-label',
        'Close notification',
      );
      expect(screen.getByText(activeAlertObj.content)).to.exist;
      expect(
        screen.getByText('You are in General: Help Inquiry message reply.'),
      ).to.exist;
    });
  });
});
