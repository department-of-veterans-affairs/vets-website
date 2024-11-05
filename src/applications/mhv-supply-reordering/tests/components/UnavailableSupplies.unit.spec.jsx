import React from 'react';
import { render, within } from '@testing-library/react';
import { expect } from 'chai';
import { format } from 'date-fns';
import UnavailableSupplies from '../../components/UnavailableSupplies';

describe('Unavailable supplies component', () => {
  const unavailSuppliesList = [
    {
      productName: 'AIRCURVE10-ASV-CLIMATELINE',
      productGroup: 'Apnea',
      productId: 8467,
      lastOrderDate: '2022-07-06',
      nextAvailabilityDate: '2022-12-06',
      quantity: 1,
    },
    {
      productName: 'ACC2',
      productGroup: 'Accessory',
      productId: 9999,
      availableForReorder: true,
      lastOrderDate: '2023-07-06',
      nextAvailabilityDate: '2099-12-06',
      quantity: 1,
    },
  ];

  const availSuppliesList = [
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
      productName: 'AIRFIT P10',
      productGroup: 'Apnea',
      productId: 6650,
      availableForReorder: true,
      lastOrderDate: '2022-07-05',
      nextAvailabilityDate: '2022-12-05',
      quantity: 1,
    },
  ];

  it('Nothing is displayed if no mdot data is provided', () => {
    const { queryByRole } = render(
      <UnavailableSupplies mdotData={undefined} />,
    );
    expect(queryByRole('heading', { name: /Unavailable for reorder/ })).to.be
      .null;
  });

  it('Nothing is displayed if no supplies are provided', () => {
    const { queryByRole } = render(
      <UnavailableSupplies mdotData={{ supplies: [] }} />,
    );
    expect(queryByRole('heading', { name: /Unavailable for reorder/ })).to.be
      .null;
  });

  it('Nothing is displayed if only available supplies are provided', () => {
    const { queryByRole } = render(
      <UnavailableSupplies mdotData={{ supplies: availSuppliesList }} />,
    );
    expect(queryByRole('heading', { name: /Unavailable for reorder/ })).to.be
      .null;
  });

  it('Unavailable supplies displayed', () => {
    const { getByRole, queryAllByTestId } = render(
      <UnavailableSupplies
        mdotData={{ supplies: [...availSuppliesList, ...unavailSuppliesList] }}
      />,
    );
    getByRole('heading', { name: /Unavailable for reorder/ });
    const cards = queryAllByTestId('mhv-supply-intro-unavail-card');
    expect(cards.length).to.be.eql(2);
    // Check the entries are sorted by name.
    within(cards[0]).getByText(new RegExp(unavailSuppliesList[1].productName));
    // Check the message on the card based on what can be reordered.
    within(cards[0]).getByText(/You can’t order this supply online until/);
    within(cards[0]).getByText(
      new RegExp(
        format(
          new Date(unavailSuppliesList[1].nextAvailabilityDate),
          'MMMM d, yyyy',
        ),
      ),
    );
    within(cards[1]).getByText(/This item is not available for reordering/);
  });
});
