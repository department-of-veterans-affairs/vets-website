import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import moment from 'moment';

import ConfirmationScreenView from '../../../components/ConfirmationPage/ConfirmationScreenView';

describe('hca <ConfirmationScreenView>', () => {
  it('should render Confirmation Screen View with name and timestamp', () => {
    const name = {
      first: 'John',
      middle: 'Marjorie',
      last: 'Smith',
      suffix: 'Sr.',
    };
    const timestamp = 1666887649663;

    const { getByText } = render(
      <ConfirmationScreenView name={name} timestamp={timestamp} />,
    );

    expect(getByText('John Marjorie Smith Sr.')).to.exist;
    expect(getByText(moment(timestamp).format('MMM D, YYYY'))).to.exist;
    expect(getByText('Oct. 27, 2022')).to.exist;
  });
});
