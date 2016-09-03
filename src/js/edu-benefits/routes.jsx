import React from 'react';
import { Route } from 'react-router';

import { chapterNames, groupPagesIntoChapters, getPageList } from './utils/helpers';

import IntroductionSection from './containers/IntroductionSection.jsx';
import BenefitsSelection from './containers/BenefitsSelection';
import PersonalInformationPage from './containers/veteran-information/PersonalInformationPage';
import PlaceholderSection from './containers/PlaceholderSection';

const routes = [
  // Introduction route.
  <Route
      component={IntroductionSection}
      key="/introduction"
      path="/introduction"/>,
  <Route
      component={PersonalInformationPage}
      key="/veteran-information/personal-information"
      path="/veteran-information/personal-information"
      chapter={chapterNames.veteranInformation}
      name="Personal Information"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/address"
      path="/veteran-information/address"
      chapter={chapterNames.veteranInformation}
      name="Address"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/contact-information"
      path="/veteran-information/contact-information"
      chapter={chapterNames.veteranInformation}
      name="Contact Information"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/secondary-contact"
      path="/veteran-information/secondary-contact"
      chapter={chapterNames.veteranInformation}
      name="Secondary Contact"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/direct-deposit"
      path="/veteran-information/direct-deposit"
      chapter={chapterNames.veteranInformation}
      name="Direct Deposit"/>,
  <Route
      component={BenefitsSelection}
      key="/benefits-eligibility/benefits-selection"
      path="/benefits-eligibility/benefits-selection"
      chapter={chapterNames.benefitsEligibility}/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/military-service"
      path="/military-history/military-service"
      chapter={chapterNames.militaryHistory}
      name="Military Service"/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/rotc-history"
      path="/military-history/rotc-history"
      chapter={chapterNames.militaryHistory}
      name="ROTC History"/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/benefits-history"
      path="/military-history/benefits-history"
      chapter={chapterNames.militaryHistory}
      name="Benefits History"/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/dependents"
      path="/military-history/dependents"
      chapter={chapterNames.militaryHistory}
      name="Dependents"/>,
  <Route
      component={PlaceholderSection}
      key="/education-history/education-information"
      path="/education-history/education-information"
      chapter={chapterNames.educationHistory}/>,
  <Route
      component={PlaceholderSection}
      key="/employment-history/employment-information"
      path="/employment-history/employment-information"
      chapter={chapterNames.employmentHistory}/>,
  <Route
      component={PlaceholderSection}
      key="/school-selection/school-information"
      path="/school-selection/school-information"
      chapter={chapterNames.schoolSelection}/>,
  // Review and Submit route.
  <Route
      component={PlaceholderSection}
      key="/review-and-submit"
      path="/review-and-submit"
      chapter={chapterNames.review}/>,

  // Submit Message route.
  <Route
      component={PlaceholderSection}
      key="/submit-message"
      path="/submit-message"/>
];

export default routes;

// Chapters are groups of form pages that correspond to the steps in the navigation components
export const chapters = groupPagesIntoChapters(routes);
export const pages = getPageList(routes);
