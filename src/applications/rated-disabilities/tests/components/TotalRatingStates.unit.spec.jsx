import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  errorMessage,
  missingTotalMessage,
  totalRatingMessage,
} from '../../components/TotalRatingStates';

describe('TotalRatingStates', () => {
  it('should include an error message', () => {
    const screen = render(errorMessage());
    expect(screen.getByText(/We’re sorry. Something went wrong on our end/)).to
      .exist;
  });

  it('should include a no rating message', () => {
    const screen = render(missingTotalMessage());
    expect(
      screen.getByText(
        /We don’t have a combined disability rating on file for you/,
      ),
    ).to.exist;
  });

  it('should include the totalRatingMessage', () => {
    const screen = render(totalRatingMessage());
    expect(screen.getByText(/Your combined disability rating/)).to.exist;
  });
});
