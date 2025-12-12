import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import DebtsCardLegacy from '../../../components/debts/DebtsCardLegacy';

describe('<DebtsCardLegacy />', () => {
  it('renders the DebtsCardLegacy component correctly', () => {
    const defaultProps = {
      debtsCount: 2,
    };

    const tree = renderWithStoreAndRouter(
      <DebtsCardLegacy {...defaultProps} />,
      {
        initialState: {},
      },
    );

    expect(tree.getByText(/2 overpayment debts/)).to.exist;
    expect(tree.getByText('Review your current VA benefit debt')).to.exist;
    expect(tree.getByText('Manage your VA debt')).to.exist;
  });

  it('renders zero debt message when count is 0', () => {
    const defaultProps = {
      debtsCount: 0,
    };

    const tree = renderWithStoreAndRouter(
      <DebtsCardLegacy {...defaultProps} />,
      {
        initialState: {},
      },
    );

    expect(tree.getByText('Your total VA debt balance is $0.')).to.exist;
  });

  it('renders singular debt message when count is 1', () => {
    const defaultProps = {
      debtsCount: 1,
    };

    const tree = renderWithStoreAndRouter(
      <DebtsCardLegacy {...defaultProps} />,
      {
        initialState: {},
      },
    );

    expect(tree.getByText('1 overpayment debt')).to.exist;
  });
});
