import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import DebtSelectionReview from '../../components/DebtSelectionReview';

describe('<DebtSelectionReview>', () => {
  it('renders without crashing with empty data', () => {
    const { getByText } = render(
      <DebtSelectionReview data={{}} editPage={() => {}} />,
    );
    expect(getByText('No debts selected')).to.exist;
  });
});
