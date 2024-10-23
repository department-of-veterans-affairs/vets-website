import React from 'react';
import { render } from '@testing-library/react';
import {
  mockFetch,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import NetworkRequest from './NetworkRequest';

describe('Mocked call', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('Does not trigger the network call check', () => {
    render(<NetworkRequest />);
  });
});

describe('Unmocked call', () => {
  it('Triggers the network call check', () => {
    render(<NetworkRequest />);
  });
});
