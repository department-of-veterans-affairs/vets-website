import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import EditReviewSupplies from '../../components/EditReviewSupplies';

const title = 'Available for reorder';
const defaultEditButton = () => {};
const options = {
  chosenSupplies: {
    '6584': true,
  },
  supplies: [
    {
      productName: 'ERHK HE11 680 MINI',
      productGroup: 'Accessory',
      productId: 6584,
      availableForReorder: true,
      lastOrderDate: '2022-05-16',
      nextAvailabilityDate: '2022-10-16',
      quantity: 5,
    },
    {
      productName: 'AIRFIT F10 M',
      productGroup: 'Apnea',
      productId: 6641,
      availableForReorder: true,
      lastOrderDate: '2022-07-05',
      nextAvailabilityDate: '2022-12-05',
      quantity: 1,
    },
  ],
};

const setup = (formData = options) => {
  return render(
    <div>
      <EditReviewSupplies
        formData={formData}
        title={title}
        defaultEditButton={defaultEditButton}
      />
    </div>,
  );
};

describe('EditReviewSupplies', () => {
  it('renders', () => {
    const { getByRole, getByText } = setup();
    getByRole('heading', { level: 4, name: title });
    getByText(options.supplies[0].productName);
  });
  it('renders with no chosenSupplies', () => {
    const { getByRole, queryByText } = setup({
      ...options,
      chosenSupplies: undefined,
    });
    getByRole('heading', { level: 4, name: title });
    expect(queryByText(options.supplies[0].productName)).to.be.null;
  });
});
