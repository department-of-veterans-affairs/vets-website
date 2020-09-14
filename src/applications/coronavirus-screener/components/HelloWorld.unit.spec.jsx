import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './HelloWorld';

describe('App', () => {
  it('renders App component', () => {
    render(<App />);
    screen.debug();
    screen.getByText('Hello React');
  });
});
