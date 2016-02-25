import React from 'react';

import AnnualIncomeSection from './annual-income-section';
import ChildInformationSection from './child-information-section';
import DeductibleExpensesSection from './deductible-expenses-section';
import FiniancialDisclosureSection from './financial-disclosure-section';
import SpouseInformationSection from './spouse-information-section';

class FinancialAssessmentPanel extends React.Component {
  render() {
    return (
      <div>
        <h3>Financial Assessment</h3>
        <FiniancialDisclosureSection/>
        <SpouseInformationSection/>
        <ChildInformationSection/>
        <AnnualIncomeSection/>
        <DeductibleExpensesSection/>
      </div>
    );
  }
}

export default FinancialAssessmentPanel;
