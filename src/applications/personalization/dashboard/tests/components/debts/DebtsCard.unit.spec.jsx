import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import DebtsCard from '../../../components/debts/DebtsCard';

describe('<DebtsCard />', () => {
  it('renders the DebtsCard component correctly', () => {
    const defaultProps = {
      debts: [
        {
          fileNumber: '796121200',
          payeeNumber: '00',
          personEntitled: 'AJOHNS',
          deductionCode: '71',
          benefitType: 'CH33 Books, Supplies/MISC EDU',
          diaryCode: '100',
          diaryCodeDescription: 'Pending payment',
          amountOverpaid: 0,
          amountWithheld: 0,
          originalAr: 166.67,
          currentAr: 120.4,
          debtHistory: [
            {
              date: '09/18/2012',
              letterCode: '100',
              description:
                'First Demand Letter - Inactive Benefits - Due Process',
            },
          ],
        },
        {
          fileNumber: '796121211',
          payeeNumber: '00',
          personEntitled: 'AJHONS',
          deductionCode: '30',
          benefitType: 'Comp & Pen',
          diaryCode: '914',
          diaryCodeDescription: 'Paid in Full',
          amountOverpaid: 0,
          amountWithheld: 0,
          originalAr: 136.24,
          currentAr: 25,
          debtHistory: [
            {
              date: '02/25/2009',
              letterCode: '914',
              description:
                'Paid In Full - Account balance cleared via offset, not including TOP.',
            },
            {
              date: '02/07/2009',
              letterCode: '905',
              description: 'Administrative Write Off',
            },
            {
              date: '12/03/2008',
              letterCode: '487',
              description: 'Death Case Pending Action',
            },
          ],
        },
      ],
    };

    const tree = renderWithStoreAndRouter(<DebtsCard {...defaultProps} />, {
      initialState: {},
    });

    expect(tree.getByText(/2 overpayment debts/)).to.exist;
    expect(tree.getByText('updated on', { exact: false })).to.exist;
    expect(tree.getByText('manage your va debt', { exact: false })).to.exist;
  });
});
