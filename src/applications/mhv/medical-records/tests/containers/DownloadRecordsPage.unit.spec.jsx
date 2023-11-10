import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
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
    screen = renderWithStoreAndRouter(<DownloadRecordsPage />, {
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
});
