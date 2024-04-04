import React from 'react';
import { renderWithRouter } from '../utils';
import AppealsUnavailable from '../../components/AppealsUnavailable';

describe('<AppealsUnavailable>', () => {
  it('should render component', () => {
    const screen = renderWithRouter(<AppealsUnavailable />);

    screen.getByText('Appeal status is unavailable');
    screen.getByText(
      'VA.gov is having trouble loading appeals information at this time. Please check back again in a hour. Please note: You are still able to review claims information.',
    );
  });
});
