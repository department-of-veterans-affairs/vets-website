import React from 'react';
import { Route } from 'react-router';

import { chapterNames, groupPagesIntoChapters, getPageList } from './utils/helpers';

import IntroductionPage from './containers/IntroductionPage.jsx';
import BenefitsSelectionPage from './containers/BenefitsSelectionPage';
import MilitaryServicePage from './containers/MilitaryServicePage';
import BenefitsHistoryPage from './containers/BenefitsHistoryPage';
import PersonalInformationPage from './containers/veteran-information/PersonalInformationPage';
import ContactInformationPage from './containers/veteran-information/ContactInformationPage';
import DependentInformationPage from './containers/DependentInformationPage';
import SchoolSelectionPage from './containers/SchoolSelectionPage';
import EmploymentHistoryPage from './containers/EmploymentHistoryPage';
import SecondaryContactPage from './containers/veteran-information/SecondaryContactPage';
import DirectDepositPage from './containers/veteran-information/DirectDepositPage';
import PlaceholderPage from './containers/PlaceholderPage';

const routes = [
  // Introduction route.
  <Route
      component={IntroductionPage}
      key="/introduction"
      path="/introduction"/>,
  <Route
      component={PersonalInformationPage}
      key="/veteran-information/personal-information"
      path="/veteran-information/personal-information"
      chapter={chapterNames.veteranInformation}
      name="Personal Information"/>,
  <Route
      component={ContactInformationPage}
      key="/veteran-information/contact-information"
      path="/veteran-information/contact-information"
      chapter={chapterNames.veteranInformation}
      name="Contact Information"/>,
  <Route
      component={SecondaryContactPage}
      key="/veteran-information/secondary-contact"
      path="/veteran-information/secondary-contact"
      chapter={chapterNames.veteranInformation}
      name="Secondary Contact"/>,
  <Route
      component={DirectDepositPage}
      key="/veteran-information/direct-deposit"
      path="/veteran-information/direct-deposit"
      chapter={chapterNames.veteranInformation}
      name="Direct Deposit"/>,
  <Route
      component={BenefitsSelectionPage}
      key="/benefits-eligibility/benefits-selection"
      path="/benefits-eligibility/benefits-selection"
      chapter={chapterNames.benefitsEligibility}/>,
  <Route
      component={MilitaryServicePage}
      key="/military-history/military-service"
      path="/military-history/military-service"
      chapter={chapterNames.militaryHistory}
      name="Military Service"/>,
  <Route
      component={PlaceholderPage}
      key="/military-history/rotc-history"
      path="/military-history/rotc-history"
      depends={{ seniorRotcComissioned: { value: 'Y' } }}
      chapter={chapterNames.militaryHistory}
      name="ROTC History"/>,
  <Route
      component={BenefitsHistoryPage}
      key="/military-history/benefits-history"
      path="/military-history/benefits-history"
      chapter={chapterNames.militaryHistory}
      name="Benefits History"/>,
  <Route
      component={DependentInformationPage}
      key="/military-history/dependents"
      path="/military-history/dependents"
      chapter={chapterNames.militaryHistory}
      name="Dependents"/>,
  <Route
      component={PlaceholderPage}
      key="/education-history/education-information"
      path="/education-history/education-information"
      chapter={chapterNames.educationHistory}/>,
  <Route
      component={EmploymentHistoryPage}
      key="/employment-history/employment-information"
      path="/employment-history/employment-information"
      chapter={chapterNames.employmentHistory}/>,
  <Route
      component={SchoolSelectionPage}
      key="/school-selection/school-information"
      path="/school-selection/school-information"
      chapter={chapterNames.schoolSelection}/>,
  // Review and Submit route.
  <Route
      component={PlaceholderPage}
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
