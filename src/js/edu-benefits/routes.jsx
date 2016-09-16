import React from 'react';
import { Route } from 'react-router';

import { chapterNames, groupPagesIntoChapters, getPageList } from './utils/helpers';

import IntroductionPage from './containers/IntroductionPage.jsx';
import PersonalInformationReview from './components/veteran-information/PersonalInformationReview';
import PersonalInformationFields from './components/veteran-information/PersonalInformationFields';
import ContactInformationReview from './components/veteran-information/ContactInformationReview';
import ContactInformationFields from './components/veteran-information/ContactInformationFields';
import SecondaryContactReview from './components/veteran-information/SecondaryContactReview';
import SecondaryContactFields from './components/veteran-information/SecondaryContactFields';
import DirectDepositReview from './components/veteran-information/DirectDepositReview';
import DirectDepositFields from './components/veteran-information/DirectDepositFields';
import BenefitsSelectionReview from './components/benefits-eligibility/BenefitsSelectionReview';
import BenefitsSelectionFields from './components/benefits-eligibility/BenefitsSelectionFields';
import MilitaryServiceReview from './components/military-history/MilitaryServiceReview';
import MilitaryServiceFields from './components/military-history/MilitaryServiceFields';
import RotcHistoryReview from './components/military-history/RotcHistoryReview';
import RotcHistoryFields from './components/military-history/RotcHistoryFields';
import BenefitsHistoryReview from './components/military-history/BenefitsHistoryReview';
import BenefitsHistoryFields from './components/military-history/BenefitsHistoryFields';
import DependentInformationReview from './components/military-history/DependentInformationReview';
import DependentInformationFields from './components/military-history/DependentInformationFields';
import EmploymentHistoryReview from './components/employment-history/EmploymentHistoryReview';
import EmploymentHistoryFields from './components/employment-history/EmploymentHistoryFields';
import SchoolSelectionReview from './components/school-selection/SchoolSelectionReview';
import SchoolSelectionFields from './components/school-selection/SchoolSelectionFields';
import EducationHistoryFields from './components/education-history/EducationHistoryFields';
import EducationHistoryReview from './components/education-history/EducationHistoryReview';
import ReviewPage from './containers/ReviewPage';
import FormPage from './containers/FormPage';
import PlaceholderPage from './containers/PlaceholderPage';

const routes = [
  // Introduction route.
  <Route
      component={IntroductionPage}
      key="/introduction"
      path="/introduction"/>,
  <Route
      component={FormPage}
      fieldsComponent={PersonalInformationFields}
      reviewComponent={PersonalInformationReview}
      key="/veteran-information/personal-information"
      path="/veteran-information/personal-information"
      chapter={chapterNames.veteranInformation}
      name="Personal Information"/>,
  <Route
      component={FormPage}
      fieldsComponent={ContactInformationFields}
      reviewComponent={ContactInformationReview}
      key="/veteran-information/contact-information"
      path="/veteran-information/contact-information"
      chapter={chapterNames.veteranInformation}
      name="Contact Information"/>,
  <Route
      component={FormPage}
      fieldsComponent={SecondaryContactFields}
      reviewComponent={SecondaryContactReview}
      key="/veteran-information/secondary-contact"
      path="/veteran-information/secondary-contact"
      chapter={chapterNames.veteranInformation}
      name="Secondary Contact"/>,
  <Route
      component={FormPage}
      fieldsComponent={DirectDepositFields}
      reviewComponent={DirectDepositReview}
      key="/veteran-information/direct-deposit"
      path="/veteran-information/direct-deposit"
      chapter={chapterNames.veteranInformation}
      name="Direct Deposit"/>,
  <Route
      component={FormPage}
      fieldsComponent={BenefitsSelectionFields}
      reviewComponent={BenefitsSelectionReview}
      key="/benefits-eligibility/benefits-selection"
      path="/benefits-eligibility/benefits-selection"
      chapter={chapterNames.benefitsEligibility}
      name="Benefits Selection"/>,
  <Route
      component={FormPage}
      fieldsComponent={MilitaryServiceFields}
      reviewComponent={MilitaryServiceReview}
      key="/military-history/military-service"
      path="/military-history/military-service"
      chapter={chapterNames.militaryHistory}
      name="Military Service"/>,
  <Route
      component={FormPage}
      fieldsComponent={RotcHistoryFields}
      reviewComponent={RotcHistoryReview}
      key="/military-history/rotc-history"
      path="/military-history/rotc-history"
      depends={{ seniorRotcCommissioned: { value: 'Y' } }}
      chapter={chapterNames.militaryHistory}
      name="ROTC History"/>,
  <Route
      component={FormPage}
      fieldsComponent={BenefitsHistoryFields}
      reviewComponent={BenefitsHistoryReview}
      key="/military-history/benefits-history"
      path="/military-history/benefits-history"
      chapter={chapterNames.militaryHistory}
      name="Benefits History"/>,
  <Route
      component={FormPage}
      fieldsComponent={DependentInformationFields}
      reviewComponent={DependentInformationReview}
      key="/military-history/dependents"
      path="/military-history/dependents"
      chapter={chapterNames.militaryHistory}
      name="Dependents"/>,
  <Route
      component={FormPage}
      fieldsComponent={EducationHistoryFields}
      reviewComponent={EducationHistoryReview}
      key="/education-history/education-information"
      path="/education-history/education-information"
      chapter={chapterNames.educationHistory}
      name="Education History"/>,
  <Route
      component={FormPage}
      fieldsComponent={EmploymentHistoryFields}
      reviewComponent={EmploymentHistoryReview}
      key="/employment-history/employment-information"
      path="/employment-history/employment-information"
      chapter={chapterNames.employmentHistory}
      name="Employment History"/>,
  <Route
      component={FormPage}
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
