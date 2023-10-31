import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import LandingPage from '../../containers/LandingPage';

describe('Landing Page', () => {
  let screen;

  beforeEach(() => {
    screen = renderWithStoreAndRouter(<LandingPage />, {});
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });
});
