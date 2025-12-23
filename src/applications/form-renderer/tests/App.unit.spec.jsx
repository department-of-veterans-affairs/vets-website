import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../containers/App';

describe('App', () => {
  it('renders the Test div', () => {
    render(<App />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
