import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import NavDropdown from '../../../../components/Header/NavDropdown';

describe('NavDropdown', () => {
  const subject = () => render(<NavDropdown />);

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });
});
