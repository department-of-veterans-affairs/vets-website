import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/dom';
import reducer from '../../../reducers';
import AlertBackgroundBox from '../../../components/shared/AlertBackgroundBox';
import { Alerts, DefaultFolders, Paths } from '../../../util/constants';

describe('Alert Backround Box component', () => {
  it('ERROR alert should render without errors', async () => {
    const activeAlertObj = {
      datestamp: '2022-10-07T19:25:32.832Z',
      isActive: true,
      alertType: 'error',
      header: 'Error',
      content: 'Message was not successfully deleted.',
    };
    const initialState = {
      sm: {
        alerts: {
          alertVisible: true,
          alertList: [activeAlertObj],
        },
      },
    };
    const setup = ({ state = initialState }) =>
      renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
        state,
        reducers: reducer,
        path: Paths.INBOX,
      });
    const { findByText } = setup({});
    expect(findByText(Alerts.Message.DELETE_MESSAGE_ERROR));
  });

  it('ERROR alert should have role="alert"', async () => {
    const activeAlertObj = {
      datestamp: '2022-10-07T19:25:32.832Z',
      isActive: true,
      alertType: 'error',
      header: 'Error',
      content: 'Message was not successfully deleted.',
    };
    const customState = {
      sm: {
        alerts: {
          alertVisible: true,
          alertList: [activeAlertObj],
        },
      },
    };
    renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.INBOX,
    });

    await waitFor(() => {
      const alert = document.querySelector('va-alert');
      expect(alert)
        .to.have.attribute('role')
        .to.equal('alert');
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
      expect(alert)
        .to.have.attribute('role')
        .to.equal('status');
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

  describe('Message sent success alert with link', () => {
    it('should render RouterLink when message sent and user did not enter from sent folder', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: '',
        content: Alerts.Message.SEND_MESSAGE_SUCCESS,
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
          path: Paths.INBOX,
        });

      const screen = setup(customState);

      await waitFor(() => {
        // Verify the alert content is displayed
        expect(screen.getByText(Alerts.Message.SEND_MESSAGE_SUCCESS)).to.exist;

        // Verify the RouterLink is rendered with correct attributes
        const sentLink = screen.container.querySelector(
          `va-link[href="${Paths.ROOT_URL + Paths.SENT}"]`,
        );
        expect(sentLink).to.exist;
        expect(sentLink.getAttribute('text')).to.equal(
          'Review your sent messages',
        );
        expect(sentLink.getAttribute('data-dd-action-name')).to.equal(
          'Sent messages link in success alert',
        );
      });
    });

    it('should NOT render RouterLink for other success alerts', async () => {
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
        },
      };
      const setup = initialState =>
        renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
          initialState,
          reducers: reducer,
          path: Paths.INBOX,
        });

      const screen = setup(customState);

      await waitFor(() => {
        // Verify the alert content is displayed
        expect(screen.getByText(activeAlertObj.content)).to.exist;

        // Verify NO link to sent folder is rendered
        const sentLink = screen.container.querySelector(
          `va-link[href="${Paths.ROOT_URL + Paths.SENT}"]`,
        );
        expect(sentLink).to.not.exist;
      });
    });

    it('should render link with correct href for accessibility', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: '',
        content: Alerts.Message.SEND_MESSAGE_SUCCESS,
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
          path: Paths.INBOX,
        });

      const screen = setup(customState);

      await waitFor(() => {
        const sentLink = screen.container.querySelector('va-link');
        // Verify full URL is in href for screen readers and hover states
        expect(sentLink.getAttribute('href')).to.equal(
          Paths.ROOT_URL + Paths.SENT,
        );
      });
    });
    it('should navigate to sent folder when link is clicked', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: '',
        content: Alerts.Message.SEND_MESSAGE_SUCCESS,
      };
      const customState = {
        sm: {
          alerts: {
            alertVisible: true,
            alertList: [activeAlertObj],
          },
        },
      };

      const { container, history } = renderWithStoreAndRouter(
        <AlertBackgroundBox closeable />,
        {
          initialState: customState,
          reducers: reducer,
          path: Paths.INBOX,
        },
      );

      await waitFor(() => {
        const sentLink = container.querySelector('va-link');
        expect(sentLink).to.exist;

        // Click the link
        sentLink.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true }),
        );

        // Verify navigation occurred by checking history
        expect(history.location.pathname).to.equal(Paths.SENT);
      });
    });

    it('should NOT render RouterLink when user entered compose flow from sent folder', async () => {
      // Simulate user entering compose flow from sent folder
      sessionStorage.setItem('sm_composeEntryUrl', Paths.SENT);

      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: '',
        content: Alerts.Message.SEND_MESSAGE_SUCCESS,
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
          path: Paths.SENT,
        });

      const screen = setup(customState);

      await waitFor(() => {
        // Verify the alert content is displayed
        expect(screen.getByText(Alerts.Message.SEND_MESSAGE_SUCCESS)).to.exist;

        // Verify NO link to sent folder is rendered since user came from sent
        const sentLink = screen.container.querySelector(
          `va-link[href="${Paths.ROOT_URL + Paths.SENT}"]`,
        );
        expect(sentLink).to.not.exist;
      });

      // Clean up session storage
      sessionStorage.removeItem('sm_composeEntryUrl');
    });

    it('should NOT render RouterLink when user accessed thread from sent folder (via threadFolderId)', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: '',
        content: Alerts.Message.SEND_MESSAGE_SUCCESS,
      };
      const customState = {
        sm: {
          alerts: {
            alertVisible: true,
            alertList: [activeAlertObj],
          },
          threadDetails: {
            threadFolderId: DefaultFolders.SENT.id,
          },
        },
      };
      const setup = initialState =>
        renderWithStoreAndRouter(<AlertBackgroundBox closeable />, {
          initialState,
          reducers: reducer,
          path: Paths.SENT,
        });

      const screen = setup(customState);

      await waitFor(() => {
        // Verify the alert content is displayed
        expect(screen.getByText(Alerts.Message.SEND_MESSAGE_SUCCESS)).to.exist;

        // Verify NO link to sent folder is rendered since user came from sent folder thread
        const sentLink = screen.container.querySelector(
          `va-link[href="${Paths.ROOT_URL + Paths.SENT}"]`,
        );
        expect(sentLink).to.not.exist;
      });
    });
  });
});
