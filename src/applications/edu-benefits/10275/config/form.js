import footerContent from 'platform/forms/components/FormFooter';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';
import submitForm from './submitForm';
import transform from './submit-transformer';
import { TITLE, SUBTITLE, SUBMIT_URL } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PrivacyPolicy from '../components/PrivacyPolicy';
import {
  agreementType,
  authorizingOfficial,
  poeCommitment,
  newAuthorizingOfficial,
  newPrinciplesOfExcellence,
  newSchoolCertifyingOfficial,
  institutionDetailsFacility,
  additionalLocationSummary,
  pointOfContactForThisLocation,
  addMoreLocations,
  previouslyEnteredPointOfContact,
  additionalInstitutionDetailsItem,
} from '../pages';

const scrollAndFocusTarget = () => {
  scrollToTop('topScrollElement');
  focusElement('h3');
};
/**
 * Returns *true* if the newCommitment -
 * Principles of Excellence point of contact page should be displayed
 * @param {*} data form data
 * @returns {boolean}
 */
const canDisplayNewPOC = data =>
  data?.agreementType === 'newCommitment' &&
  data?.authorizedOfficial?.['view:isPOC'] === false;

/**
 * Returns *true* if the newCommitment -
 * School certifying official page should be displayed
 * @param {*} data form data
 * @returns {boolean}
 */
const canDisplayNewSCO = data =>
  data?.agreementType === 'newCommitment' &&
  data?.authorizedOfficial?.['view:isSCO'] === false &&
  !data?.newCommitment?.principlesOfExcellencePointOfContact?.['view:isSCO'];

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: submitForm,
  trackingPrefix: 'edu-10275-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10275,
  saveInProgress: {
    messages: {
      inProgress: 'Your form (22-10275) is in progress.',
      expired:
        'Your saved form (22-10275) has expired. Please start a new form.',
      saved: 'Your form has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  preSubmitInfo: {
    statementOfTruth: {
      heading: 'Certification statement',
      body: PrivacyPolicy,
      messageAriaDescribedby: 'I have read and accept the privacy policy.',
      fullNamePath: 'authorizedOfficial.fullName',
    },
  },
  savedFormMessages: {
    notFound: 'Please start over.',
    noAuth: 'Please sign in again to continue your form.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  customText: {
    appType: 'form',
    continueAppButtonText: 'Continue your form',
    startNewAppButtonText: 'Start a new form',
    finishAppLaterMessage: 'Finish this form later',
    appSavedSuccessfullyMessage: 'We’ve saved your form.',
    submitButtonText: 'Continue',
  },
  defaultDefinitions: {},
  transformForSubmit: transform,
  chapters: {
    agreementTypeChapter: {
      title: 'Agreement type',
      pages: {
        agreementType: {
          path: 'agreement-type',
          title: 'Agreement type',
          uiSchema: agreementType.uiSchema,
          schema: agreementType.schema,
          onContinue: (data, setFormData) => {
            const hasCode = !!data?.institutionDetails?.facilityCode?.trim();
            if (hasCode) {
              setFormData({
                ...data,
                institutionDetails: {
                  ...data.institutionDetails,
                  facilityCode: '',
                  institutionName: undefined,
                  institutionAddress: {},
                  poeEligible: undefined,
                },
              });
            }
          },
        },
      },
    },
    newCommitmentChapter: {
      title: 'Institution details',
      pages: {
        institutionDetailsFacilityNew: {
          path: 'new-commitment-institution-details',
          title: 'Institution details',
          depends: data => data?.agreementType === 'newCommitment',
          uiSchema: institutionDetailsFacility.uiSchema,
          schema: institutionDetailsFacility.schema,
        },
      },
    },
    associatedOfficialsChapter: {
      title: 'Associated officials',
      pages: {
        authorizedOfficialNew: {
          path: 'new-commitment-authorizing-official',
          title: 'Your information',
          depends: data => data?.agreementType === 'newCommitment',
          uiSchema: newAuthorizingOfficial.uiSchema,
          schema: newAuthorizingOfficial.schema,
          updateFormData: newAuthorizingOfficial.updateFormData,
        },
        principlesOfExcellenceNew: {
          path: 'new-commitment-principles-of-excellence',
          title: 'Principles of Excellence point of contact',
          depends: data => canDisplayNewPOC(data),
          uiSchema: newPrinciplesOfExcellence.uiSchema,
          schema: newPrinciplesOfExcellence.schema,
          updateFormData: newPrinciplesOfExcellence.updateFormData,
        },
        schoolCertifyingOfficialNew: {
          path: 'new-commitment-school-certifying-official',
          title: 'School certifying official',
          depends: data => canDisplayNewSCO(data),
          uiSchema: newSchoolCertifyingOfficial.uiSchema,
          schema: newSchoolCertifyingOfficial.schema,
        },
      },
    },
    withdrawalChapter: {
      title: 'Institution details',
      pages: {
        institutionDetailsFacilityWithdrawal: {
          path: 'withdrawal-institution-details',
          title: 'Institution details',
          depends: data => data?.agreementType === 'withdrawal',
          uiSchema: institutionDetailsFacility.uiSchema,
          schema: institutionDetailsFacility.schema,
        },
      },
    },
    additionalLocationsChapter: {
      title: 'Additional locations',
      pages: {
        ...arrayBuilderPages(
          {
            arrayPath: 'additionalLocations',
            nounSingular: 'location',
            nounPlural: 'locations',
            required: false,
          },
          pageBuilder => ({
            additionalLocationSummary: pageBuilder.summaryPage({
              title: 'Additional locations',
              path: 'additional-locations',
              uiSchema: additionalLocationSummary.uiSchema,
              schema: additionalLocationSummary.schema,
              scrollAndFocusTarget,
            }),
            additionalLocation: pageBuilder.itemPage({
              title: 'Additional location',
              path: 'additional-locations/:index',
              showPagePerItem: true,
              uiSchema: additionalInstitutionDetailsItem.uiSchema,
              schema: additionalInstitutionDetailsItem.schema,
            }),
            pointOfContactForThisLocation: pageBuilder.itemPage({
              title: 'Point of contact for this location',
              path: 'additional-locations/:index/point-of-contact',
              uiSchema: previouslyEnteredPointOfContact.uiSchema,
              schema: previouslyEnteredPointOfContact.schema,
            }),
          }),
        ),
      },
    },
    principlesOfExcellenceCommitmentChapter: {
      title: 'The Principles of Excellence',
      pages: {
        poeCommitment: {
          path: 'principles-of-excellence',
          title: 'The Principles of Excellence',
          depends: data => data?.agreementType === 'newCommitment',
          uiSchema: poeCommitment.uiSchema,
          schema: poeCommitment.schema,
        },
      },
    },
    authorizedOfficialChapter: {
      title: 'Authorizing official',
      pages: {
        authorizedOfficial: {
          path: 'authorizing-official',
          title: 'Authorizing official',
          depends: data => {
            console.log('data', data);
            return data?.agreementType === 'withdrawal';
          },
          uiSchema: authorizingOfficial.uiSchema,
          schema: authorizingOfficial.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
