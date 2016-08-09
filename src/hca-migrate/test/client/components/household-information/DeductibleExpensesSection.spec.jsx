import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { DeductibleExpensesSection } from '../../../../src/client/components/household-information/DeductibleExpensesSection';
import { makeField } from '../../../../src/common/fields';

describe('<DeductibleExpensesSection>', () => {
  it('renders expenses when entered', () => {
    const data = {
      deductibleMedicalExpenses: makeField('1'),
      deductibleFuneralExpenses: makeField('2'),
      deductibleEducationExpenses: makeField('3')
    };
    const tree = SkinDeep.shallowRender(<DeductibleExpensesSection isSectionComplete reviewSection data={data}/>);
    const reviewTable = tree.subTree('.review');
    expect(reviewTable.text()).to.equal('Total non-reimbursed medical expenses paid by you or your spouse:1Amount you paid last calendar year for funeral and burial expenses for your deceased spouse or dependent child:2Amount you paid last calendar year for your college or vocational educational expenses:3');
  });

  it('renders a message when no expenses are entered', () => {
    const data = {
      deductibleMedicalExpenses: makeField(''),
      deductibleFuneralExpenses: makeField(''),
      deductibleEducationExpenses: makeField('')
    };
    const tree = SkinDeep.shallowRender(<DeductibleExpensesSection isSectionComplete reviewSection data={data}/>);
    const reviewTable = tree.subTree('.review');
    expect(reviewTable.text()).to.equal('No expense information was entered');
  });
});
