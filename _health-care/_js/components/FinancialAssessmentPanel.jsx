import React from 'react';

import AnnualIncomeSection from './financial-assessment/AnnualIncomeSection';
import ChildInformationSection from './financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from './financial-assessment/DeductibleExpensesSection';
import FinancialDisclosureSection from './financial-assessment/FinancialDisclosureSection';
import SpouseInformationSection from './financial-assessment/SpouseInformationSection';

class FinancialAssessmentPanel extends React.Component {
  render() {
    return (
      <div>
        <h3>Financial Assessment</h3>
        <FinancialDisclosureSection data={this.props.applicationData.financialAssessment.financialDisclosure}
            onStateChange={
              (subfield, update) => {
                this.props.publishStateChange(['financialAssessment', 'financialDisclosure', subfield], update);
              }
            }/>
        <SpouseInformationSection data={this.props.applicationData.financialAssessment.spouseInformation}
            onStateChange={
              (subfield, update) => {
                this.props.publishStateChange(['financialAssessment', 'spouseInformation', subfield], update);
              }
            }/>
        <ChildInformationSection data={this.props.applicationData.financialAssessment.childInformation}
            onStateChange={
              (subfield, update) => {
                this.props.publishStateChange(['financialAssessment', 'childInformation', subfield], update);
              }
            }/>
        <AnnualIncomeSection data={this.props.applicationData.financialAssessment.annualIncome}
            onStateChange={
              (subfield, update) => {
                this.props.publishStateChange(['financialAssessment', 'annualIncome', subfield], update);
              }
            }/>
        <DeductibleExpensesSection data={this.props.applicationData.financialAssessment.deductibleExpenses}
            onStateChange={
              (subfield, update) => {
                this.props.publishStateChange(['financialAssessment', 'deductibleExpenses', subfield], update);
              }
            }/>
      </div>
    );
  }
}

export default FinancialAssessmentPanel;
