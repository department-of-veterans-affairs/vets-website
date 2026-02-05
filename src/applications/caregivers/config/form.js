import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import {
  hasPrimaryCaregiver,
  hasSecondaryCaregiverOne,
  hasSecondaryCaregiverTwo,
  primaryHasDifferentMailingAddress,
  secondaryOneHasDifferentMailingAddress,
  secondaryTwoHasDifferentMailingAddress,
  showFacilityConfirmation,
} from '../utils/helpers';
import submitTransformer from './submit-transformer';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetHelpFooter from '../components/GetHelp';
import PreSubmitInfo from '../components/PreSubmitInfo';
import SubmissionErrorAlert from '../components/FormAlerts/SubmissionErrorAlert';
import { API_ENDPOINTS } from '../utils/constants';
import { FULL_SCHEMA } from '../utils/imports';
import content from '../locales/en/content.json';
import manifest from '../manifest.json';

//  veteran pages
import vetPersonalInfoPage from './chapters/veteran/personalInformation';
import vetIdentityInfoPage from './chapters/veteran/identityInformation';
import vetHomeAddressPage from './chapters/veteran/homeAddress';
import vetContactInfoPage from './chapters/veteran/contactInformation';
import vetMedicalCenterJsonPage from './chapters/veteran/vaMedicalCenter_json';
import FacilitySearch from '../components/FormFields/FacilitySearch';
import FacilityReview from '../components/FormReview/FacilityReview';

// primary pages
import hasPrimaryPage from './chapters/primary/hasPrimary';
import primaryPersonalInfoPage from './chapters/primary/personalInformation';
import primaryIdentityInfoPage from './chapters/primary/identityInformation';
import primaryHomeAddressPage from './chapters/primary/homeAddress';
import primaryMailingAddressPage from './chapters/primary/mailingAddress';
import primaryContactInfoPage from './chapters/primary/contactInformation';

// secondary pages
import hasSecondaryOnePage from './chapters/secondaryOne/hasSecondary';
import secondaryOnePersonalInfoPage from './chapters/secondaryOne/personalInformation';
import secondaryOneIdentityInfoPage from './chapters/secondaryOne/identityInformation';
import secondaryOneHomeAddressPage from './chapters/secondaryOne/homeAddress';
import secondaryOneMailingAddressPage from './chapters/secondaryOne/mailingAddress';
import secondaryOneContactInfoPage from './chapters/secondaryOne/contactInformation';
import hasSecondaryTwoPage from './chapters/secondaryTwo/hasSecondaryTwo';
import secondaryTwoPersonalInfoPage from './chapters/secondaryTwo/personalInformation';
import secondaryTwoIdentityInfoPage from './chapters/secondaryTwo/identityInformation';
import secondaryTwoHomeAddressPage from './chapters/secondaryTwo/homeAddress';
import secondaryTwoMailingAddressPage from './chapters/secondaryTwo/mailingAddress';
import secondaryTwoContactInfoPage from './chapters/secondaryTwo/contactInformation';
import FacilityConfirmation from '../components/FormPages/FacilityConfirmation';

// sign as representative
import signAsRepresentativeYesNo from './chapters/signAsRepresentative/signAsRepresentativeYesNo';
import documentUpload from './chapters/signAsRepresentative/documentUpload';

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
} = FULL_SCHEMA.definitions;

