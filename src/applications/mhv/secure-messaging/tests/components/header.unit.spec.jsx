import { render } from '@testing-library/react';
import React from 'react';
import Header from '../../components/Header';
// import App from '../../containers/App';

describe('Header', () => {
  it('renders without errors', () => {
    render(<Header />);
  });
});
