import React from 'react';
import { Route } from 'react-router';

import chapters from './utils/chapters';
import IntroductionSection from './containers/IntroductionSection.jsx';

import BenefitsSelection from './containers/BenefitsSelection';
import PlaceholderSection from './containers/PlaceholderSection';

const routes = [
  // Introduction route.
  <Route
      component={IntroductionSection}
      key="/introduction"
      path="/introduction"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/personal-information"
      path="/veteran-information/personal-information"
      chapter={chapters.veteranInformation}
      name="Personal Information"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/address"
      path="/veteran-information/address"
      chapter={chapters.veteranInformation}
      name="Address"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/contact-information"
      path="/veteran-information/contact-information"
      chapter={chapters.veteranInformation}
      name="Contact Information"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/secondary-contact"
      path="/veteran-information/secondary-contact"
      chapter={chapters.veteranInformation}
      name="Secondary Contact"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/direct-deposit"
      path="/veteran-information/direct-deposit"
      chapter={chapters.veteranInformation}
      name="Direct Deposit"/>,
  <Route
      component={BenefitsSelection}
      key="/benefits-eligibility/benefits-selection"
      path="/benefits-eligibility/benefits-selection"
      chapter={chapters.benefitsEligibility}/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/military-service"
      path="/military-history/military-service"
      chapter={chapters.militaryHistory}
      name="Military Service"/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/rotc-history"
      path="/military-history/rotc-history"
      chapter={chapters.militaryHistory}
      name="ROTC History"/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/benefits-history"
      path="/military-history/benefits-history"
      chapter={chapters.militaryHistory}
      name="Benefits History"/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/dependents"
      path="/military-history/dependents"
      chapter={chapters.militaryHistory}
      name="Dependents"/>,
  <Route
      component={PlaceholderSection}
      key="/education-history/education-information"
      path="/education-history/education-information"
      chapter={chapters.educationHistory}/>,
  <Route
      component={PlaceholderSection}
      key="/employment-history/employment-information"
      path="/employment-history/employment-information"
      chapter={chapters.employmentHistory}/>,
  <Route
      component={PlaceholderSection}
      key="/school-selection/school-information"
      path="/school-selection/school-information"
      chapter={chapters.schoolSelection}/>,
  // Review and Submit route.
  <Route
      component={PlaceholderSection}
      key="/review-and-submit"
      path="/review-and-submit"
      chapter={chapters.review}/>,

  // Submit Message route.
  <Route
      component={PlaceholderSection}
      key="/submit-message"
      path="/submit-message"/>
];

export default routes;
