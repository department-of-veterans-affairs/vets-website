import React from 'react';
import { Route } from 'react-router';

import AdditionalInformationSection from './components/insurance-information/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from './components/military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from './components/household-information/AnnualIncomeSection';
import BirthInformationSection from './components/veteran-information/BirthInformationSection';
import ChildInformationSection from './components/household-information/ChildInformationSection';
import ContactInformationSection from './components/veteran-information/ContactInformationSection';
import DeductibleExpensesSection from './components/household-information/DeductibleExpensesSection';
import DemographicInformationSection from './components/veteran-information/DemographicInformationSection';
import FinancialDisclosureSection from './components/household-information/FinancialDisclosureSection';
import InsuranceInformationSection from './components/insurance-information/InsuranceInformationSection';
import IntroductionSection from './components/IntroductionSection.jsx';
import MedicareMedicaidSection from './components/insurance-information/MedicareMedicaidSection';
import PersonalInfoSection from './components/veteran-information/PersonalInfoSection';
import ReviewAndSubmitSection from './components/ReviewAndSubmitSection.jsx';
import ServiceInformationSection from './components/military-service/ServiceInformationSection';
import SpouseInformationSection from './components/household-information/SpouseInformationSection';
import SubmitMessage from './components/SubmitMessage.jsx';
import VeteranAddressSection from './components/veteran-information/VeteranAddressSection';
import VAInformationSection from './components/va-benefits/VAInformationSection';

import { chapterNames } from './utils/helpers';
import { groupPagesIntoChapters, getPageList } from '../common/utils/helpers';

const routes = [
  // Introduction route.
  <Route
      component={IntroductionSection}
      key="/introduction"
      path="/introduction"/>,

  // Personal Information routes.
  <Route
      component={PersonalInfoSection}
      chapter={chapterNames.veteranInformation}
      name="Personal information"
      key="/veteran-information/personal-information"
      path="/veteran-information/personal-information"/>,
  <Route
      component={BirthInformationSection}
      chapter={chapterNames.veteranInformation}
      name="Birth information"
      key="/veteran-information/birth-information"
      path="/veteran-information/birth-information"/>,
  <Route
      component={DemographicInformationSection}
      chapter={chapterNames.veteranInformation}
      name="Demographic information"
      key="/veteran-information/demographic-information"
      path="/veteran-information/demographic-information"/>,
  <Route
      component={VeteranAddressSection}
      chapter={chapterNames.veteranInformation}
      name="Address"
      key="/veteran-information/veteran-address"
      path="/veteran-information/veteran-address"/>,
  <Route
      component={ContactInformationSection}
      chapter={chapterNames.veteranInformation}
      name="Contact information"
      key="/veteran-information/contact-information"
      path="/veteran-information/contact-information"/>,

// Military Service routes.
  <Route
      component={ServiceInformationSection}
      chapter={chapterNames.militaryService}
      name="Service information"
      key="/military-service/service-information"
      path="/military-service/service-information"/>,
  <Route
      component={AdditionalMilitaryInformationSection}
      chapter={chapterNames.militaryService}
      name="Service history"
      key="/military-service/additional-information"
      path="/military-service/additional-information"/>,

  // VA Benefits routes.
  <Route
      component={VAInformationSection}
      chapter={chapterNames.vaBenefits}
      name="Basic information"
      key="/va-benefits/basic-information"
      path="/va-benefits/basic-information"/>,

 // Household Information routes.
  <Route
      component={FinancialDisclosureSection}
      chapter={chapterNames.householdInformation}
      name="Financial disclosure"
      key="/household-information/financial-disclosure"
      path="/household-information/financial-disclosure"/>,
  <Route
      component={SpouseInformationSection}
      chapter={chapterNames.householdInformation}
      name="Spouse"
      depends={[
        { discloseFinancialInformation: { value: 'Y' }, maritalStatus: { value: 'Married' } },
        { discloseFinancialInformation: { value: 'Y' }, maritalStatus: { value: 'Separated' } },
      ]}
      key="/household-information/spouse-information"
      path="/household-information/spouse-information"/>,
  <Route
      component={ChildInformationSection}
      chapter={chapterNames.householdInformation}
      name="Children"
      depends={{ discloseFinancialInformation: { value: 'Y' } }}
      key="/household-information/child-information"
      path="/household-information/child-information"/>,
  <Route
      component={AnnualIncomeSection}
      chapter={chapterNames.householdInformation}
      name="Annual income"
      depends={{ discloseFinancialInformation: { value: 'Y' } }}
      key="/household-information/annual-income"
      path="/household-information/annual-income"/>,
  <Route
      component={DeductibleExpensesSection}
      chapter={chapterNames.householdInformation}
      name="Deductible expenses"
      depends={{ discloseFinancialInformation: { value: 'Y' } }}
      key="/household-information/deductible-expenses"
      path="/household-information/deductible-expenses"/>,

// Insurance Information routes.
  <Route
      component={MedicareMedicaidSection}
      chapter={chapterNames.insuranceInformation}
      name="Medicare/Medicaid"
      key="/insurance-information/medicare"
      path="/insurance-information/medicare"/>,
  <Route
      component={InsuranceInformationSection}
      chapter={chapterNames.insuranceInformation}
      name="General insurance"
      key="/insurance-information/general"
      path="/insurance-information/general"/>,
  <Route
      component={AdditionalInformationSection}
      chapter={chapterNames.insuranceInformation}
      name="VA medical facility"
      key="/insurance-information/va-facility"
      path="/insurance-information/va-facility"/>,

  // Review and Submit route.
  <Route
      component={ReviewAndSubmitSection}
      chapter={chapterNames.review}
      key="/review-and-submit"
      path="/review-and-submit"/>,

 // Submit Message route.
  <Route
      component={SubmitMessage}
      key="/submit-message"
      path="/submit-message"/>
];

export default routes;

// Chapters are groups of form pages that correspond to the steps in the navigation components
export const chapters = groupPagesIntoChapters(routes.map(r => r.props));
export const pages = getPageList(routes.map(r => r.props));
