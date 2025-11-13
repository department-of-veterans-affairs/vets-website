import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { IsVeteranPage } from '../../../pages/isVeteranPage';

describe('IsVeteranPage', () => {
  const subject = () => render(<IsVeteranPage />);

  it.skip('renders successfully', () => {
    // skipping to support node 22 upgrade

    const { container } = subject();
    expect(container).to.exist;
  });
});
