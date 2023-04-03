import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import Vitals from '../../containers/Vitals';
import reducer from '../../reducers';

describe('Vaccines list container', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalsList: null,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<Vitals />, {
      initialState: state,
      reducers: reducer,
      path: '/vitals',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Vitals', { exact: true })).to.exist;
  });

  it('displays additional info', () => {
    const screen = setup();
    expect(
      screen.getByText('Review vitals in your VA medical records', {
        exact: true,
      }),
    ).to.exist;
  });
});
