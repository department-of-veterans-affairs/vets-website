import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import Vaccines from '../../containers/Vaccines';

describe('Vaccine container', () => {
  it('renders without errors', () => {
    const screen = render(<Vaccines />);
    expect(screen.getByText('VA vaccines', { exact: true })).to.exist;
  });

  it('displays a print button', () => {
    const screen = render(<Vaccines />);
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });
});
