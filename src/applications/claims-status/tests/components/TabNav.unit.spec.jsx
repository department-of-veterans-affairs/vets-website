import React from 'react';
import { expect } from 'chai';

import TabNav from '../../components/TabNav';
import { renderWithRouter } from '../utils';

describe('<TabNav>', () => {
  it('should render three tabs', () => {
    const screen = renderWithRouter(<TabNav id={1} />);

    expect(screen.getAllByRole('listitem').length).to.equal(3);
  });
});
