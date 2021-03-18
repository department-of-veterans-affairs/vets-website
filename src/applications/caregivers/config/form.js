import ConfirmationPage from 'applications/caregivers/containers/ConfirmationPage';
import environment from 'platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import IntroductionPage from 'applications/caregivers/containers/IntroductionPage';
import NeedHelpFooter from 'applications/caregivers/components/NeedHelpFooter';
import PreSubmitInfo from 'applications/caregivers/components/PreSubmitInfo';
import SubmitError from 'applications/caregivers/components/SubmitError';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

import {
  submitTransform,
  hasPrimaryCaregiver,
  hasSecondaryCaregiverOne,
  hasSecondaryCaregiverTwo,
} from 'applications/caregivers/helpers';

import { secondaryTwoChapterTitle } from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';

import { addressWithoutCountryUI } from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

import manifest from '../manifest.json';

// veteran pages
import vetInfoPage from './chapters/veteran/vetInfo';
import vetContactInfoPage from './chapters/veteran/vetContactInfo';
import vetMedicalCenterPage from './chapters/veteran/vetMedicalCenter';

// primary pages
import hasPrimaryCaregiverPage from './chapters/primary/hasPrimaryCaregiver';
import primaryInfoPage from './chapters/primary/primaryInfo';
import primaryContactInfoPage from './chapters/primary/primaryContact';
import primaryMedicalPage from './chapters/primary/primaryHealthCoverage';

// secondary pages
import hasSecondaryCaregiverPage from './chapters/secondaryOne/hasSecondaryCaregiver';
import secondaryCaregiverInfoPage from './chapters/secondaryOne/secondaryInfo';
import secondaryCaregiverContactPage from './chapters/secondaryOne/secondaryCaregiverContact';
import secondaryTwoInfoPage from './chapters/secondaryTwo/secondaryTwoInfo';
import secondaryTwoContactPage from './chapters/secondaryTwo/secondaryTwoContactInfo';

const {
  address,
  date,
  email,
  phone,
  gender,
  vetRelationship,
  ssn,
  fullName,
} = fullSchema.definitions;

/* Chapters
 * 1 - Vet/Service Member (required)
 * 2 - Primary Family Caregiver
 * 3 - Secondary & secondaryTwo Family Caregiver
 * (One caregiver is always required, at least one primary, or one secondary - minimal)
 */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/caregivers_assistance_claims`,
  transformForSubmit: submitTransform,
  trackingPrefix: 'caregivers-10-10cg-',
  introduction: IntroductionPage,
  footerContent: FormFooter,
  getHelp: NeedHelpFooter,
  preSubmitInfo: PreSubmitInfo,
  confirmation: ConfirmationPage,
  submissionError: SubmitError,
  formId: VA_FORM_IDS.FORM_10_10CG,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your [savedFormDescription] is in progress.',
    //   expired: 'Your saved [savedFormDescription] has expired. If you want to apply for [benefitType], please start a new [appType].',
    //   saved: 'Your [benefitType] [appType] has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: false,
  downtime: {
    dependencies: [externalServices.mvi, externalServices.carma],
  },
  title:
    'Apply for the Program of Comprehensive Assistance for Family Caregivers',
  subTitle: 'Form 10-10CG',
  defaultDefinitions: {
    address,
    addressWithoutCountryUI,
    date,
    email,
    fullName,
    gender,
    phone,
    ssn,
    vetRelationship,
  },
  chapters: {
    veteranChapter: {
      title: 'Veteran information',
      pages: {
        veteranInfoOne: {
          path: 'vet-1',
          title: 'Veteran information',
          uiSchema: vetInfoPage.uiSchema,
          schema: vetInfoPage.schema,
        },
        veteranInfoTwo: {
          path: 'vet-2',
          title: 'Contact information',
          uiSchema: vetContactInfoPage.uiSchema,
          schema: vetContactInfoPage.schema,
        },
        veteranInfoThree: {
          path: 'vet-3',
          title: 'VA medical center',
          uiSchema: vetMedicalCenterPage.uiSchema,
          schema: vetMedicalCenterPage.schema,
        },
      },
    },
    primaryCaregiverChapter: {
      title: 'Primary Family Caregiver applicant information',
      pages: {
        primaryCaregiverInfoOne: {
          path: 'primary-1',
          title: 'Primary Family Caregiver information',
          uiSchema: hasPrimaryCaregiverPage.uiSchema,
          schema: hasPrimaryCaregiverPage.schema,
        },
        primaryCaregiverInfoTwo: {
          path: 'primary-2',
          title: 'Primary Family Caregiver information',
          depends: formData => hasPrimaryCaregiver(formData),
          uiSchema: primaryInfoPage.uiSchema,
          schema: primaryInfoPage.schema,
        },
        primaryCaregiverInfoThree: {
          path: 'primary-3',
          title: 'Contact information',
          depends: formData => hasPrimaryCaregiver(formData),
          uiSchema: primaryContactInfoPage.uiSchema,
          schema: primaryContactInfoPage.schema,
        },
        primaryCaregiverInfoFour: {
          path: 'primary-4',
          title: 'Health care coverage',
          depends: formData => hasPrimaryCaregiver(formData),
          uiSchema: primaryMedicalPage.uiSchema,
          schema: primaryMedicalPage.schema,
        },
      },
    },
    secondaryCaregiversChapter: {
      title: 'Secondary Family Caregiver applicant information',
      pages: {
        secondaryCaregiverOneIntro: {
          path: 'secondary-one-1',
          title: 'Secondary Family Caregiver information',
          uiSchema: hasSecondaryCaregiverPage.uiSchema,
          schema: hasSecondaryCaregiverPage.schema,
        },
        secondaryCaregiverOne: {
          path: 'secondary-one-2',
          title: 'Secondary Family Caregiver information',
          depends: formData => hasSecondaryCaregiverOne(formData),
          uiSchema: secondaryCaregiverInfoPage.uiSchema,
          schema: secondaryCaregiverInfoPage.schema,
        },
        secondaryCaregiverOneThree: {
          path: 'secondary-one-3',
          title: 'Secondary Family Caregiver information',
          depends: formData => hasSecondaryCaregiverOne(formData),
          uiSchema: secondaryCaregiverContactPage.uiSchema,
          schema: secondaryCaregiverContactPage.schema,
        },
      },
    },
    secondaryCaregiversTwoChapter: {
      title: secondaryTwoChapterTitle,
      depends: formData => hasSecondaryCaregiverTwo(formData),
      pages: {
        secondaryCaregiverTwo: {
          path: 'secondary-two-1',
          title: 'Secondary Family Caregiver (2) applicant information',
          depends: formData => hasSecondaryCaregiverTwo(formData),
          uiSchema: secondaryTwoInfoPage.uiSchema,
          schema: secondaryTwoInfoPage.schema,
        },
        secondaryCaregiverTwoTwo: {
          path: 'secondary-two-2',
          title: secondaryTwoChapterTitle,
          depends: formData => hasSecondaryCaregiverTwo(formData),
          uiSchema: secondaryTwoContactPage.uiSchema,
          schema: secondaryTwoContactPage.schema,
        },
      },
    },
  },
};

export default formConfig;
