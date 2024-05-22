import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import DownloadRecordsPage from '../../containers/DownloadRecordsPage';
import user from '../fixtures/user.json';

describe('DownloadRecordsPage', () => {
  const initialState = {
    user,
    mr: {},
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadRecordsPage runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays sharing status', () => {
    expect(screen.getByText('Download all medical records')).to.exist;
  });

  it('should display a download started message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('download-blue-button-pdf'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });

  it('should display a download started message when the download txt file button is clicked', () => {
    fireEvent.click(screen.getByTestId('download-blue-button-txt'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });
});

describe('DownloadRecordsPage with connection error', () => {
  const initialState = {
    user,
    mr: {
      alerts: {
        alertList: [
          {
            datestamp: '2024-04-11T02:43:15.227Z',
            isActive: true,
            type: 'error',
          },
        ],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadRecordsPage runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('should display an error message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('download-blue-button-pdf'));
    waitFor(() => {
      expect(screen.getByTestId('expired-alert-message')).to.exist;
    });
  });

  it('should display an error when the download txt file button is clicked', () => {
    fireEvent.click(screen.getByTestId('download-blue-button-txt'));
    waitFor(() => {
      expect(screen.getByTestId('expired-alert-message')).to.exist;
    });
  });
});
