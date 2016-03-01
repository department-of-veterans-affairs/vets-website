import React from 'react';

import AnnualIncomeSection from './financial-assessment/AnnualIncomeSection';
import ChildInformationSection from './financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from './financial-assessment/DeductibleExpensesSection';
import FiniancialDisclosureSection from './financial-assessment/FinancialDisclosureSection';
import SpouseInformationSection from './financial-assessment/SpouseInformationSection';

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
