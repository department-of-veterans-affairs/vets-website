import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent } from '@testing-library/dom';
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

  it('should download a pdf', () => {
    fireEvent.click(screen.getByTestId('download-blue-button-pdf'));
    expect(screen).to.exist;
  });

  it('should download a txt', () => {
    fireEvent.click(screen.getByTestId('download-blue-button-txt'));
    expect(screen).to.exist;
  });
});
