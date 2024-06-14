import React from 'react';

import ClaimsUnavailable from '../../components/ClaimsUnavailable';
import { renderWithRouter } from '../utils';

describe('<ClaimsUnavailable>', () => {
  it('should render component', () => {
    const { getByText } = renderWithRouter(<ClaimsUnavailable />);

    getByText('Claim status is unavailable');
    getByText(
      'VA.gov is having trouble loading claims information at this time. Please check back again in an hour. Please note: You are still able to review appeals information.',
    );
  });
});
