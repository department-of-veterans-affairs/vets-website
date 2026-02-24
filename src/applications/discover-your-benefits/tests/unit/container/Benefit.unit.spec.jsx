import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Benefits from '../../../containers/components/Benefits';

describe('Benefits Component', () => {
  it('should display a loading indicator when results are loading', () => {
    const { container } = render(
      <Benefits
        benefits={[]}
        benefitsList={[]}
        benefitIds={{}}
        handleClick={() => {}}
        results={{ isLoading: true, data: [] }}
        queryString={{}}
      />,
    );

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.exist;

    expect(loadingIndicator.getAttribute('message')).to.equal(
      'Loading results...',
    );
    expect(loadingIndicator.getAttribute('label')).to.equal('Loading');
  });

  it('should render a list of benefits when benefits are provided', () => {
    const mockBenefits = [
      { id: '1', name: 'Health Care', category: 'Health Care' },
      { id: '2', name: 'Education', category: 'Education' },
    ];

    const { container } = render(
      <Benefits
        benefits={mockBenefits}
        benefitsList={[]}
        benefitIds={{}}
        handleClick={() => {}}
        results={{ isLoading: false, data: mockBenefits }}
        queryString={{}}
        isBenefitRecommended={() => false}
      />,
    );

    const benefitList = container.querySelector('.benefit-list');
    expect(benefitList).to.exist;

    const benefitItems = benefitList.querySelectorAll('li');
    expect(benefitItems).to.have.lengthOf(2);

    expect(benefitItems[0].textContent).to.include('Health Care');
    expect(benefitItems[1].textContent).to.include('Education');
  });

  it('should render all benefits if "allBenefits" is in the query string', () => {
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
        benefitIds={{ 1: true }} // Exclude "Health Care"
        handleClick={() => {}}
        results={{ isLoading: false, data: [] }}
        queryString={{ allBenefits: 'true' }}
        BenefitCard={MockBenefitCard} // Use the mocked component
        isBenefitRecommended={() => false}
      />,
    );

    const benefitCards = getAllByText(/Education|Life Insurance/);
    expect(benefitCards).to.have.lengthOf(3);
  });
});
