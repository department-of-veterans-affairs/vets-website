import React from 'react';
import { Route } from 'react-router';

import { chapterNames, groupPagesIntoChapters, getPageList, hasServiceBefore1978 } from './utils/helpers';

import IntroductionPage from './containers/IntroductionPage.jsx';
import VeteranInformationReview from './components/veteran-information/VeteranInformationReview';
import VeteranInformationFields from './components/veteran-information/VeteranInformationFields';
import BenefitsSelectionReview from './components/benefits-eligibility/BenefitsSelectionReview';
import BenefitsSelectionFields from './components/benefits-eligibility/BenefitsSelectionFields';
import MilitaryServiceReview from './components/military-history/MilitaryServiceReview';
import MilitaryServiceFields from './components/military-history/MilitaryServiceFields';
import RotcHistoryReview from './components/military-history/RotcHistoryReview';
import RotcHistoryFields from './components/military-history/RotcHistoryFields';
import BenefitsHistoryReview from './components/military-history/BenefitsHistoryReview';
import BenefitsHistoryFields from './components/military-history/BenefitsHistoryFields';
import EmploymentHistoryReview from './components/employment-history/EmploymentHistoryReview';
import EmploymentHistoryFields from './components/employment-history/EmploymentHistoryFields';
import SchoolSelectionReview from './components/school-selection/SchoolSelectionReview';
import SchoolSelectionFields from './components/school-selection/SchoolSelectionFields';
import EducationHistoryFields from './components/education-history/EducationHistoryFields';
import EducationHistoryReview from './components/education-history/EducationHistoryReview';
import ContactInformationReview from './components/personal-information/ContactInformationReview';
import ContactInformationFields from './components/personal-information/ContactInformationFields';
import DependentInformationReview from './components/personal-information/DependentInformationReview';
import DependentInformationFields from './components/personal-information/DependentInformationFields';
import SecondaryContactReview from './components/personal-information/SecondaryContactReview';
import SecondaryContactFields from './components/personal-information/SecondaryContactFields';
import DirectDepositReview from './components/personal-information/DirectDepositReview';
import DirectDepositFields from './components/personal-information/DirectDepositFields';
import PreviousClaimsFields from './components/benefits-eligibility/PreviousClaimsFields';
import PreviousClaimsReview from './components/benefits-eligibility/PreviousClaimsReview';
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
      fieldsComponent={VeteranInformationFields}
      reviewComponent={VeteranInformationReview}
      key="/veteran-information"
      path="/veteran-information"
      chapter={chapterNames.veteranInformation}
      name="Veteran Information"/>,
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
      fieldsComponent={PreviousClaimsFields}
      reviewComponent={PreviousClaimsReview}
      key="/benefits-eligibility/previous-claims"
      path="/benefits-eligibility/previous-claims"
      chapter={chapterNames.benefitsEligibility}
      depends={{ previouslyFiledClaimWithVa: { value: 'Y' } }}
      name="Previous Claims"/>,
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
  <Route
      component={FormPage}
      fieldsComponent={ContactInformationFields}
      reviewComponent={ContactInformationReview}
      key="/personal-information/contact-information"
      path="/personal-information/contact-information"
      chapter={chapterNames.personalInformation}
      name="Contact Information"/>,
  <Route
      component={FormPage}
      fieldsComponent={SecondaryContactFields}
      reviewComponent={SecondaryContactReview}
      key="/personal-information/secondary-contact"
      path="/personal-information/secondary-contact"
      chapter={chapterNames.personalInformation}
      name="Secondary Contact"/>,
  <Route
      component={FormPage}
      fieldsComponent={DependentInformationFields}
      reviewComponent={DependentInformationReview}
      key="/personal-information/dependents"
      path="/personal-information/dependents"
      chapter={chapterNames.personalInformation}
      depends={hasServiceBefore1978}
      name="Dependents"/>,
  <Route
      component={FormPage}
      fieldsComponent={DirectDepositFields}
      reviewComponent={DirectDepositReview}
      key="/personal-information/direct-deposit"
      path="/personal-information/direct-deposit"
      chapter={chapterNames.personalInformation}
      name="Direct Deposit"/>,
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
