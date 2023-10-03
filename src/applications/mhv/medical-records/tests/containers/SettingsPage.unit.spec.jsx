import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import SettingsPage from '../../containers/SettingsPage';

describe('Allergy details container', () => {
  const initialState = {};

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<SettingsPage />, {
      initialState: state,
      reducers: reducer,
      path: '/settings',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays sharing status', () => {
    const screen = setup();
    expect(screen.getByText('Manage your sharing settings')).to.exist;
  });
});
