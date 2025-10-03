import React from 'react';
import { render, within } from '@testing-library/react';
import { expect } from 'chai';
import BenefitsSummary from '../../../components/BenefitsSummary';

describe('BenefitsSummary', () => {
  it('falls back to em dash for missing/empty result and 0/0 for missing details', () => {
    const { getByText, rerender } = render(
      <BenefitsSummary result="" entitlementDetails={undefined} />,
    );

    {
      const label = getByText('Result');
      const row = label.closest('div');
      const value = within(row).getByText('—');
      expect(value).to.exist;
    }

    {
      const label = getByText('Total months you received:');
      const row = label.closest('div');
      const value = within(row).getByText(/0 months,\s*0 days/);
      expect(value).to.exist;
    }

    {
      const label = getByText('Months you used:');
      const row = label.closest('div');
      const value = within(row).getByText(/0 months,\s*0 days/);
      expect(value).to.exist;
    }

    {
      const label = getByText('Months you have left to use:');
      const row = label.closest('div');
      const value = within(row).getByText(/0 months,\s*0 days/);
      expect(value).to.exist;
    }

    // Partial details scenario
    rerender(
      <BenefitsSummary
        result={null}
        entitlementDetails={{ entitlementUsed: { month: 3, days: 1 } }}
      />,
    );

    {
      const label = getByText('Result');
      const row = label.closest('div');
      expect(within(row).getByText('—')).to.exist;
    }
    {
      const label = getByText('Total months you received:');
      const row = label.closest('div');
      expect(within(row).getByText(/0 months,\s*0 days/)).to.exist;
    }
    {
      const label = getByText('Months you used:');
      const row = label.closest('div');
      expect(within(row).getByText(/3 months,\s*1 days/)).to.exist;
    }
    {
      const label = getByText('Months you have left to use:');
      const row = label.closest('div');
      expect(within(row).getByText(/0 months,\s*0 days/)).to.exist;
    }
  });
});
