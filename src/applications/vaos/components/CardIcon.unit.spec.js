import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';

import CardIcon from './CardIcon';

describe('VAOS Component: CardIcon', () => {
  it('should render icon', () => {
    const { getByTestId } = render(<CardIcon icon="calendar_today" />);
    expect(getByTestId('card-icon-calendar_today')).to.exist;
  });

  it('should render nothing when no icon is passed', () => {
    const { container } = render(<CardIcon />);
    expect(container.innerHTML).to.equal('');
  });
});
