import React from 'react';
import { /* screen, */ render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import CombinedDisabilityRatingCard from '../../../components/claims-and-appeals/CombinedDisabilityRatingCard';

const mockStore = configureMockStore();

describe('CombinedDisabilityRatingCard', () => {
  let store;

  it('renders the disability rating at 0%', () => {
    store = mockStore({
      totalRating: {
        totalDisabilityRating: 0,
      },
    });

    const screen = render(
      <Provider store={store}>
        <CombinedDisabilityRatingCard />
      </Provider>,
    );

    expect(screen.getByText('Your combined disability rating is 0%')).to.exist;
    expect(
      screen.queryByText('We can’t currently display your disability rating.'),
    ).to.not.exist;
  });

  it('renders the disability rating at 70%', () => {
    store = mockStore({
      totalRating: {
        totalDisabilityRating: 70,
      },
    });

    const screen = render(
      <Provider store={store}>
        <CombinedDisabilityRatingCard />
      </Provider>,
    );

    expect(screen.getByText('Your combined disability rating is 70%')).to.exist;
    expect(
      screen.queryByText('We can’t currently display your disability rating.'),
    ).to.not.exist;
  });

  it('renders the error state on server error', () => {
    // Fake the error object following the props that helpers check
    store = mockStore({
      totalRating: {
        totalDisabilityRating: null,
        error: {
          code: 500,
        },
      },
    });

    const screen = render(
      <Provider store={store}>
        <CombinedDisabilityRatingCard />
      </Provider>,
    );

    expect(screen.queryByText(/Your combined disability rating is \d+%/)).to.not
      .exist;
    expect(
      screen.getByText('We can’t currently display your disability rating.'),
    ).to.exist;
  });
});
