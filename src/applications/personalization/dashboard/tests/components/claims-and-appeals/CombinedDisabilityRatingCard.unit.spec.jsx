import React from 'react';
import { /* screen, */ render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import CombinedDisabilityRatingCard from '../../../components/claims-and-appeals/CombinedDisabilityRatingCard';

const mockStore = configureMockStore();

describe('CombinedDisabilityRatingCard', () => {
  let store;

  const renderWithTotalRatingData = (
    totalDisabilityRating,
    totalDisabilityRatingServerError = false,
  ) => {
    if (totalDisabilityRatingServerError) {
      store = mockStore({
        totalRating: {
          totalDisabilityRating: null,
          error: {
            // Fake the error object following the props checked by helpers
            code: 500,
          },
        },
      });
    } else {
      store = mockStore({
        totalRating: {
          totalDisabilityRating,
        },
      });
    }

    return render(
      <Provider store={store}>
        <CombinedDisabilityRatingCard />
      </Provider>,
    );
  };

  it('renders the disability rating at 0%', () => {
    const screen = renderWithTotalRatingData(0);

    expect(screen.getByText('Your combined disability rating is 0%')).to.exist;
    expect(
      screen.queryByText('We can’t currently display your disability rating.'),
    ).to.not.exist;
  });

  it('renders the disability rating at 70%', () => {
    const screen = renderWithTotalRatingData(70);

    expect(screen.getByText('Your combined disability rating is 70%')).to.exist;
    expect(
      screen.queryByText('We can’t currently display your disability rating.'),
    ).to.not.exist;
  });

  it('renders the error state on server error', () => {
    const screen = renderWithTotalRatingData(null, true);

    expect(screen.queryByText(/Your combined disability rating is \d+%/)).to.not
      .exist;
    expect(
      screen.getByText('We can’t currently display your disability rating.'),
    ).to.exist;
  });
});
