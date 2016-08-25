import React from 'react';
import { Route } from 'react-router';

function PlaceholderComponent({ location }) {
  return <div>{location.pathname}</div>;
}

const routes = [
  // Introduction route.
  <Route
      component={PlaceholderComponent}
      key="/introduction"
      path="/introduction"/>,
  <Route
      component={PlaceholderComponent}
      key="/benefits-eligibility/benefits-selection"
      path="/benefits-eligibility/benefits-selection"/>,
  <Route
      component={PlaceholderComponent}
      key="/military-history/military-service"
      path="/military-history/military-service"/>,
  <Route
      component={PlaceholderComponent}
      key="/military-history/additional-information"
      path="/military-history/additional-information"/>,
  <Route
      component={PlaceholderComponent}
      key="/military-history/rotc-history"
      path="/military-history/rotc-history"/>,
  <Route
      component={PlaceholderComponent}
      key="/military-history/benefits-history"
      path="/military-history/benefits-history"/>,
  <Route
      component={PlaceholderComponent}
      key="/education-history/education-information"
      path="/education-history/education-information"/>,
  <Route
      component={PlaceholderComponent}
      key="/education-history/additional-information"
      path="/education-history/additional-information"/>,
  <Route
      component={PlaceholderComponent}
      key="/employment-history/employment-information"
      path="/employment-history/employment-information"/>,
  <Route
      component={PlaceholderComponent}
      key="/school-selection/school-information"
      path="/school-selection/school-information"/>,
  <Route
      component={PlaceholderComponent}
      key="/veteran-information/personal-information"
      path="/veteran-information/personal-information"/>,
  <Route
      component={PlaceholderComponent}
      key="/veteran-information/address"
      path="/veteran-information/address"/>,
  <Route
      component={PlaceholderComponent}
      key="/veteran-information/contact-information"
      path="/veteran-information/contact-information"/>,
  <Route
      component={PlaceholderComponent}
      key="/veteran-information/secondary-contact"
      path="/veteran-information/secondary-contact"/>,
  <Route
      component={PlaceholderComponent}
      key="/veteran-information/dependent-information"
      path="/veteran-information/dependent-information"/>,
  <Route
      component={PlaceholderComponent}
      key="/veteran-information/direct-deposit"
      path="/veteran-information/direct-deposit"/>,
  // Review and Submit route.
  <Route
      component={PlaceholderComponent}
      key="/review-and-submit"
      path="/review-and-submit"/>,

  // Submit Message route.
  <Route
      component={PlaceholderComponent}
      key="/submit-message"
      path="/submit-message"/>
];

export default routes;
