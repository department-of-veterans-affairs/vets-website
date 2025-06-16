import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import Hero from '../../../../../components/common/Header/Hero';

describe('Hero', () => {
  it('renders header text', () => {
    const { getByTestId } = render(<Hero />);
    const bannerText = getByTestId('landing-page-heading');
    expect(bannerText).to.exist;
    expect(bannerText.textContent).to.equal(
      'Welcome to the Accredited Representative Portal',
    );
  });
});
