import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import LandingPage from '../../containers/LandingPage';

describe('Landing Page', () => {
  it('renders', () => {
    render(<LandingPage />);
  });

  it('should render welcome headline', () => {
    const { getByText } = render(<LandingPage />);
    expect(getByText('Welcome to Representative.VA.gov')).to.exist;
  });

  it('should render subheading', () => {
    const { getByText } = render(<LandingPage />);
    expect(getByText('Manage power of attorney requests')).to.exist;
  });

  it('should render description', () => {
    const { getByText } = render(<LandingPage />);
    expect(
      getByText(
        'A system to help you get power of attorney and then support Veterans by acting on their behalf.',
      ),
    ).to.exist;
  });

  it('should render link to dashboard', () => {
    const { getByText } = render(<LandingPage />);
    expect(getByText('Until sign in is added use this to see dashboard')).to
      .exist;
  });
});
