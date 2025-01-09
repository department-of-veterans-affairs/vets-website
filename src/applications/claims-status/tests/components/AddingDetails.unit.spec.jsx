import React from 'react';
import AddingDetails from '../../components/AddingDetails';
import { renderWithRouter } from '../utils';

describe('<AddingDetails>', () => {
  it('should render adding details alert', () => {
    const { getByText } = renderWithRouter(<AddingDetails />);

    getByText(
      "We can't show all of the details of your claim. Please check back later.",
    );
  });
});
