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
  hasSecondaryTwoPages,
} from 'applications/caregivers/helpers';

import definitions, {
  addressWithoutCountryUI,
} from 'applications/caregivers/definitions/caregiverUI';

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
import hasSecondaryOneCaregiverPage from './chapters/secondaryOne/hasSecondaryOneCaregiver';
import secondaryCaregiverInfoPage from './chapters/secondaryOne/secondaryInfo';
import secondaryCaregiverContactPage from './chapters/secondaryOne/secondaryCaregiverContact';
import hasSecondaryTwoCaregiverPage from './chapters/secondaryTwo/hasSecondaryTwoCaregiver';
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

const { contactInfoTitle } = definitions.sharedItems;
const { secondaryCaregiversUI } = definitions;

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
  version: 0,
  prefillEnabled: false,
  downtime: {
    dependencies: [externalServices.mvi, externalServices.carma],
  },
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your [savedFormDescription] is in progress.',
    //   expired: 'Your saved [savedFormDescription] has expired. If you want to apply for [benefitType], please start a new [appType].',
    //   saved: 'Your [benefitType] [appType] has been saved.',
    // },
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
          title: contactInfoTitle,
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
          uiSchema: primaryInfoPage.uiSchema,
          schema: primaryInfoPage.schema,
          depends: formData => hasPrimaryCaregiver(formData),
        },
        primaryCaregiverInfoThree: {
          path: 'primary-3',
          title: contactInfoTitle,
          uiSchema: primaryContactInfoPage.uiSchema,
          schema: primaryContactInfoPage.schema,
          depends: formData => hasPrimaryCaregiver(formData),
        },
        primaryCaregiverInfoFour: {
          path: 'primary-4',
          title: 'Health care coverage',
          uiSchema: primaryMedicalPage.uiSchema,
          schema: primaryMedicalPage.schema,
          depends: formData => hasPrimaryCaregiver(formData),
        },
      },
    },
    secondaryCaregiversChapter: {
      title: 'Secondary Family Caregiver applicant information',
      pages: {
        secondaryOneCaregiverOne: {
          path: 'secondary-one-1',
          title: 'Secondary Family Caregiver information',
          uiSchema: hasSecondaryOneCaregiverPage.uiSchema,
          schema: hasSecondaryOneCaregiverPage.schema,
        },
        secondaryOneCaregiverTwo: {
          path: 'secondary-one-2',
          title: 'Secondary Family Caregiver information',
          depends: formData => hasSecondaryCaregiverOne(formData),
          uiSchema: secondaryCaregiverInfoPage.uiSchema,
          schema: secondaryCaregiverInfoPage.schema,
        },
        secondaryOneCaregiverOneThree: {
          path: 'secondary-one-3',
          title: 'Secondary Family Caregiver information',
          depends: formData => hasSecondaryCaregiverOne(formData),
          uiSchema: secondaryCaregiverContactPage.uiSchema,
          schema: secondaryCaregiverContactPage.schema,
        },
      },
    },
    secondaryCaregiversTwoChapter: {
      title: secondaryCaregiversUI.secondaryTwoChapterTitle,
      depends: formData => hasSecondaryCaregiverOne(formData),
      pages: {
        secondaryTwoCaregiverOne: {
          path: 'secondary-two-1',
          title: 'Secondary Family Caregiver information',
          depends: formData => hasSecondaryCaregiverTwo(formData),
          uiSchema: hasSecondaryTwoCaregiverPage.uiSchema,
          schema: hasSecondaryTwoCaregiverPage.schema,
        },
        secondaryTwoCaregiverTwo: {
          path: 'secondary-two-2',
          title: 'Secondary Family Caregiver (2) applicant information',
          depends: formData => hasSecondaryTwoPages(formData),
          uiSchema: secondaryTwoInfoPage.uiSchema,
          schema: secondaryTwoInfoPage.schema,
        },
        secondaryTwoCaregiverThree: {
          path: 'secondary-two-3',
          title: secondaryCaregiversUI.secondaryTwoChapterTitle,
          depends: formData => hasSecondaryTwoPages(formData),
          uiSchema: secondaryTwoContactPage.uiSchema,
          schema: secondaryTwoContactPage.schema,
        },
      },
    },
  },
};

export default formConfig;
