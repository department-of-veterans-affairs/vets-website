import merge from 'lodash/merge';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
// import set from '@department-of-veterans-affairs/platform-forms-system/set';
// import { createSelector } from 'reselect';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';

// import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import GetFormHelp from 'platform/forms/components/GetPensionOrBurialFormHelp';
import FormFooter from 'platform/forms/components/FormFooter';
// import fullNameUI from 'platform/forms/definitions/fullName';
import environment from 'platform/utilities/environment';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import { VA_FORM_IDS } from 'platform/forms/constants';

// import * as address from 'platform/forms/definitions/address';
// import FullNameField from 'platform/forms-system/src/js/fields/FullNameField';
// import phoneUI from 'platform/forms-system/src/js/definitions/phone';
// import emailUI from 'platform/forms-system/src/js/definitions/email';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import ErrorText from '../components/ErrorText';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// import ServicePeriodView from 'platform/forms/components/ServicePeriodView';

// import { validateCentralMailPostalCode } from '../utils/validation';

import personalInformation from './chapters/01-claimant-information/personalInformation';
import relationshipToVeteran from './chapters/01-claimant-information/relationshipToVeteran';
import mailingAddress from './chapters/01-claimant-information/mailingAddress';
import contactInformation from './chapters/01-claimant-information/contactInformation';
import veteranInformation from './chapters/02-veteran-information/veteranInformation';
import burialInformation from './chapters/02-veteran-information/burialInformation';
import locationOfDeath from './chapters/02-veteran-information/locationOfDeath';
import separationDocuments from './chapters/03-military-history/separationDocuments';
import uploadDD214 from './chapters/03-military-history/uploadDD214';
import servicePeriods from './chapters/03-military-history/servicePeriods';
import previousNamesQuestion from './chapters/03-military-history/previousNamesQuestion';
import previousNames from './chapters/03-military-history/previousNames';
import benefitsSelection from './chapters/04-benefits-selection/benefitsSelection';
import burialAllowance from './chapters/04-benefits-selection/burialAllowance';

import {
  // isEligibleNonService,
  // BurialDateWarning,
  fileHelp,
  // transportationWarning,
  // serviceRecordNotification,
  serviceRecordWarning,
  submit,
  // generateTitle,
  // generateTitle,
  // generateHelpText,
} from '../utils/helpers';
// import { allowanceLabels } from '../utils/labels';
import migrations from '../utils/migrations';

import manifest from '../manifest.json';

const {
  // claimantEmail,
  // claimantPhone,
  placeOfRemains,
  federalCemetery,
  stateCemetery,
  govtContributions,
  amountGovtContribution,
  // burialAllowanceRequested,
  // burialCost,
  // previouslyReceivedAllowance,
  // benefitsUnclaimedRemains,
  // burialAllowance,
  // plotAllowance,
  // transportation,
  // amountIncurred,
  // previousNames,
} = fullSchemaBurials.properties;

