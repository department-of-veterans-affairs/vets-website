import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Description } from '../../pages/chooseSupplies';

describe('chooseSupplies', () => {
  const setup = () => {
    return render(<Description />);
  };
  it('renders Description', () => {
    const { container } = setup();
    expect(container).to.exist;
  });
});
