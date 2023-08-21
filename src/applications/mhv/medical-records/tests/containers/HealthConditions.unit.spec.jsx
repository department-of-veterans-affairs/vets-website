import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import HealthConditions from '../../containers/HealthConditions';
import conditions from '../fixtures/conditions.json';
import reducer from '../../reducers';

describe('Health conditions list container', () => {
  const initialState = {
    mr: {
      conditions: {
        conditionsList: conditions,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<HealthConditions />, {
      initialState: state,
      reducers: reducer,
      path: '/vitals',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Health conditions', { exact: true })).to.exist;
  });

  it('displays additional info', () => {
    const screen = setup();
    expect(
      screen.getByText('Review health conditions in your VA medical records', {
        exact: true,
      }),
    ).to.exist;
  });

  it('displays active condition', () => {
    const screen = setup();
    expect(screen.getAllByText('Back pain (SCT 161891005)', { exact: true })).to
      .exist;
  });
});
