import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Benefits from '../../../../containers/components/Benefits';

describe('Benefits Component', () => {
  it('should render all benefits', () => {
    function MockBenefitCard({ benefit }) {
      return <div className="mock-benefit-card">{benefit.name}</div>;
    }

    const mockBenefitsList = [
      { id: '1', name: 'Health Care', category: 'Health' },
      { id: '2', name: 'Education', category: 'Education' },
      { id: '3', name: 'Life Insurance', category: 'Insurance' },
    ];

    const { getAllByText } = render(
      <Benefits
        benefits={[]}
        benefitsList={mockBenefitsList}
        benefitIds={{ 1: true }}
        handleClick={() => {}}
        results={{ isLoading: false, data: [] }}
        BenefitCard={MockBenefitCard}
      />,
    );

    const benefitCards = getAllByText(/Education|Life Insurance/);
    expect(benefitCards).to.have.lengthOf(3);
  });
});
