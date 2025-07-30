import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import Footer from '../../../components/Footer';

describe('Footer', () => {
  const subject = () => render(<Footer />);

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });
});
