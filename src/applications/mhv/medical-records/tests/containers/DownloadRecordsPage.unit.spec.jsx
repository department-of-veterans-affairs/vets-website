import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import DownloadRecordsPage from '../../containers/DownloadRecordsPage';

describe('Allergy details container', () => {
  const initialState = {};

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<DownloadRecordsPage />, {
      initialState: state,
      reducers: reducer,
      path: '/download-all',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays sharing status', () => {
    const screen = setup();
    expect(screen.getByText('Download all medical records')).to.exist;
  });
});
