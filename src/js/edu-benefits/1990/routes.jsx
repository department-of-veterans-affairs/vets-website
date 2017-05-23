import { hasServiceBefore1978 } from '../utils/helpers';
import { chapterNames } from '../utils/labels';
import { groupPagesIntoChapters, getPageList } from '../../common/utils/helpers';

import IntroductionPage from './containers/IntroductionPage.jsx';
import VeteranInformationReview from './components/veteran-information/VeteranInformationReview';
import VeteranInformationFields from './components/veteran-information/VeteranInformationFields';
import BenefitsSelectionReview from './components/benefits-eligibility/BenefitsSelectionReview';
import BenefitsSelectionFields from './components/benefits-eligibility/BenefitsSelectionFields';
import BenefitsRelinquishmentReview from './components/benefits-eligibility/BenefitsRelinquishmentReview';
import BenefitsRelinquishmentFields from './components/benefits-eligibility/BenefitsRelinquishmentFields';
import MilitaryServiceReview from './components/military-history/MilitaryServiceReview';
import MilitaryServiceFields from './components/military-history/MilitaryServiceFields';
import ServicePeriodsFields from './components/military-history/ServicePeriodsFields';
import RotcHistoryReview from './components/military-history/RotcHistoryReview';
import RotcHistoryFields from './components/military-history/RotcHistoryFields';
import ContributionsReview from './components/military-history/ContributionsReview';
import ContributionsFields from './components/military-history/ContributionsFields';
import EmploymentHistoryFields from './components/employment-history/EmploymentHistoryFields';
import SchoolSelectionReview from './components/school-selection/SchoolSelectionReview';
import SchoolSelectionFields from './components/school-selection/SchoolSelectionFields';
import EducationHistoryFields from './components/education-history/EducationHistoryFields';
import ContactInformationReview from './components/personal-information/ContactInformationReview';
import ContactInformationFields from './components/personal-information/ContactInformationFields';
import DependentInformationReview from './components/personal-information/DependentInformationReview';
import DependentInformationFields from './components/personal-information/DependentInformationFields';
import SecondaryContactReview from './components/personal-information/SecondaryContactReview';
import SecondaryContactFields from './components/personal-information/SecondaryContactFields';
import DirectDepositReview from './components/personal-information/DirectDepositReview';
import DirectDepositFields from './components/personal-information/DirectDepositFields';
import ReviewPage from './containers/ReviewPage';
import FormPage from './containers/FormPage';
import SubmitPage from './containers/SubmitPage';

const routes = [
  {
    component: IntroductionPage,
    path: 'introduction',
  },
  {
    component: FormPage,
    fieldsComponent: VeteranInformationFields,
    reviewComponent: VeteranInformationReview,
    path: 'veteran-information',
    chapter: chapterNames.veteranInformation,
    name: 'Veteran information',
  },
  {
    component: FormPage,
    fieldsComponent: BenefitsSelectionFields,
    reviewComponent: BenefitsSelectionReview,
    path: 'benefits-eligibility/benefits-selection',
    chapter: chapterNames.benefitsEligibility,
    name: 'Benefits selection',
  },
  {
    component: FormPage,
    fieldsComponent: BenefitsRelinquishmentFields,
    reviewComponent: BenefitsRelinquishmentReview,
    path: 'benefits-eligibility/benefits-relinquishment',
    chapter: chapterNames.benefitsEligibility,
    depends: { chapter33: true },
    name: 'Benefits relinquishment',
  },
  {
    component: FormPage,
    fieldsComponent: ServicePeriodsFields,
    path: 'military-history/service-periods',
    chapter: chapterNames.militaryHistory,
    name: 'Service periods',
  },
  {
    component: FormPage,
    fieldsComponent: MilitaryServiceFields,
    reviewComponent: MilitaryServiceReview,
    path: 'military-history/military-service',
    chapter: chapterNames.militaryHistory,
    name: 'Military service',
  },
  {
    component: FormPage,
    fieldsComponent: RotcHistoryFields,
    reviewComponent: RotcHistoryReview,
    path: 'military-history/rotc-history',
    chapter: chapterNames.militaryHistory,
    name: 'ROTC history',
  },
  {
    component: FormPage,
    fieldsComponent: ContributionsFields,
    reviewComponent: ContributionsReview,
    path: 'military-history/contributions',
    chapter: chapterNames.militaryHistory,
    name: 'Contributions',
  },
  {
    component: FormPage,
    fieldsComponent: EducationHistoryFields,
    path: 'education-history/education-information',
    chapter: chapterNames.educationHistory,
    name: 'Education history',
  },
  {
    component: FormPage,
    fieldsComponent: EmploymentHistoryFields,
    path: 'employment-history/employment-information',
    chapter: chapterNames.employmentHistory,
    name: 'Employment history',
  },
  {
    component: FormPage,
    fieldsComponent: SchoolSelectionFields,
    reviewComponent: SchoolSelectionReview,
    path: 'school-selection/school-information',
    chapter: chapterNames.schoolSelection,
    name: 'School selection',
  },
  {
    component: FormPage,
    fieldsComponent: ContactInformationFields,
    reviewComponent: ContactInformationReview,
    path: 'personal-information/contact-information',
    chapter: chapterNames.personalInformation,
    name: 'Contact information',
  },
  {
    component: FormPage,
    fieldsComponent: SecondaryContactFields,
    reviewComponent: SecondaryContactReview,
    path: 'personal-information/secondary-contact',
    chapter: chapterNames.personalInformation,
    name: 'Secondary contact',
  },
  {
    component: FormPage,
    fieldsComponent: DependentInformationFields,
    reviewComponent: DependentInformationReview,
    path: 'personal-information/dependents',
    chapter: chapterNames.personalInformation,
    depends: hasServiceBefore1978,
    name: 'Dependents',
  },
  {
    component: FormPage,
    fieldsComponent: DirectDepositFields,
    reviewComponent: DirectDepositReview,
    path: 'personal-information/direct-deposit',
    chapter: chapterNames.personalInformation,
    name: 'Direct deposit',
  },
  {
    component: ReviewPage,
    path: 'review-and-submit',
    chapter: chapterNames.review,
  },
  {
    component: SubmitPage,
    path: 'submit-message',
  }
];

export default routes;

// Chapters are groups of form pages that correspond to the steps in the navigation components
export const chapters = groupPagesIntoChapters(routes, '/1990/');
export const pages = getPageList(routes, '/1990/');