const {
  fullName,
  centralMailVaFile,
  ssn,
  date,
  usaPhone,
  files,
  dateRange,
} = fullSchemaBurials.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit,
  trackingPrefix: 'burials-530-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  v3InProgressMessage: true,
  formId: VA_FORM_IDS.FORM_21P_530,
  saveInProgress: {
    messages: {
      inProgress: 'Your burial benefits application (21-530) is in progress.',
      expired:
        'Your saved burial benefits application (21-530) has expired. If you want to apply for burial benefits, please start a new application.',
      saved: 'Your burial benefits application has been saved.',
    },
  },
  version: 2,
  migrations,
  prefillEnabled: true,
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for burial benefits.',
    noAuth:
      'Please sign in again to resume your application for burial benefits.',
  },
  title: 'Apply for burial benefits',
  subTitle: 'Form 21P-530',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    fullName,
    centralMailVaFile,
    ssn,
    date,
    usaPhone,
    dateRange,
  },
  chapters: {
    claimantInformation: {
      title: 'Your Information',
      pages: {
        personalInformation: {
          title: 'Your information',
          path: 'claimant-information/personal-information',
          uiSchema: personalInformation.uiSchema,
          schema: personalInformation.schema,
        },
        relationshipToVeteran: {
          title: 'Your information',
          path: 'claimant-information/relationship-to-veteran',
          uiSchema: relationshipToVeteran.uiSchema,
          schema: relationshipToVeteran.schema,
        },
        mailingAddress: {
          title: 'Your information',
          path: 'claimant-information/mailing-address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        contactInformation: {
          title: 'Your information',
          path: 'claimant-information/contact-information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
      },
    },
    veteranInformation: {
      title: 'Deceased Veteran information',
      pages: {
        veteranInformation: {
          title: 'Deceased Veteran information',
          path: 'veteran-information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        burialInformation: {
          title: 'Burial dates',
          path: 'veteran-information/burial',
          uiSchema: burialInformation.uiSchema,
          schema: burialInformation.schema,
        },
        locationOfDeath: {
          title: 'Veteran death location',
          path: 'veteran-information/location-of-death',
          uiSchema: locationOfDeath.uiSchema,
          schema: locationOfDeath.schema,
        },
      },
    },
    militaryHistory: {
      title: 'Military history',
      pages: {
        separationDocuments: {
          title: 'Separation Documents',
          path: 'military-history/separation-documents',
          uiSchema: separationDocuments.uiSchema,
          schema: separationDocuments.schema,
        },
        uploadDD214: {
          title: 'Separation Documents',
          path: 'military-history/separation-documents/upload',
          depends: formData => formData['view:separationDocuments'],
          uiSchema: uploadDD214.uiSchema,
          schema: uploadDD214.schema,
        },
        servicePeriods: {
          title: 'Service periods',
          path: 'military-history/service-periods',
          depends: formData => !formData['view:separationDocuments'],
          uiSchema: servicePeriods.uiSchema,
          schema: servicePeriods.schema,
        },
        previousNamesQuestion: {
          title: 'Previous names',
          path: 'military-history/previous-names',
          uiSchema: previousNamesQuestion.uiSchema,
          schema: previousNamesQuestion.schema,
        },
        previousNames: {
          title: 'Previous names',
          path: 'military-history/previous-names/add',
          depends: formData => formData['view:servedUnderOtherNames'],
          uiSchema: previousNames.uiSchema,
          schema: previousNames.schema,
        },
      },
    },
    benefitsSelection: {
      title: 'Benefits selection',
      pages: {
        benefitsSelection: {
          title: 'Benefits selection',
          path: 'benefits/selection',
          uiSchema: benefitsSelection.uiSchema,
          schema: benefitsSelection.schema,
        },
        burialAllowance: {
          title: 'Burial allowance',
          path: 'benefits/burial-allowance',
          depends: form =>
            get('view:claimedBenefits.burialAllowance', form) === true,
          uiSchema: burialAllowance.uiSchema,
          schema: burialAllowance.schema,
          // uiSchema: {
          //   'ui:title': generateTitle('Type of burial allowance'),
          //   burialAllowanceRequested: {
          //     'ui:title': 'Type of burial allowance requested',
          //     'ui:widget': 'radio',
          //     'ui:options': {
          //       labels: allowanceLabels,
          //       updateSchema: (() => {
          //         const burialAllowanceTypes = burialAllowanceRequested.enum;
          //         const filterAllowanceType = createSelector(
          //           form => get('locationOfDeath.location', form),
          //           locationData => {
          //             let allowanceTypes = burialAllowanceTypes;
          //             if (
          //               locationData !== 'vaMedicalCenter' &&
          //               locationData !== 'nursingHome'
          //             ) {
          //               allowanceTypes = allowanceTypes.filter(
          //                 type => type !== 'vaMC',
          //               );
          //             }
          //             return { enum: allowanceTypes };
          //           },
          //         );
          //         return form => filterAllowanceType(form);
          //       })(),
          //     },
          //   },
          //   'view:nonServiceWarning': {
          //     'ui:description': BurialDateWarning,
          //     'ui:options': {
          //       hideIf: formData => {
          //         if (
          //           !formData.burialAllowanceRequested ||
          //           isEligibleNonService(formData.burialDate)
          //         ) {
          //           return true;
          //         }
          //         return formData.burialAllowanceRequested !== 'nonService';
          //       },
          //     },
          //   },
          //   burialCost: merge({}, currencyUI('Actual burial cost'), {
          //     'ui:options': {
          //       expandUnder: 'burialAllowanceRequested',
          //       expandUnderCondition: 'vaMC',
          //     },
          //   }),
          //   previouslyReceivedAllowance: {
          //     'ui:title': 'Did you previously receive a VA burial allowance?',
          //     'ui:widget': 'yesNo',
          //     'ui:required': form =>
          //       get('relationship.type', form) === 'spouse',
          //     'ui:options': {
          //       hideIf: form => get('relationship.type', form) !== 'spouse',
          //     },
          //   },
          //   benefitsUnclaimedRemains: {
          //     'ui:title':
          //       'Are you seeking burial benefits for the unclaimed remains of a Veteran?',
          //     'ui:widget': 'yesNo',
          //     'ui:required': form => get('relationship.type', form) === 'other',
          //     'ui:options': {
          //       hideIf: form => get('relationship.type', form) !== 'other',
          //     },
          //   },
          // },
          // schema: {
          //   type: 'object',
          //   required: ['burialAllowanceRequested'],
          //   properties: {
          //     burialAllowanceRequested,
          //     'view:nonServiceWarning': { type: 'object', properties: {} },
          //     burialCost,
          //     previouslyReceivedAllowance,
          //     benefitsUnclaimedRemains,
          //   },
          // },
        },
        plotAllowance: {
          title: 'Plot or interment allowance',
          path: 'benefits/plot-allowance',
          depends: form =>
            get('view:claimedBenefits.plotAllowance', form) === true,
          uiSchema: {
            'ui:title': 'Plot or interment allowance',
            placeOfRemains: {
              'ui:title':
                'Place of burial or location of deceased Veteran’s remains',
            },
            federalCemetery: {
              'ui:title':
                'Was the Veteran buried in a national cemetery, or one owned by the federal government?',
              'ui:widget': 'yesNo',
            },
            stateCemetery: {
              'ui:title':
                'Was the Veteran buried in a state Veterans cemetery?',
              'ui:widget': 'yesNo',
              'ui:required': form => form.federalCemetery === false,
              'ui:options': {
                expandUnder: 'federalCemetery',
                expandUnderCondition: false,
              },
            },
            govtContributions: {
              'ui:title':
                'Did a federal/state government or the Veteran’s employer contribute to the burial?  (Not including employer life insurance)',
              'ui:widget': 'yesNo',
            },
            amountGovtContribution: merge(
              {},
              currencyUI('Amount of government or employer contribution:'),
              {
                'ui:options': {
                  expandUnder: 'govtContributions',
                },
              },
            ),
          },
          schema: {
            type: 'object',
            required: [
              'placeOfRemains',
              'federalCemetery',
              'govtContributions',
            ],
            properties: {
              placeOfRemains,
              federalCemetery,
              stateCemetery,
              govtContributions,
              amountGovtContribution,
            },
          },
        },
      },
    },
    additionalInformation: {
      title: 'Additional information',
      pages: {
        // claimantContactInformation: {
        //   title: 'Claimant contact information',
        //   path: 'claimant-contact-information',
        //   uiSchema: {
        //     'ui:title': 'Claimant contact information',
        //     claimantAddress: set(
        //       'ui:validations[1]',
        //       validateCentralMailPostalCode,
        //       address.uiSchema('Address'),
        //     ),
        //     claimantEmail: emailUI(),
        //     claimantPhone: phoneUI('Phone number'),
        //   },
        //   schema: {
        //     type: 'object',
        //     required: ['claimantAddress'],
        //     properties: {
        //       claimantAddress: address.schema(
        //         fullSchemaBurials,
        //         true,
        //         'centralMailAddress',
        //       ),
        //       claimantEmail,
        //       claimantPhone,
        //     },
        //   },
        // },
        documentUpload: {
          title: 'Document upload',
          path: 'documents',
          editModeOnReviewPage: true,
          uiSchema: {
            'ui:title': 'Document upload',
            'ui:description': fileHelp,
            deathCertificate: {
              ...fileUploadUI('Veteran’s death certificate', {
                fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
                hideIf: form => form.burialAllowanceRequested !== 'service',
              }),
              'ui:required': form =>
                form.burialAllowanceRequested === 'service',
            },

            transportationReceipts: {
              ...fileUploadUI(
                'Documentation for transportation of the Veteran’s remains or other supporting evidence',
                {
                  addAnotherLabel: 'Add Another Document',
                  fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
                },
              ),
              'ui:required': form =>
                get('view:claimedBenefits.transportation', form) === true,
            },

            'view:serviceRecordWarning': {
              'ui:description': serviceRecordWarning,
              'ui:options': {
                hideIf: form => form.toursOfDuty,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              deathCertificate: {
                ...files,
                minItems: 1,
                maxItems: 1,
              },
              transportationReceipts: {
                ...files,
                minItems: 1,
              },
              'view:serviceRecordWarning': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
