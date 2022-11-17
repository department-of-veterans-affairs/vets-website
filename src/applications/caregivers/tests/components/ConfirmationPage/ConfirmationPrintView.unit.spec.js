import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import moment from 'moment';

import ConfirmationPrintView from '../../../components/ConfirmationPage/ConfirmationPrintView';

describe('hca <ConfirmationScreenView>', () => {
  it('should render Confirmation Screen View with name and timestamp', () => {
    const name = {
      first: 'John',
      middle: 'Marjorie',
      last: 'Smith',
      suffix: 'Sr.',
    };

    const timestamp = 1666887649663;

    const view = render(
      <ConfirmationPrintView name={name} timestamp={timestamp} />,
    );

    expect(
      view.container.querySelector('[data-testid="cg-veteranfullname"]'),
    ).to.contain.text('John Marjorie Smith Sr.');
    expect(
      view.container.querySelector('[data-testid="cg-timestamp"]'),
    ).to.contain.text(moment(timestamp).format('MMM D, YYYY'));
    expect(
      view.container.querySelector('[data-testid="cg-timestamp"]'),
    ).to.contain.text('Oct. 27, 2022');
  });
});
