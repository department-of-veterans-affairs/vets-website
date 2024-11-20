import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/dom';
import reducer from '../../../reducers';
import AlertBackgroundBox from '../../../components/shared/AlertBackgroundBox';
import { Alerts, Paths } from '../../../util/constants';

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

  it('SUCCESS alert should render without error and with correct folder', async () => {
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

  it('SUCCESS alert should render without error on My Folders page', async () => {
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
});
