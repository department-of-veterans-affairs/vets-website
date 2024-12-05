import React from 'react';
import { expect } from 'chai';
import Header from '../../../../../components/common/Header/Header';
import { renderTestApp } from '../../../helpers';

describe('Header', () => {
  it('renders header', () => {
    const { getByTestId } = renderTestApp(<Header />);
    expect(getByTestId('arp-header')).to.exist;
  });
});
