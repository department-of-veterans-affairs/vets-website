import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  UnassociatedIncomeSummaryDescription,
  AssociatedIncomeSummaryDescription,
  RoyaltiesSummaryDescription,
} from '../../../components/SummaryDescriptions';

describe('<SummaryDescriptions />', () => {
  describe('<UnassociatedIncomeSummaryDescription />', () => {
    it('renders intro, list items, exclusion text, and Note', () => {
      const { getByText, container } = render(
        <UnassociatedIncomeSummaryDescription />,
      );

      expect(
        getByText(/Recurring income is income you receive on a regular basis/i),
      ).to.exist;

      const lis = Array.from(container.querySelectorAll('ul li')).map(
        li => li.textContent,
      );
      expect(lis).to.include.members([
        'Wages from a job',
        'Social Security',
        'Pensions, including those from Philippine Veterans Affairs Office',
        'Retirement (military, civil service, railroad, private)',
        'Other benefits (Black Lung, unemployment)',
      ]);
      expect(lis.length).to.equal(5);

      expect(
        getByText(
          /This doesn’t include interest or dividends from financial accounts or income from property you own/i,
        ),
      ).to.exist;

      expect(getByText(/^Note:/i).tagName).to.equal('STRONG');
      expect(
        getByText(
          /don’t list any income you reported on VA Form 21P-527EZ or 21P-534EZ/i,
        ),
      ).to.exist;
    });
  });

  describe('<AssociatedIncomeSummaryDescription />', () => {
    it('renders examples list for financial accounts', () => {
      const { getByText, container } = render(
        <AssociatedIncomeSummaryDescription />,
      );

      expect(
        getByText(/Here are some examples of income from financial accounts/i),
      ).to.exist;

      const lis = Array.from(container.querySelectorAll('ul li')).map(
        li => li.textContent,
      );
      expect(lis).to.include.members([
        'Savings bonds',
        'Stocks and dividends',
        'Interest-earning accounts, like checkings and savings',
        'Distributions from Individual Retirement Accounts (IRAs), including required minimum distributions (RMDs)',
        'Pension plans with cash value',
      ]);
      expect(lis.length).to.equal(5);
    });
  });

  describe('<RoyaltiesSummaryDescription />', () => {
    it('renders examples list for royalties and includes Note', () => {
      const { getByText, container } = render(<RoyaltiesSummaryDescription />);

      expect(
        getByText(
          /Here are some examples of income from royalties or other owned assets/i,
        ),
      ).to.exist;

      const lis = Array.from(container.querySelectorAll('ul li')).map(
        li => li.textContent,
      );
      expect(lis).to.include.members([
        'Royalties from intellectual property (like acting, writing, or inventions)',
        'Income from extraction of minerals or lumber',
        'Payments for land use',
      ]);
      expect(lis.length).to.equal(3);

      expect(getByText(/^Note:/i).tagName).to.equal('STRONG');
      expect(
        getByText(
          /You can include any documents about the asset’s value, explain if it can be sold, and report the income it generates/i,
        ),
      ).to.exist;
    });
  });
});
