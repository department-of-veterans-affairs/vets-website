import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import {
  submitTransform,
  hasPrimaryCaregiver,
  hasSecondaryCaregiverOne,
  hasSecondaryCaregiverTwo,
} from '../utils/helpers';
import { secondaryTwoChapterTitle } from '../definitions/UIDefinitions/caregiverUI';
import { addressWithoutCountryUI } from '../definitions/UIDefinitions/sharedUI';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetHelpFooter from '../components/GetHelp';
import PreSubmitInfo from '../components/PreSubmitInfo';
import SubmissionErrorAlert from '../components/FormAlerts/SubmissionErrorAlert';
import manifest from '../manifest.json';

// veteran pages
import vetInfoPage from './chapters/veteran/vetInfo';
import vetContactInfoPage from './chapters/veteran/vetContactInfo';
import vetMedicalCenterJsonPage from './chapters/veteran/vetMedicalCenter_json';
import vetMedicalCenterAPIPage from './chapters/veteran/vetMedicalCenter_api';

// sign as representative
import signAsRepresentativeYesNo from './chapters/signAsRepresentative/signAsRepresentativeYesNo';
import uploadPOADocument from './chapters/signAsRepresentative/uploadPOADocument';

// primary pages
import hasPrimaryCaregiverPage from './chapters/primary/hasPrimaryCaregiver';
import primaryInfoPage from './chapters/primary/primaryInfo';
import primaryContactInfoPage from './chapters/primary/primaryContactInfo';
import primaryMedicalPage from './chapters/primary/primaryHealthCareCoverage';

// secondary pages
import hasSecondaryCaregiverPage from './chapters/secondaryOne/hasSecondaryCaregiver';
import secondaryOneInfoPage from './chapters/secondaryOne/secondaryOneInfo';
import secondaryOneContactPage from './chapters/secondaryOne/secondaryOneContactInfo';
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
  uuid,
  signature,
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
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  footerContent: FormFooter,
  getHelp: GetHelpFooter,
  preSubmitInfo: PreSubmitInfo,
  confirmation: ConfirmationPage,
  submissionError: SubmissionErrorAlert,
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
    fullName,
    ssn,
    date,
    gender,
    phone,
    address,
    addressWithoutCountryUI,
    email,
    vetRelationship,
    uuid,
    signature,
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
        veteranInfoThreeJSON: {
          path: 'vet-3-json',
          title: 'VA medical center',
          depends: formData => !formData['view:useFacilitiesAPI'],
          uiSchema: vetMedicalCenterJsonPage.uiSchema,
          schema: vetMedicalCenterJsonPage.schema,
        },
        veteranInfoThreeFacilities: {
          path: 'select-facility',
          title: 'VA medical center',
          depends: formData => formData['view:useFacilitiesAPI'],
          uiSchema: vetMedicalCenterAPIPage.uiSchema,
          schema: vetMedicalCenterAPIPage.schema,
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
          uiSchema: secondaryOneInfoPage.uiSchema,
          schema: secondaryOneInfoPage.schema,
        },
        secondaryCaregiverOneThree: {
          path: 'secondary-one-3',
          title: 'Secondary Family Caregiver information',
          depends: formData => hasSecondaryCaregiverOne(formData),
          uiSchema: secondaryOneContactPage.uiSchema,
          schema: secondaryOneContactPage.schema,
        },
      },
    },
    secondaryCaregiversTwoChapter: {
      title: secondaryTwoChapterTitle,
      pages: {
        secondaryCaregiverTwo: {
          path: 'secondary-two-1',
          title: secondaryTwoChapterTitle,
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
    signAsRepresentativeChapter: {
      title: 'Application signature',
      pages: {
        signAsRepresentative: {
          path: 'representative-document',
          title: 'Application signature',
          uiSchema: signAsRepresentativeYesNo.uiSchema,
          schema: signAsRepresentativeYesNo.schema,
        },
        documentUpload: {
          path: 'representative-document-upload',
          title: 'Application signature',
          depends: formData => formData.signAsRepresentativeYesNo === 'yes',
          editModeOnReviewPage: false,
          uiSchema: uploadPOADocument.uiSchema,
          schema: uploadPOADocument.schema,
        },
      },
    },
  },
};

/* TODO Need to change editModeOnReviewPage for document upload to true 
when platform bug is fixed and upload button appears with this feature enabled */

export default formConfig;
