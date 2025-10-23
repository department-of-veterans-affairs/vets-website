import React from 'react';
import { renderWithRouter } from '../utils';
import NoClaims from '../../components/NoClaims';

describe('<NoClaims>', () => {
  it('should render component', () => {
    const { getByText } = renderWithRouter(<NoClaims />);

    getByText('You do not have any submitted claims');
    getByText('This page shows only completed claim applications.');
  });
});
