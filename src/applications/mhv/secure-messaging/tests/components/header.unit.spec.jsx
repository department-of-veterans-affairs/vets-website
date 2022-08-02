import { render } from '@testing-library/react';
import React from 'react';
import Header from '../../components/Header';

describe('Header', () => {
  it('renders without errors', () => {
    render(<Header />);
  });
});
