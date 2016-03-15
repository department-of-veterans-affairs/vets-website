import React from 'react';
import { Route, Redirect } from 'react-router';

import AdditionalInformationSection from './components/personal-information/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from './components/military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from './components/financial-assessment/AnnualIncomeSection';
import ChildInformationSection from './components/financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from './components/financial-assessment/DeductibleExpensesSection';
import DemographicInformationSection from './components/personal-information/DemographicInformationSection';
import FinancialDisclosureSection from './components/financial-assessment/FinancialDisclosureSection';
import InsuranceInformationSection from './components/insurance-information/InsuranceInformationSection';
import IntroductionSection from './components/IntroductionSection.jsx';
import MedicareMedicaidSection from './components/insurance-information/MedicareMedicaidSection';
import NameAndGeneralInfoSection from './components/personal-information/NameAndGeneralInfoSection';
import ReviewAndSubmitSection from './components/ReviewAndSubmitSection.jsx';
import ServiceInformationSection from './components/military-service/ServiceInformationSection';
import SpouseInformationSection from './components/financial-assessment/SpouseInformationSection';
import VAInformationSection from './components/personal-information/VAInformationSection';
import VeteranAddressSection from './components/personal-information/VeteranAddressSection';

const routes = [
  // Introduction route.
  <Route
      component={IntroductionSection}
      key="/introduction"
      path="/introduction"/>,

  // Personal Information routes.
  <Redirect
      key="/personal-information"
      from="/personal-information"
      to="/personal-information/name-and-general-information"/>,
  <Route
      component={NameAndGeneralInfoSection}
      key="/personal-information/name-and-general-information"
      path="/personal-information/name-and-general-information"/>,
  <Route
      component={VAInformationSection}
      key="/personal-information/va-information"
      path="/personal-information/va-information"/>,
  <Route
      component={AdditionalInformationSection}
      key="/personal-information/additional-information"
      path="/personal-information/additional-information"/>,
  <Route
      component={DemographicInformationSection}
      key="/personal-information/demographic-information"
      path="/personal-information/demographic-information"/>,
  <Route
      component={VeteranAddressSection}
      key="/personal-information/veteran-address"
      path="/personal-information/veteran-address"/>,

  // Insurance Information routes.
  <Redirect
      key="/insurance-information"
      from="/insurance-information"
      to="/insurance-information/general"/>,
  <Route
      component={InsuranceInformationSection}
      key="/insurance-information/general"
      path="/insurance-information/general"/>,
  <Route
      component={MedicareMedicaidSection}
      key="/insurance-information/medicare-medicaid"
      path="/insurance-information/medicare-medicaid"/>,

  // Military Service routes.
  <Redirect
      key="/military-service"
      from="/military-service"
      to="/military-service/service-information"/>,
  <Route
      component={ServiceInformationSection}
      key="/military-service/service-information"
      path="/military-service/service-information"/>,
  <Route
      component={AdditionalMilitaryInformationSection}
      key="/military-service/additional-information"
      path="/military-service/additional-information"/>,

  // Financial Assessment routes.
  <Redirect
      key="/financial-assessment"
      from="/financial-assessment"
      to="/financial-assessment/financial-disclosure"/>,
  <Route
      component={FinancialDisclosureSection}
      key="/financial-assessment/financial-disclosure"
      path="/financial-assessment/financial-disclosure"/>,
  <Route
      component={SpouseInformationSection}
      key="/financial-assessment/spouse-information"
      path="/financial-assessment/spouse-information"/>,
  <Route
      component={ChildInformationSection}
      key="/financial-assessment/child-information"
      path="/financial-assessment/child-information"/>,
  <Route
      component={AnnualIncomeSection}
      key="/financial-assessment/annual-income"
      path="/financial-assessment/annual-income"/>,
  <Route
      component={DeductibleExpensesSection}
      key="/financial-assessment/deductible-expenses"
      path="/financial-assessment/deductible-expenses"/>,

  // Review and Submit route.
  <Route
      component={ReviewAndSubmitSection}
      key="/review-and-submit"
      path="/review-and-submit"/>
];

export default routes;
