import React from 'react';

import AdditionalInformationSection from './personal-information/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from './military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from './financial-assessment/AnnualIncomeSection';
import ChildInformationSection from './financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from './financial-assessment/DeductibleExpensesSection';
import DemographicInformationSection from './personal-information/DemographicInformationSection';
import FinancialDisclosureSection from './financial-assessment/FinancialDisclosureSection';
import InsuranceInformationSection from './insurance-information/InsuranceInformationSection';
import MedicareMedicaidSection from './insurance-information/MedicareMedicaidSection';
import NameAndGeneralInfoSection from './personal-information/NameAndGeneralInfoSection';
import ServiceInformationSection from './military-service/ServiceInformationSection';
import SpouseInformationSection from './financial-assessment/SpouseInformationSection';
import VAInformationSection from './personal-information/VAInformationSection';
import VeteranAddressSection from './personal-information/VeteranAddressSection';


class ReviewAndSubmitSection extends React.Component {
  render() {
    return (
      <div>
        <h4>Review and Submit</h4>
        <p>Please ensure all of your information is correct before submitting your application.</p>
        <NameAndGeneralInfoSection reviewSection/>
        <VAInformationSection reviewSection/>
        <AdditionalInformationSection reviewSection/>
        <DemographicInformationSection reviewSection/>
        <VeteranAddressSection reviewSection/>
        <InsuranceInformationSection reviewSection/>
        <MedicareMedicaidSection reviewSection/>
        <ServiceInformationSection reviewSection/>
        <AdditionalMilitaryInformationSection reviewSection/>
        <FinancialDisclosureSection reviewSection/>
        <SpouseInformationSection reviewSection/>
        <ChildInformationSection reviewSection/>
        <AnnualIncomeSection reviewSection/>
        <DeductibleExpensesSection reviewSection/>
      </div>
    );
  }
}

export default ReviewAndSubmitSection;

