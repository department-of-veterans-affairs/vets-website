import React from 'react';
import { render } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { expect } from 'chai';

import Decision from '../../../components/claims-and-appeals/Decision';

const issues = [
  {
    description: 'Heel, increased rating',
    disposition: 'allowed',
    date: '2016-05-30',
  },
  {
    description: 'Knee, increased rating',
    disposition: 'allowed',
    date: '2016-05-30',
  },
  {
    description: 'Tinnitus, increased rating',
    disposition: 'denied',
    date: '2016-05-30',
  },
  {
    description: 'Leg, service connection',
    disposition: 'denied',
    date: '2016-05-30',
  },
  {
    description: 'Diabetes, service connection',
    disposition: 'remand',
    date: '2016-05-30',
  },
  {
    description: 'Shoulder, service connection',
    disposition: 'remand',
    date: '2016-05-30',
  },
];

describe('<Decision />', () => {
  it('should render', () => {
    const tree = render(<Decision issues={issues} aoj="vba" />);
    const allowedItems = tree.getByTestId('allowed-items');
    const deniedItems = tree.getByTestId('denied-items');
    const remandItems = tree.getByTestId('remand-items');

    expect(tree.getByRole('heading', { name: 'Granted' })).to.exist;
    expect(
      within(allowedItems).getByText(
        /The reviewer granted the following issues/i,
      ),
    ).to.exist;
    expect(within(allowedItems).getByText(/Heel, increased rating/i)).to.exist;
    expect(within(allowedItems).getByText(/Knee, increased rating/i)).to.exist;

    expect(tree.getByRole('heading', { name: 'Denied' })).to.exist;
    expect(
      within(deniedItems).getByText(
        /The reviewer denied the following issues/i,
      ),
    ).to.exist;
    expect(within(deniedItems).getByText(/Tinnitus, increased rating/i)).to
      .exist;
    expect(within(deniedItems).getByText(/Leg, service connection/i)).to.exist;

    expect(tree.getByRole('heading', { name: 'Remand' })).to.exist;
    expect(
      within(remandItems).getByText(
        /The judge is sending these issues back to the Veterans Benefits Administration/i,
      ),
    ).to.exist;
    expect(within(remandItems).getByText(/Diabetes, service connection/i)).to
      .exist;
    expect(within(remandItems).getByText(/Shoulder, service connection/i)).to
      .exist;
  });
});
