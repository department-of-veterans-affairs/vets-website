import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { getVaLinkByText } from 'applications/personalization/common/unitHelpers';
import DebtsCard from '../../../components/debts/DebtsCard';

describe('<DebtsCard />', () => {
  it('renders the DebtsCard component correctly', () => {
    const defaultProps = {
      debtsCount: 2,
    };

    const tree = renderWithStoreAndRouter(<DebtsCard {...defaultProps} />, {
      initialState: {},
    });

    expect(tree.getByText(/2 outstanding debts/)).to.exist;
    expect(getVaLinkByText('Review outstanding debts', tree)).to.exist;
  });

  it('renders zero debt message when count is 0', () => {
    const defaultProps = {
      debtsCount: 0,
    };

    const tree = renderWithStoreAndRouter(<DebtsCard {...defaultProps} />, {
      initialState: {},
    });

    expect(tree.getByText('Your total VA debt balance is $0.')).to.exist;
  });

  it('renders singular debt message when count is 1', () => {
    const defaultProps = {
      debtsCount: 1,
    };

    const tree = renderWithStoreAndRouter(<DebtsCard {...defaultProps} />, {
      initialState: {},
    });

    expect(tree.getByText('1 outstanding debt')).to.exist;
  });
});
