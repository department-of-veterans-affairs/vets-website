import React from 'react';
import { Route } from 'react-router';

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
      path="/veteran-information/personal-information"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/address"
      path="/veteran-information/address"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/contact-information"
      path="/veteran-information/contact-information"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/secondary-contact"
      path="/veteran-information/secondary-contact"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/dependent-information"
      path="/veteran-information/dependent-information"/>,
  <Route
      component={PlaceholderSection}
      key="/veteran-information/direct-deposit"
      path="/veteran-information/direct-deposit"/>,
  <Route
      component={BenefitsSelection}
      key="/benefits-eligibility/benefits-selection"
      path="/benefits-eligibility/benefits-selection"/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/military-service"
      path="/military-history/military-service"/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/additional-information"
      path="/military-history/additional-information"/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/rotc-history"
      path="/military-history/rotc-history"/>,
  <Route
      component={PlaceholderSection}
      key="/military-history/benefits-history"
      path="/military-history/benefits-history"/>,
  <Route
      component={PlaceholderSection}
      key="/education-history/education-information"
      path="/education-history/education-information"/>,
  <Route
      component={PlaceholderSection}
      key="/education-history/additional-information"
      path="/education-history/additional-information"/>,
  <Route
      component={PlaceholderSection}
      key="/employment-history/employment-information"
      path="/employment-history/employment-information"/>,
  <Route
      component={PlaceholderSection}
      key="/school-selection/school-information"
      path="/school-selection/school-information"/>,
  // Review and Submit route.
  <Route
      component={PlaceholderSection}
      key="/review-and-submit"
      path="/review-and-submit"/>,

  // Submit Message route.
  <Route
      component={PlaceholderSection}
      key="/submit-message"
      path="/submit-message"/>
];

export default routes;
