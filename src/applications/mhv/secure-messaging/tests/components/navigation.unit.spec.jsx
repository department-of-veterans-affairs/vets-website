import { render } from '@testing-library/react';
import React from 'react';
import Navigation from '../../components/Navigation';

describe('Navigation mobile view', () => {
  it('renders without errors', () => {
    render(<Navigation />);
  });
});
