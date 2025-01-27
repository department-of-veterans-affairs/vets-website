import React from 'react';
import { expect } from 'chai';
import Header from '../../../components/Header';
import { renderTestComponent } from '../helpers';

describe('Header', () => {
  it('renders header', () => {
    const { getByTestId } = renderTestComponent(<Header />);
    expect(getByTestId('arp-header')).to.exist;
  });
});
