import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import LandingPage from '../components/page/LandingPage';

describe('LandingPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = render(<LandingPage />);
  });

  it('displays expected text', async () => {
    await waitFor(
      () =>
        expect(
          wrapper.getByText(
            /This is a placeholder for the real landing page\./,
          ),
        ).to.exist,
    );
  });
});
