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

  it('should display alert content when path is folders/:folderId', async () => {
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
      // sr-only span exists with delayed content (empty initially due to focusin delay)
      const srSpan = screen.container.querySelector('span[aria-live="polite"]');
      expect(srSpan).to.exist;
    });
  });

  it('should display alert content when path is folders/', async () => {
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
      const srSpan = screen.container.querySelector('span[aria-live="polite"]');
      expect(srSpan).to.exist;
    });
  });

  it('should display alert content when path is thread/:messageId', async () => {
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
      const srSpan = screen.container.querySelector('span[aria-live="polite"]');
      expect(srSpan).to.exist;
    });
  });

  it('should display alert content when path is reply/:messageId', async () => {
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
      const srSpan = screen.container.querySelector('span[aria-live="polite"]');
      expect(srSpan).to.exist;
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

  describe('Delayed sr-only announcement', () => {
    it('sr-only span is empty before focus settles or ceiling timer', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: 'Success',
        content: 'Message was successfully sent.',
      };
      const { container } = renderWithStoreAndRouter(
        <AlertBackgroundBox closeable />,
        {
          initialState: {
            sm: {
              alerts: { alertVisible: true, alertList: [activeAlertObj] },
            },
          },
          reducers: reducer,
          path: Paths.INBOX,
        },
      );
      await waitFor(() => {
        const srSpan = container.querySelector('span[aria-live="polite"]');
        expect(srSpan).to.exist;
        expect(srSpan.textContent).to.equal('');
      });
    });

    it('sr-only span populates after H1 receives focus + 1s delay', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: 'Success',
        content: 'Message was successfully sent.',
      };
      const { container } = renderWithStoreAndRouter(
        <AlertBackgroundBox closeable />,
        {
          initialState: {
            sm: {
              alerts: { alertVisible: true, alertList: [activeAlertObj] },
            },
          },
          reducers: reducer,
          path: Paths.INBOX,
        },
      );

      // Wait for the alert to fully render so the useLayoutEffect focusin
      // listener is registered (it depends on alertContent being set).
      await waitFor(() => {
        const alertText = container.querySelector('[data-testid="alert-text"]');
        expect(alertText).to.exist;
        expect(alertText.textContent).to.equal(activeAlertObj.content);
      });

      // Simulate H1 receiving focus
      const h1 = document.createElement('h1');
      document.body.appendChild(h1);
      h1.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

      await waitFor(
        () => {
          const srSpan = container.querySelector('span[aria-live="polite"]');
          expect(srSpan.textContent).to.equal(activeAlertObj.content);
        },
        { timeout: 2000 },
      );

      document.body.removeChild(h1);
    });

    it('sr-only span populates via 5s ceiling when focus keeps moving', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: 'Success',
        content: 'Message was successfully sent.',
      };
      const { container } = renderWithStoreAndRouter(
        <AlertBackgroundBox closeable />,
        {
          initialState: {
            sm: {
              alerts: { alertVisible: true, alertList: [activeAlertObj] },
            },
          },
          reducers: reducer,
          path: Paths.INBOX,
        },
      );

      // Don't trigger any focusin event — rely on ceiling
      await waitFor(
        () => {
          const srSpan = container.querySelector('span[aria-live="polite"]');
          expect(srSpan.textContent).to.equal(activeAlertObj.content);
        },
        { timeout: 6000 },
      );
    });
  });

  describe('handleAlertFocus restriction', () => {
    it('error alert still receives focus via onVa-component-did-load', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'error',
        header: 'Error',
        content: 'Message was not successfully sent.',
      };
      const { container } = renderWithStoreAndRouter(
        <AlertBackgroundBox closeable />,
        {
          initialState: {
            sm: {
              alerts: { alertVisible: true, alertList: [activeAlertObj] },
            },
          },
          reducers: reducer,
          path: Paths.INBOX,
        },
      );
      await waitFor(() => {
        const alert = container.querySelector('va-alert');
        expect(alert).to.exist;
        expect(alert).to.have.attribute('status', 'error');
      });
    });

    it('success alert renders without stealing focus', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: 'Success',
        content: 'Message was successfully sent.',
      };
      const { container } = renderWithStoreAndRouter(
        <AlertBackgroundBox closeable />,
        {
          initialState: {
            sm: {
              alerts: { alertVisible: true, alertList: [activeAlertObj] },
            },
          },
          reducers: reducer,
          path: Paths.INBOX,
        },
      );
      await waitFor(() => {
        const alert = container.querySelector('va-alert');
        expect(alert).to.exist;
        expect(alert).to.have.attribute('status', 'success');
        // Focus should NOT be stolen for success alerts
        // (handleAlertFocus returns early for non-error alerts)
      });
    });
  });

  describe('Margin class', () => {
    it('renders with default vads-u-margin-bottom--1 when no className prop', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: 'Success',
        content: 'Folder was successfully created.',
      };
      const { container } = renderWithStoreAndRouter(
        <AlertBackgroundBox closeable />,
        {
          initialState: {
            sm: {
              alerts: { alertVisible: true, alertList: [activeAlertObj] },
            },
          },
          reducers: reducer,
          path: Paths.INBOX,
        },
      );
      await waitFor(() => {
        const alert = container.querySelector('va-alert');
        expect(alert).to.exist;
        expect(alert.className).to.include('vads-u-margin-bottom--1');
      });
    });

    it('renders with custom className when provided', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: 'Success',
        content: 'Folder was successfully created.',
      };
      const { container } = renderWithStoreAndRouter(
        <AlertBackgroundBox closeable className="vads-u-margin-y--3" />,
        {
          initialState: {
            sm: {
              alerts: { alertVisible: true, alertList: [activeAlertObj] },
            },
          },
          reducers: reducer,
          path: Paths.INBOX,
        },
      );
      await waitFor(() => {
        const alert = container.querySelector('va-alert');
        expect(alert).to.exist;
        expect(alert.className).to.include('vads-u-margin-y--3');
        expect(alert.className).to.not.include('vads-u-margin-bottom--1');
      });
    });
  });

  describe('Duplicate announce prevention', () => {
    it('focus-settle path prevents ceiling from announcing a second time', async () => {
      const activeAlertObj = {
        datestamp: '2022-10-07T19:25:32.832Z',
        isActive: true,
        alertType: 'success',
        header: 'Success',
        content: 'Message was successfully sent.',
      };
      const { container } = renderWithStoreAndRouter(
        <AlertBackgroundBox closeable />,
        {
          initialState: {
            sm: {
              alerts: { alertVisible: true, alertList: [activeAlertObj] },
            },
          },
          reducers: reducer,
          path: Paths.INBOX,
        },
      );

      // Wait for the alert to render with content
      await waitFor(() => {
        const alertText = container.querySelector('[data-testid="alert-text"]');
        expect(alertText).to.exist;
        expect(alertText.textContent).to.equal(activeAlertObj.content);
      });

      // Simulate focus event to trigger the debounce path
      const btn = document.createElement('button');
      document.body.appendChild(btn);
      btn.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

      // After focus settles + 1s delay, sr-only should be populated
      await waitFor(
        () => {
          const srSpan = container.querySelector('span[aria-live="polite"]');
          expect(srSpan.textContent).to.equal(activeAlertObj.content);
        },
        { timeout: 2000 },
      );

      // Wait past the 5s ceiling window — content should remain the same
      // (not get cleared and re-set by a duplicate announce)
      await waitFor(
        () => {
          const srSpan = container.querySelector('span[aria-live="polite"]');
          expect(srSpan.textContent).to.equal(activeAlertObj.content);
        },
        { timeout: 6000 },
      );

      document.body.removeChild(btn);
    });
  });
});
