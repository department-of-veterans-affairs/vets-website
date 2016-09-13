import React from 'react';
import { Route } from 'react-router';

import { chapterNames, groupPagesIntoChapters, getPageList } from './utils/helpers';

import IntroductionPage from './containers/IntroductionPage.jsx';
import PersonalInformationPage from './containers/veteran-information/PersonalInformationPage';
import PersonalInformationReview from './components/veteran-information/PersonalInformationReview';
import PersonalInformationFields from './components/veteran-information/PersonalInformationFields';
import ContactInformationPage from './containers/veteran-information/ContactInformationPage';
import ContactInformationReview from './components/veteran-information/ContactInformationReview';
import ContactInformationFields from './components/veteran-information/ContactInformationFields';
import SecondaryContactPage from './containers/veteran-information/SecondaryContactPage';
import SecondaryContactReview from './components/veteran-information/SecondaryContactReview';
import SecondaryContactFields from './components/veteran-information/SecondaryContactFields';
import DirectDepositPage from './containers/veteran-information/DirectDepositPage';
import DirectDepositReview from './components/veteran-information/DirectDepositReview';
import DirectDepositFields from './components/veteran-information/DirectDepositFields';
import BenefitsSelectionPage from './containers/BenefitsSelectionPage';
import BenefitsSelectionReview from './components/BenefitsSelectionReview';
import BenefitsSelectionFields from './components/BenefitsSelectionFields';
import MilitaryServicePage from './containers/MilitaryServicePage';
import MilitaryServiceReview from './components/MilitaryServiceReview';
import MilitaryServiceFields from './components/MilitaryServiceFields';
import RotcHistoryPage from './containers/RotcHistoryPage';
import RotcHistoryReview from './components/RotcHistoryReview';
import RotcHistoryFields from './components/RotcHistoryFields';
import BenefitsHistoryPage from './containers/BenefitsHistoryPage';
import BenefitsHistoryReview from './components/BenefitsHistoryReview';
import BenefitsHistoryFields from './components/BenefitsHistoryFields';
import DependentInformationPage from './containers/DependentInformationPage';
import DependentInformationReview from './components/DependentInformationReview';
import DependentInformationFields from './components/DependentInformationFields';
import EmploymentHistoryPage from './containers/EmploymentHistoryPage';
import EmploymentHistoryReview from './components/EmploymentHistoryReview';
import EmploymentHistoryFields from './components/EmploymentHistoryFields';
import SchoolSelectionPage from './containers/SchoolSelectionPage';
import SchoolSelectionReview from './components/SchoolSelectionReview';
import SchoolSelectionFields from './components/SchoolSelectionFields';
import ReviewPage from './containers/ReviewPage';
import PlaceholderPage from './containers/PlaceholderPage';

const routes = [
  // Introduction route.
  <Route
      component={IntroductionPage}
      key="/introduction"
      path="/introduction"/>,
  <Route
      component={PersonalInformationPage}
      fieldsComponent={PersonalInformationFields}
      reviewComponent={PersonalInformationReview}
      key="/veteran-information/personal-information"
      path="/veteran-information/personal-information"
      chapter={chapterNames.veteranInformation}
      name="Personal Information"/>,
  <Route
      component={ContactInformationPage}
      fieldsComponent={ContactInformationFields}
      reviewComponent={ContactInformationReview}
      key="/veteran-information/contact-information"
      path="/veteran-information/contact-information"
      chapter={chapterNames.veteranInformation}
      name="Contact Information"/>,
  <Route
      component={SecondaryContactPage}
      fieldsComponent={SecondaryContactFields}
      reviewComponent={SecondaryContactReview}
      key="/veteran-information/secondary-contact"
      path="/veteran-information/secondary-contact"
      chapter={chapterNames.veteranInformation}
      name="Secondary Contact"/>,
  <Route
      component={DirectDepositPage}
      fieldsComponent={DirectDepositFields}
      reviewComponent={DirectDepositReview}
      key="/veteran-information/direct-deposit"
      path="/veteran-information/direct-deposit"
      chapter={chapterNames.veteranInformation}
      name="Direct Deposit"/>,
  <Route
      component={BenefitsSelectionPage}
      fieldsComponent={BenefitsSelectionFields}
      reviewComponent={BenefitsSelectionReview}
      key="/benefits-eligibility/benefits-selection"
      path="/benefits-eligibility/benefits-selection"
      chapter={chapterNames.benefitsEligibility}
      name="Benefits Selection"/>,
  <Route
      component={MilitaryServicePage}
      fieldsComponent={MilitaryServiceFields}
      reviewComponent={MilitaryServiceReview}
      key="/military-history/military-service"
      path="/military-history/military-service"
      chapter={chapterNames.militaryHistory}
      name="Military Service"/>,
  <Route
      component={RotcHistoryPage}
      fieldsComponent={RotcHistoryFields}
      reviewComponent={RotcHistoryReview}
      key="/military-history/rotc-history"
      path="/military-history/rotc-history"
      depends={{ seniorRotcCommissioned: { value: 'Y' } }}
      chapter={chapterNames.militaryHistory}
      name="ROTC History"/>,
  <Route
      component={BenefitsHistoryPage}
      fieldsComponent={BenefitsHistoryFields}
      reviewComponent={BenefitsHistoryReview}
      key="/military-history/benefits-history"
      path="/military-history/benefits-history"
      chapter={chapterNames.militaryHistory}
      name="Benefits History"/>,
  <Route
      component={DependentInformationPage}
      fieldsComponent={DependentInformationFields}
      reviewComponent={DependentInformationReview}
      key="/military-history/dependents"
      path="/military-history/dependents"
      chapter={chapterNames.militaryHistory}
      name="Dependents"/>,
  <Route
      component={PlaceholderPage}
      key="/education-history/education-information"
      path="/education-history/education-information"
      chapter={chapterNames.educationHistory}
      name="Education History"/>,
  <Route
      component={EmploymentHistoryPage}
      fieldsComponent={EmploymentHistoryFields}
      reviewComponent={EmploymentHistoryReview}
      key="/employment-history/employment-information"
      path="/employment-history/employment-information"
      chapter={chapterNames.employmentHistory}
      name="Employment History"/>,
  <Route
      component={SchoolSelectionPage}
      fieldsComponent={SchoolSelectionFields}
      reviewComponent={SchoolSelectionReview}
      key="/school-selection/school-information"
      path="/school-selection/school-information"
      chapter={chapterNames.schoolSelection}
      name="School Selection"/>,
  // Review and Submit route.
  <Route
      component={ReviewPage}
      key="/review-and-submit"
      path="/review-and-submit"
      chapter={chapterNames.review}/>,
  // Submit Message route.
  <Route
      component={PlaceholderPage}
      key="/submit-message"
      path="/submit-message"/>
];

export default routes;

// Chapters are groups of form pages that correspond to the steps in the navigation components
export const chapters = groupPagesIntoChapters(routes);
export const pages = getPageList(routes);
