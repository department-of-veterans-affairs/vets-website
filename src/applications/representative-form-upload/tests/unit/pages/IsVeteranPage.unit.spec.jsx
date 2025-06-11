import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { IsVeteranPage } from '../../../pages/isVeteranPage';

describe('IsVeteranPage', () => {
  const subject = () => render(<IsVeteranPage />);

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });
});
