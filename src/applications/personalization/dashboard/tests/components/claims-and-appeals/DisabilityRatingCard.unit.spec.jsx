import React from 'react';
import { /* screen, */ render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import DisabilityRatingCard from '../../../components/claims-and-appeals/DisabilityRatingCard';

const mockStore = configureMockStore();

describe('DisabilityRatingCard', () => {
  let store;

  it('renders the disability rating at 0%', () => {
    store = mockStore({
      totalRating: {
        totalDisabilityRating: 0,
      },
    });

    const screen = render(
      <Provider store={store}>
        <DisabilityRatingCard />
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
        <DisabilityRatingCard />
      </Provider>,
    );

    expect(screen.getByText('Your combined disability rating is 70%')).to.exist;
    expect(
      screen.queryByText('We can’t currently display your disability rating.'),
    ).to.not.exist;
  });

  it('renders no disability rating on file', () => {
    store = mockStore({
      totalRating: {
        totalDisabilityRating: null,
      },
    });

    const screen = render(
      <Provider store={store}>
        <DisabilityRatingCard />
      </Provider>,
    );

    expect(
      screen.getByText(
        'We don’t have a combined disability rating on file for you.',
      ),
    ).to.exist;
    expect(screen.queryByText(/Your combined disability rating is \d+%/)).to.not
      .exist;
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
          code: 'EVSS400',
          status: 500,
        },
      },
    });

    const screen = render(
      <Provider store={store}>
        <DisabilityRatingCard />
      </Provider>,
    );

    expect(screen.queryByText(/Your combined disability rating is \d+%/)).to.not
      .exist;
    expect(
      screen.getByText(
        'We can’t show your disability rating right now. Refresh this page or try again later.',
      ),
    ).to.exist;
  });
});
