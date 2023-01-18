import React from 'react';
import { expect } from 'chai';
import { set, assign } from 'lodash';
import { renderWithProfileReducers as render } from '../../unit-test-helpers';
import DisabilityRating from '../../../components/personal-information/DisabilityRating';

function createHappyState() {
  return {
    user: { profile: { claims: { ratingInfo: true } } },
    totalRating: {
      loading: false,
      error: null,
      totalDisabilityRating: 40,
    },
  };
}

describe('Personal Info - Disability Rating', () => {
  it('should render a Disability Rating if provided through Redux state', () => {
    const tree = render(<DisabilityRating />, {
      initialState: createHappyState(),
    });
    expect(tree.getByText(/40% service connected/i)).to.exist;
  });

  it('should render an error alert if totalRating has error state', () => {
    const happyState = createHappyState();
    const tree = render(<DisabilityRating />, {
      initialState: set(happyState, 'totalRating.error', {
        code: '403',
        detail: 'User not permitted to access this resource',
      }),
    });
    expect(
      tree.getByText(
        /We’re sorry. Something went wrong on our end and we can’t load your disability rating information/i,
      ),
    ).to.exist;
  });

  it('should render no rating content if user doesnt have claim in state', () => {
    const initialState = assign(
      createHappyState(),
      {
        totalRating: {
          error: {
            code: '403',
            detail: 'User not permitted to access this resource',
          },
        },
      },
      {
        user: { profile: { claims: { ratingInfo: false } } },
      },
    );

    const tree = render(<DisabilityRating />, {
      initialState,
    });
    expect(
      tree.getByText(
        /Our records show that you don’t have a disability rating./i,
      ),
    ).to.exist;
  });
});
