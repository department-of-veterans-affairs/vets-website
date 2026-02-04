import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { SCHEMA_LABELS } from '../../../../chapters/healthInsurance/planTypes';
import HealthInsuranceSummaryCard from '../../../../components/FormDescriptions/HealthInsuranceSummaryCard';

describe('10-7959c <HealthInsuranceSummaryCard>', () => {
  const subject = ({ item }) => {
    const { container } = render(<HealthInsuranceSummaryCard {...item} />);
    return container.textContent;
  };

  it('should render correct insurance type label', () => {
    const item = { insuranceType: 'hmo' };
    const textContent = subject({ item });
    expect(textContent).to.include('Type:');
    expect(textContent).to.include(SCHEMA_LABELS.hmo);
  });

  it('should render correct date range when end date is provided', () => {
    const item = {
      effectiveDate: '2023-01-15',
      expirationDate: '2024-01-15',
    };
    const textContent = subject({ item });
    expect(textContent).to.include('Dates:');
    expect(textContent).to.include('01/15/2023 - 01/15/2024');
  });

  it('should render correct date range when end date is omitted', () => {
    const item = {
      effectiveDate: '2023-01-15',
      expirationDate: null,
    };
    const textContent = subject({ item });
    expect(textContent).to.include('01/15/2023 - present');
  });
});