/* Chapters
 * 1 - Vet/Service Member (required)
 * 2 - Primary Family Caregiver
 * 3 - Secondary & secondaryTwo Family Caregiver
 * (One caregiver is always required, at least one primary, or one secondary - minimal)
 */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: environment.API_URL + API_ENDPOINTS.submission,
  transformForSubmit: submitTransformer,
  trackingPrefix: 'caregivers-10-10cg-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  footerContent: FormFooter,
  getHelp: GetHelpFooter,
  preSubmitInfo: PreSubmitInfo,
  confirmation: ConfirmationPage,
  submissionError: SubmissionErrorAlert,
  formId: VA_FORM_IDS.FORM_10_10CG,
  saveInProgress: {},
  version: 0,
  prefillEnabled: false,
  downtime: {
    dependencies: [externalServices.mvi, externalServices.carma],
  },
  title: content['app-title'],
  subTitle: content['app-subtitle'],
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    gender,
    phone,
    address,
    email,
    vetRelationship,
    uuid,
    signature,
  },
  dev: { disableWindowUnloadInCI: true },
  formOptions: {
    filterInactiveNestedPageData: true,
  },
  chapters: {
    veteranInformation: {
      title: content['vet-info-title--chapter'],
      pages: {
        vetPersonalInformation: {
          path: 'veteran-information/personal-information',
          title: content['vet-info-title--personal'],
          uiSchema: vetPersonalInfoPage.uiSchema,
          schema: vetPersonalInfoPage.schema,
        },
        vetIdentityInformation: {
          path: 'veteran-informaton/identity-information',
          title: content['vet-info-title--id'],
          uiSchema: vetIdentityInfoPage.uiSchema,
          schema: vetIdentityInfoPage.schema,
        },
        vetHomeAddress: {
          path: 'veteran-information/home-address',
          title: content['vet-info-title--address'],
          uiSchema: vetHomeAddressPage.uiSchema,
          schema: vetHomeAddressPage.schema,
        },
        vetContactInformation: {
          path: 'veteran-information/contact-information',
          title: content['vet-info-title--contact'],
          uiSchema: vetContactInfoPage.uiSchema,
          schema: vetContactInfoPage.schema,
        },
        vetMedicalCenterJson: {
          path: 'veteran-information/va-medical-center',
          title: content['vet-info-title--facility'],
          depends: formData => !formData['view:useFacilitiesAPI'],
          uiSchema: vetMedicalCenterJsonPage.uiSchema,
          schema: vetMedicalCenterJsonPage.schema,
        },
        vetMedicalCenterLocator: {
          path: 'veteran-information/va-medical-center/locator',
          title: content['vet-info-title--facility'],
          depends: formData => formData['view:useFacilitiesAPI'],
          CustomPage: FacilitySearch,
          CustomPageReview: FacilityReview,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        vetMedicalCenterConfirmation: {
          path: 'veteran-information/va-medical-center/confirm',
          title: content['vet-info-title--facility'],
          depends: showFacilityConfirmation,
          CustomPage: FacilityConfirmation,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },
    primaryCaregiverInformation: {
      title: content['primary-info-title--chapter'],
      pages: {
        hasPrimaryCaregiver: {
          path: 'primary-caregiver/apply-for-benefits',
          title: content['primary-info-title--apply'],
          uiSchema: hasPrimaryPage.uiSchema,
          schema: hasPrimaryPage.schema,
        },
        primaryPersonalInformation: {
          path: 'primary-caregiver/personal-information',
          title: content['primary-info-title--personal'],
          depends: hasPrimaryCaregiver,
          uiSchema: primaryPersonalInfoPage.uiSchema,
          schema: primaryPersonalInfoPage.schema,
        },
        primaryIdentityInformation: {
          path: 'primary-caregiver/identity-information',
          title: content['primary-info-title--id'],
          depends: hasPrimaryCaregiver,
          uiSchema: primaryIdentityInfoPage.uiSchema,
          schema: primaryIdentityInfoPage.schema,
        },
        primaryHomeAddress: {
          path: 'primary-caregiver/home-address',
          title: content['primary-info-title--address-home'],
          depends: hasPrimaryCaregiver,
          uiSchema: primaryHomeAddressPage.uiSchema,
          schema: primaryHomeAddressPage.schema,
        },
        primaryMailingAddress: {
          path: 'primary-caregiver/mailing-address',
          title: content['primary-info-title--address-mailing'],
          depends: primaryHasDifferentMailingAddress,
          uiSchema: primaryMailingAddressPage.uiSchema,
          schema: primaryMailingAddressPage.schema,
        },
        primaryContactInformation: {
          path: 'primary-caregiver/contact-information',
          title: content['primary-info-title--contact'],
          depends: hasPrimaryCaregiver,
          uiSchema: primaryContactInfoPage.uiSchema,
          schema: primaryContactInfoPage.schema,
        },
      },
    },
    secondaryCaregiverInformation: {
      title: content['secondary-one-info-title--chapter'],
      pages: {
        hasSecondaryOne: {
          path: 'secondary-caregiver/apply-for-benefits',
          title: content['secondary-info-title--apply'],
          uiSchema: hasSecondaryOnePage.uiSchema,
          schema: hasSecondaryOnePage.schema,
        },
        secondaryOnePersonalInformation: {
          path: 'secondary-caregiver/personal-information',
          title: content['secondary-one-info-title--personal'],
          depends: hasSecondaryCaregiverOne,
          uiSchema: secondaryOnePersonalInfoPage.uiSchema,
          schema: secondaryOnePersonalInfoPage.schema,
        },
        secondaryOneIdentityInformation: {
          path: 'secondary-caregiver/identity-information',
          title: content['secondary-one-info-title--id'],
          depends: hasSecondaryCaregiverOne,
          uiSchema: secondaryOneIdentityInfoPage.uiSchema,
          schema: secondaryOneIdentityInfoPage.schema,
        },
        secondaryOneHomeAddress: {
          path: 'secondary-caregiver/home-address',
          title: content['secondary-one-info-title--address-home'],
          depends: hasSecondaryCaregiverOne,
          uiSchema: secondaryOneHomeAddressPage.uiSchema,
          schema: secondaryOneHomeAddressPage.schema,
        },
        secondaryOneMailingAddress: {
          path: 'secondary-caregiver/mailing-address',
          title: content['secondary-one-info-title--address-mailing'],
          depends: secondaryOneHasDifferentMailingAddress,
          uiSchema: secondaryOneMailingAddressPage.uiSchema,
          schema: secondaryOneMailingAddressPage.schema,
        },
        secondaryOneContactInformation: {
          path: 'secondary-caregiver/contact-information',
          title: content['secondary-one-info-title--contact'],
          depends: hasSecondaryCaregiverOne,
          uiSchema: secondaryOneContactInfoPage.uiSchema,
          schema: secondaryOneContactInfoPage.schema,
        },
        hasSecondaryTwo: {
          path: 'secondary-caregiver/add-additional-caregiver',
          title: content['secondary-two-intro-title'],
          depends: hasSecondaryCaregiverOne,
          uiSchema: hasSecondaryTwoPage.uiSchema,
          schema: hasSecondaryTwoPage.schema,
        },
        secondaryTwoPersonalInformation: {
          path: 'additional-secondary-caregiver/personal-information',
          title: content['secondary-two-info-title--personal'],
          depends: hasSecondaryCaregiverTwo,
          uiSchema: secondaryTwoPersonalInfoPage.uiSchema,
          schema: secondaryTwoPersonalInfoPage.schema,
        },
        secondaryTwoIdentityInformation: {
          path: 'additional-secondary-caregiver/identity-information',
          title: content['secondary-two-info-title--id'],
          depends: hasSecondaryCaregiverTwo,
          uiSchema: secondaryTwoIdentityInfoPage.uiSchema,
          schema: secondaryTwoIdentityInfoPage.schema,
        },
        secondaryTwoHomeAddress: {
          path: 'additional-secondary-caregiver/home-address',
          title: content['secondary-two-info-title--address-home'],
          depends: hasSecondaryCaregiverTwo,
          uiSchema: secondaryTwoHomeAddressPage.uiSchema,
          schema: secondaryTwoHomeAddressPage.schema,
        },
        secondaryTwoMailingAddress: {
          path: 'additional-secondary-caregiver/mailing-address',
          title: content['secondary-two-info-title--address-mailing'],
          depends: secondaryTwoHasDifferentMailingAddress,
          uiSchema: secondaryTwoMailingAddressPage.uiSchema,
          schema: secondaryTwoMailingAddressPage.schema,
        },
        secondaryTwoContactInformation: {
          path: 'additional-secondary-caregiver/contact-information',
          title: content['secondary-two-info-title--contact'],
          depends: hasSecondaryCaregiverTwo,
          uiSchema: secondaryTwoContactInfoPage.uiSchema,
          schema: secondaryTwoContactInfoPage.schema,
        },
      },
    },
    signAsRepresentative: {
      title: content['sign-as-rep-title--chapter'],
      pages: {
        signAsRepresentative: {
          path: 'application-signature/next-steps',
          title: content['sign-as-rep-title--chapter'],
          uiSchema: signAsRepresentativeYesNo.uiSchema,
          schema: signAsRepresentativeYesNo.schema,
        },
        documentUpload: {
          path: 'application-signature/upload-supporting-document',
          title: content['sign-as-rep-title--upload'],
          depends: formData => formData.signAsRepresentativeYesNo === 'yes',
          editModeOnReviewPage: false,
          uiSchema: documentUpload.uiSchema,
          schema: documentUpload.schema,
        },
      },
    },
  },
};

export default formConfig;
