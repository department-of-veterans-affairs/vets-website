import React from 'react';
import { render, within } from '@testing-library/react';
import { expect } from 'chai';
import BenefitsSummary from '../../../components/BenefitsSummary';

describe('BenefitsSummary', () => {
  it('renders result string and 0/0 for missing details', () => {
    const { getByText, rerender } = render(
      <BenefitsSummary result="eligible" entitlementDetails={undefined} />,
    );

    {
      const label = getByText('Result');
      const row = label.closest('li');
      const value = within(row).getByText(/to apply for Chapter 31 benefits/i);
      expect(value).to.exist;
    }

    {
      const label = getByText('Total months of entitlement');
      const row = label.closest('li');
      const value = within(row).getByText(/0\s*months\s*,\s*0\s*days/i);
      expect(value).to.exist;
    }

    {
      const label = getByText(
        'Months of entitlement you have used for education/training',
      );
      const row = label.closest('li');
      const value = within(row).getByText(/0\s*months\s*,\s*0\s*days/i);
      expect(value).to.exist;
    }

    {
      const label = getByText(
        'Potential months of remaining entitlement toward Chapter 31 program',
      );
      const row = label.closest('li');
      const value = within(row).getByText(/0\s*months\s*,\s*0\s*days/i);
      expect(value).to.exist;
    }

    rerender(
      <BenefitsSummary
        result="ineligible"
        entitlementDetails={{ entitlementUsed: { month: 3, days: 1 } }}
      />,
    );

    {
      const label = getByText('Result');
      const row = label.closest('li');
      const value = within(row).getByText(/to apply for Chapter 31 benefits/i);
      expect(value).to.exist;
    }
    {
      const label = getByText('Total months of entitlement');
      const row = label.closest('li');
      expect(within(row).getByText(/0\s*months\s*,\s*0\s*days/i)).to.exist;
    }
    {
      const label = getByText(
        'Months of entitlement you have used for education/training',
      );
      const row = label.closest('li');
      // Accept singular "day" or plural "days", and be flexible about commas/whitespace.
      expect(within(row).getByText(/3\s*months\s*,\s*1\s*day(s)?/i)).to.exist;
    }
    {
      const label = getByText(
        'Potential months of remaining entitlement toward Chapter 31 program',
      );
      const row = label.closest('li');
      expect(within(row).getByText(/0\s*months\s*,\s*0\s*days/i)).to.exist;
    }
  });
});
