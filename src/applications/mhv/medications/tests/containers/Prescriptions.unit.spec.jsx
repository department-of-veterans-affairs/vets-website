import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import prescriptions from '../fixtures/presciptions.json';
import Prescriptions from '../../containers/Prescriptions';

describe('Medicaitons Prescriptions container', () => {
  const initialState = {
    rx: {
      prescriptions: {
        prescriptionDetails: prescriptions,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<Prescriptions />, {
      initialState: state,
      reducers: reducer,
      path: '/prescriptions/',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });
});
