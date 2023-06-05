import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import ShareRecordsPage from '../../containers/ShareRecordsPage';

describe('Allergy details container', () => {
  const initialState = {};

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<ShareRecordsPage />, {
      initialState: state,
      reducers: reducer,
      path: '/share-your-medical-record',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays sharing status', () => {
    const screen = setup();
    expect(screen.getByText('Sharing through VHIE')).to.exist;
  });
});
