import React from 'react';
import { connect } from 'react-redux';

import AdditionalInformationSection from './insurance-information/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from './military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from './household-information/AnnualIncomeSection';
import BirthInformationSection from './veteran-information/BirthInformationSection';
import ChildInformationSection from './household-information/ChildInformationSection';
import ContactInformationSection from './veteran-information/ContactInformationSection';
import DeductibleExpensesSection from './household-information/DeductibleExpensesSection';
import DemographicInformationSection from './veteran-information/DemographicInformationSection';
import FinancialDisclosureSection from './household-information/FinancialDisclosureSection';
import InsuranceInformationSection from './insurance-information/InsuranceInformationSection';
import MedicareMedicaidSection from './insurance-information/MedicareMedicaidSection';
import PersonalInfoSection from './veteran-information/PersonalInfoSection';
import ServiceInformationSection from './military-service/ServiceInformationSection';
import SpouseInformationSection from './household-information/SpouseInformationSection';
import VAInformationSection from './va-benefits/VAInformationSection';
import VeteranAddressSection from './veteran-information/VeteranAddressSection';

import ReviewCollapsiblePanel from './form-elements/ReviewCollapsiblePanel';

/*
    TODO(crew): Get components from store and create array to check if ReviewCollapsiblePanel is
    open or closed. Also, potentially generate ReviewCollapsiblePanel components with routes from
    json object.
*/

class ReviewAndSubmitSection extends React.Component {
  render() {
    let content;

    if (this.props.isApplicationSubmitted) {
      content = (
        // TODO(crew): We need to figure out why the css isn't working here.
        <div className="usa-alert usa-alert-success">
          <div className="usa-alert-body">
            <h3 className="usa-alert-heading">You have submitted your application for health care!</h3>
            <p className="usa-alert-text">We are processing your application. You should receive a phone call from the VA in the next week.</p>
            <p className="usa-alert-text">If you do not receive a call from the VA within a week, or you have questions, call 1-877-222-VETS (8387) and press 2.</p>
          </div>
        </div>
      );
    } else {
      content = (<div>
        <p>Please make sure all your information is correct before submitting your application.</p>

        {/* TODO(crew): Change names of sections to real names. */}
        <ReviewCollapsiblePanel
            sectionLabel="Personal Information"
            updatePath="/veteran-information/personal-information"
            component={<PersonalInfoSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Birth Information"
            updatePath="/veteran-information/birth-information"
            component={<BirthInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Demographic Information"
            updatePath="/veteran-information/demographic-information"
            component={<DemographicInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Permanent Address"
            updatePath="/veteran-information/veteran-address"
            component={<VeteranAddressSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Contact Information"
            updatePath="/veteran-information/contact-information"
            component={<ContactInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Service Information"
            updatePath="/military-service/service-information"
            component={<ServiceInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Service History"
            updatePath="/military-service/additional-information"
            component={<AdditionalMilitaryInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="VA Benefits"
            updatePath="/va-benefits/basic-information"
            component={<VAInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Financial Disclosure"
            updatePath="/household-information/financial-disclosure"
            component={<FinancialDisclosureSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Spouse’s Information"
            updatePath="/household-information/spouse-information"
            component={<SpouseInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Your Children’s Information"
            updatePath="/household-information/child-information"
            component={<ChildInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Annual Income"
            updatePath="/household-information/annual-income"
            component={<AnnualIncomeSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Previous Calendar Year’s Deductible Expenses"
            updatePath="/household-information/deductible-expenses"
            component={<DeductibleExpensesSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Medicare/Medicaid"
            updatePath="/insurance-information/medicare"
            component={<MedicareMedicaidSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Insurance Information"
            updatePath="/insurance-information/general"
            component={<InsuranceInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="Additional Information"
            updatePath="/insurance-information/va-facility"
            component={<AdditionalInformationSection reviewSection/>}/>
      </div>);
    }
    return (
      <div>
        <h4>Review Application</h4>
        {content}
        <small>
          <p>I understand that pursuant to 38 U.S.C. Section 1729 and 42 U.S.C. 2651, the Department of Veterans Affairs (VA) is authorized to recover or collect from my health plan(HP) or any other legally responsible third party for the reasonable charges of nonservice-connected VA medical care or services furnished or provided to me. I hereby authorize payment directly to VA from any HP under which I am covered (including coverage provided under my spouse's HP) that is responsible for payment of the charges for my medical care, including benefits otherwise payable to me or my spouse. Furthermore, I hereby assign to the VA any claim I may have against any person or entity who is or may be legally responsible for the payment of the cost of medical services provided to me by the VA. I understand that this assignment shall not limit or prejudice my right to recover for my own benefit any amount in excess of the cost of medical services provided to me by the VA or any other amount to which I may be entitled. I hereby appoint the Attorney General of the United States and the Secretary of Veterans' Affairs and their designees as my Attorneys-in-fact to take all necessary and appropriate actions in order to recover and receive all or part of the amount herein assigned. I hereby authorize the VA to disclose, to my attorney and to any third party or administrative agency who may be responsible for payment of the cost of medical services provided to me, information from my medical records as necessary to verify my claim. Further, I hereby authorize any such third party or administrative agency to disclose to the VA any information regarding my claim.</p>
          <p>By submitting this application you are agreeing to pay the applicable VA copays for treatment or services of your NSC conditions as required by law. You also agree to receive communications from VA to your supplied email or mobile number.</p>
        </small>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isApplicationSubmitted: state.uiState.applicationSubmitted,
  };
}
// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(ReviewAndSubmitSection);
export { ReviewAndSubmitSection };
