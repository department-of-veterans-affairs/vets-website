import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ITFStatusLoadingIndicatorPage from '../../components/ITFStatusLoadingIndicatorPage';

describe('ITFStatusLoadingIndicatorPage', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    render(<ITFStatusLoadingIndicatorPage />);
  });
});
