import React from 'react';
import { render } from '@testing-library/react';

import CombinedRating from '../../components/CombinedRating';

const noRatingText =
  'We don’t have a combined disability rating on file for you';

describe('<CombinedRating />', () => {
  it('should render loading indicator if feature toggles are not available', () => {
    const screen = render(<CombinedRating combinedRating={null} />);

    screen.getByText(noRatingText);
  });

  it('should render children if feature toggles are available', () => {
    const screen = render(<CombinedRating combinedRating={undefined} />);

    screen.getByText(noRatingText);
  });

  it('should render children if feature toggles are available', () => {
    const screen = render(<CombinedRating combinedRating={100} />);

    screen.getByText('Your combined disability rating is 100%');
  });
});
