import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import prescriptions from '../fixtures/presciptions.json';
import LandingPage from '../../containers/LandingPage';

describe('Medicaitons Landing page container', () => {
  const initialState = {
    rx: {
      prescriptions: {
        prescriptionDetails: prescriptions,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<LandingPage />, {
      initialState: state,
      reducers: reducer,
      path: '/',
    });
  };

  let screen = null;
  beforeEach(() => {
    screen = setup();
  });

  it('renders without errors', () => {
    expect(
      screen.getByText('About Medications', {
        exact: true,
      }),
    ).to.exist;
  });

  it('What to know as you try out this tool', () => {
    expect(
      screen.getByText('What to know as you try out this tool', {
        exact: true,
      }),
    ).to.exist;
  });
  it('More ways to manage your medications', () => {
    expect(
      screen.getByText('More ways to manage your medications', {
        exact: true,
      }),
    ).to.exist;
  });
});
