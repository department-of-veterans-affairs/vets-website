import React from 'react';
import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import moment from 'moment';
import { createSelector } from 'reselect';

// import { transform } from '../helpers';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530-schema.json';

import {
  validateBooleanGroup,
  validateCurrentOrPastDate,
} from 'platform/forms-system/src/js/validation';
import { isFullDate } from 'platform/forms/validations';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import GetFormHelp from 'platform/forms/components/GetPensionOrBurialFormHelp';
import FormFooter from 'platform/forms/components/FormFooter';
import fullNameUI from 'platform/forms/definitions/fullName';
import environment from 'platform/utilities/environment';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import { VA_FORM_IDS } from 'platform/forms/constants';

import * as address from 'platform/forms/definitions/address';
import FullNameField from 'platform/forms-system/src/js/fields/FullNameField';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import ApplicantDescription from '../components/ApplicantDescription';
import ErrorText from '../components/ErrorText';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import toursOfDutyUI from '../definitions/toursOfDuty';

import {
  BurialDateWarning,
  fileHelp,
  transportationWarning,
  serviceRecordNotification,
  serviceRecordWarning,
  submit,
  generateHelpText,
  generateDescription,
} from '../helpers';
import {
  relationshipLabels,
  locationOfDeathLabels,
  allowanceLabels,
} from '../labels';
import {
  validateBurialAndDeathDates,
  validateCentralMailPostalCode,
} from '../validation';
import migrations from '../migrations';

import manifest from '../manifest.json';

const {
  claimantFullName,
  claimantSocialSecurityNumber,
  claimantDateOfBirth,
  veteranFullName,
  locationOfDeath,
  burialDate,
  deathDate,
  claimantEmail,
  claimantPhone,
  toursOfDuty,
  placeOfRemains,
  federalCemetery,
  stateCemetery,
  govtContributions,
  amountGovtContribution,
  burialAllowanceRequested,
  burialCost,
  previouslyReceivedAllowance,
  benefitsUnclaimedRemains,
  burialAllowance,
  plotAllowance,
  transportation,
  amountIncurred,
  previousNames,
  veteranSocialSecurityNumber,
  veteranDateOfBirth,
  // placeOfBirth,
  officialPosition,
  firmName,
  vaFileNumber,
  relationship,
  // facilityName,
  // facilityLocation,
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

// If filing for a non-service-connected allowance, the burial date must be within 2 years from the current date.
function isEligibleNonService(veteranBurialDate) {
  return moment()
    .startOf('day')
    .subtract(2, 'years')
    .isBefore(veteranBurialDate);
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit,
  trackingPrefix: 'burials-530-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
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
        claimantInformationPartOne: {
          title: 'Your information',
          path: 'claimant-information/part-one',
          uiSchema: {
            'ui:description': formContext => (
              <>
                <ApplicantDescription formContext={formContext} />
                {generateDescription('Personal information')}
                <va-alert
                  close-btn-aria-label="Close notification"
                  status="info"
                  uswds
                  visible
                >
                  <p className="vads-u-margin-y--0">
                    We’ve prefilled some of your information from your account.
                    If you need to correct anything, you can edit the form
                    fields below.
                  </p>
                </va-alert>
              </>
            ),
            // 'ui:description': ApplicantDescription,
            claimantFullName: {
              ...fullNameUI,
              first: {
                'ui:title': 'Your first name',
                'ui:errorMessages': {
                  required: 'Enter your first name',
                },
              },
              middle: {
                'ui:title': 'Your middle name',
              },
              last: {
                'ui:title': 'Your last name',
                'ui:errorMessages': {
                  required: 'Enter your last name',
                },
              },
              suffix: {
                'ui:title': 'Your suffix',
              },
            },
            claimantSocialSecurityNumber: {
              ...ssnUI,
              'ui:title': 'Your Social Security number',
              'ui:description': generateHelpText('example, 123 45 6789'),
              'ui:errorMessages': {
                required: 'Enter your Social Security number',
              },
            },
            claimantDateOfBirth: {
              'ui:title': 'Your date if birth',
              'ui:widget': 'date',
              'ui:validations': [validateCurrentOrPastDate],
              'ui:errorMessages': {
                required: 'Enter your date of birth',
                pattern: 'Enter a valid date',
              },
            },
          },
          schema: {
            type: 'object',
            required: [
              'claimantFullName',
              'claimantSocialSecurityNumber',
              'claimantDateOfBirth',
            ],
            properties: {
              claimantFullName,
              claimantSocialSecurityNumber,
              claimantDateOfBirth,
            },
          },
        },
        claimantInformationPartTwo: {
          title: 'Your information',
          path: 'claimant-information/part-two',
          uiSchema: {
            'ui:title': 'Relationship to Veteran',
            relationship: {
              type: {
                'ui:title': 'What’s your relationship to the deceased Veteran?',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: relationshipLabels,
                },
                'ui:errorMessages': {
                  required: 'Select your relationship to the deceased Veteran',
                },
              },
              other: {
                'ui:title': 'Please specify',
                'ui:required': form =>
                  get('relationship.type', form) === 'other',
                'ui:options': {
                  hideIf: form => get('relationship.type', form) !== 'other',
                },
                'ui:errorMessages': {
                  required: 'Enter your relationship to the deceased Veteran',
                },
              },
              isEntity: {
                'ui:title': 'Claiming as a firm, corporation or state agency',
                'ui:options': {
                  hideIf: form => get('relationship.type', form) !== 'other',
                  widgetClassNames: 'schemaform-label-no-top-margin',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['relationship'],
            properties: {
              relationship,
            },
          },
        },
        claimantInformationPartThree: {
          title: 'Your information',
          path: 'claimant-information/part-three',
          uiSchema: {
            'ui:title': 'Mailing address',
            'ui:description':
              'We’ll send any important information about your application to this address',
            firmName: {
              'ui:title': 'Full name of firm, corporation or state agency',
              'ui:options': {
                hideIf: form => get('relationship.isEntity', form) !== true,
              },
            },
            officialPosition: {
              'ui:title':
                'Position of person signing on behalf of firm, corporation or state agency',
              'ui:options': {
                hideIf: form => get('relationship.isEntity', form) !== true,
              },
            },
            claimantAddress: set(
              'ui:validations[1]',
              validateCentralMailPostalCode,
              address.uiSchema(''),
            ),
          },
          schema: {
            type: 'object',
            required: ['claimantAddress'],
            properties: {
              firmName,
              officialPosition,
              claimantAddress: address.schema(
                fullSchemaBurials,
                true,
                'centralMailAddress',
              ),
            },
          },
        },
        claimantInformationPartFour: {
          title: 'Your information',
          path: 'claimant-information/part-four',
          uiSchema: {
            'ui:title': 'Contact information',
            claimantEmail: emailUI(),
            claimantPhone: phoneUI('Phone number'),
          },
          schema: {
            type: 'object',
            properties: {
              claimantEmail,
              claimantPhone,
            },
          },
        },
      },
    },
    veteranInformation: {
      title: 'Deceased Veteran information',
      pages: {
        veteranInformationPartOne: {
          title: 'Deceased Veteran information',
          path: 'veteran-information/part-one',
          uiSchema: {
            'ui:description': (
              <>
                <h3>Personal information</h3>
              </>
            ),
            veteranFullName: {
              ...fullNameUI,
              first: {
                'ui:title': 'Veteran’s first name',
              },
              middle: {
                'ui:title': 'Veteran’s middle name',
              },
              last: {
                'ui:title': 'Veteran’s last name',
              },
            },
          },
          schema: {
            type: 'object',
            required: ['veteranFullName'],
            properties: {
              veteranFullName,
            },
          },
        },
        veteranInformationPartTwo: {
          title: 'Deceased Veteran information',
          path: 'veteran-information/part-two',
          uiSchema: {
            'ui:description': generateDescription('Personal information'),
            veteranSocialSecurityNumber: {
              ...ssnUI,
              'ui:title': 'Veteran’s Social Security number',
              'ui:required': form => !form.vaFileNumber,
              'ui:description': generateHelpText('example, 123 45 6789'),
              'ui:errorMessages': {
                required: 'Enter the Veteran’s Social Security number',
              },
            },
            vaFileNumber: {
              'ui:title': 'Veteran’s VA file number',
              'ui:description': generateHelpText(
                'Enter Veteran’s VA file number if it doesn’t match their SSN',
              ),
              'ui:options': {
                widgetClassNames: 'usa-input-medium',
              },
            },
            veteranDateOfBirth: {
              ...currentOrPastDateUI('Veteran’s date of birth'),
              'ui:errorMessages': {
                required: 'Enter the Veteran’s date of birth',
              },
            },
          },
          schema: {
            type: 'object',
            required: ['veteranSocialSecurityNumber', 'veteranDateOfBirth'],
            properties: {
              veteranSocialSecurityNumber,
              vaFileNumber,
              veteranDateOfBirth,
            },
          },
        },
        burialInformationPartOne: {
          title: 'Burial information',
          path: 'veteran-information/burial/part-one',
          uiSchema: {
            'ui:description': generateDescription('Burial information'),
            deathDate: {
              ...currentOrPastDateUI('Date of death'),
              'ui:errorMessages': {
                required: 'Enter the Veteran’s date of death',
              },
            },
            burialDate: {
              ...currentOrPastDateUI(
                'Date of burial (includes cremation or interment)',
              ),
              'ui:errorMessages': {
                required: 'Enter the Veteran’s date of burial',
              },
            },
            'view:burialDateWarning': {
              'ui:description': BurialDateWarning,
              'ui:options': {
                hideIf: formData => {
                  // If they haven’t entered a complete year, don’t jump the gun and show the warning
                  if (formData.burialDate && !isFullDate(formData.burialDate)) {
                    return true;
                  }

                  // Show the warning if the burial date was more than 2 years ago
                  return isEligibleNonService(formData.burialDate);
                },
              },
            },
            'ui:validations': [validateBurialAndDeathDates],
          },
          schema: {
            type: 'object',
            required: ['burialDate', 'deathDate'],
            properties: {
              deathDate,
              burialDate,
              'view:burialDateWarning': { type: 'object', properties: {} },
            },
          },
        },
        burialInformationPartTwo: {
          title: 'Burial information',
          path: 'veteran-information/burial/part-two',
          uiSchema: {
            'ui:description': generateDescription('Burial information'),
            locationOfDeath: {
              location: {
                'ui:title': 'Where did the Veteran’s death occur?',
                'ui:widget': 'radio',
                'ui:errorMessages': {
                  required: 'Select where the Veteran’s death happened',
                },
                'ui:options': {
                  labels: locationOfDeathLabels,
                },
              },
              nursingHomePaid: {
                facilityName: {
                  'ui:title':
                    'Name of the facility or nursing home that VA pays for',
                  'ui:required': form => !form.facilityName,
                  'ui:errorMessages': {
                    required:
                      'Enter the name of the facility or nursing home that VA pays for',
                  },
                },
                facilityLocation: {
                  'ui:title':
                    'City and state of the facility or nursing home that VA pays for',
                  'ui:required': form => !form.facilityLocation,
                  'ui:errorMessages': {
                    required:
                      'Enter the city and state of the facility or nursing home that VA pays for',
                  },
                },
                'ui:options': {
                  hideIf: form =>
                    get('locationOfDeath.location', form) !== 'nursingHomePaid',
                },
              },
              vaMedicalCenter: {
                facilityName: {
                  'ui:title': 'Name of the VA medical center',
                  'ui:required': form => !form.facilityName,
                  'ui:errorMessages': {
                    required: 'Enter the Name of the VA medical center',
                  },
                },
                facilityLocation: {
                  'ui:title': 'City and state of the VA medical center',
                  'ui:required': form => !form.facilityLocation,
                  'ui:errorMessages': {
                    required:
                      'Enter the city and state of the VA medical center',
                  },
                },
                'ui:options': {
                  hideIf: form =>
                    get('locationOfDeath.location', form) !== 'vaMedicalCenter',
                },
              },
              stateVeteransHome: {
                facilityName: {
                  'ui:title': 'Name of the state Veterans facility',
                  'ui:required': form => !form.facilityName,
                  'ui:errorMessages': {
                    required: 'Enter the name of the state Veterans facility',
                  },
                },
                facilityLocation: {
                  'ui:title': 'City and state of the state Veterans facility',
                  'ui:required': form => !form.facilityLocation,
                  'ui:errorMessages': {
                    required:
                      'Enter the city and state of the state Veterans facility',
                  },
                },
                // 'ui:required': form =>
                //   get('locationOfDeath.location', form) === 'nursingHomePaid',
                'ui:options': {
                  hideIf: form =>
                    get('locationOfDeath.location', form) !==
                    'stateVeteransHome',
                },
              },
              other: {
                'ui:title': 'Place where the Veteran’s death happened',
                'ui:errorMessages': {
                  required: 'Enter where the Veteran’s death happened',
                },
                'ui:required': form =>
                  get('locationOfDeath.location', form) === 'other',
                'ui:options': {
                  hideIf: form =>
                    get('locationOfDeath.location', form) !== 'other',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['locationOfDeath', 'facilityName', 'facilityLocation'],
            properties: {
              locationOfDeath,
            },
          },
        },
      },
    },
    militaryHistory: {
      title: 'Military history',
      pages: {
        servicePeriods: {
          title: 'Service periods',
          path: 'military-history/service-periods',
          uiSchema: {
            'view:serviceRecordNotification': {
              'ui:description': serviceRecordNotification,
            },
            toursOfDuty: toursOfDutyUI,
          },
          schema: {
            type: 'object',
            properties: {
              'view:serviceRecordNotification': {
                type: 'object',
                properties: {},
              },
              toursOfDuty,
            },
          },
        },
        previousNames: {
          title: 'Previous names',
          path: 'military-history/previous-names',
          uiSchema: {
            previousNames: {
              'ui:options': {
                itemName: 'Name',
                expandUnder: 'view:serveUnderOtherNames',
                viewField: FullNameField,
              },
              items: {
                ...fullNameUI,
                first: {
                  'ui:title': 'Veteran’s first name',
                },
                middle: {
                  'ui:title': 'Veteran’s middle name',
                },
                last: {
                  'ui:title': 'Veteran’s last name',
                },
              },
            },
            'view:serveUnderOtherNames': {
              'ui:title': 'Did the Veteran serve under another name?',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:serveUnderOtherNames': {
                type: 'boolean',
              },
              previousNames: {
                ...previousNames,
                minItems: 1,
              },
            },
          },
        },
      },
    },
    benefitsSelection: {
      title: 'Benefits selection',
      pages: {
        benefitsSelection: {
          title: 'Benefits selection',
          path: 'benefits/selection',
          uiSchema: {
            'view:claimedBenefits': {
              'ui:title':
                'What expenses did you incur for the Veteran’s burial?',
              burialAllowance: {
                'ui:title': 'Burial allowance',
              },
              plotAllowance: {
                'ui:title':
                  'Plot or interment allowance (Check this box if you incurred expenses for the plot to bury the Veteran’s remains.)',
              },
              transportation: {
                'ui:title':
                  'Transportation expenses (Transportation of the Veteran’s remains from the place of death to the final resting place)',
                'ui:options': {
                  expandUnderClassNames: 'schemaform-expandUnder-indent',
                },
              },
              amountIncurred: merge(
                {},
                currencyUI('Transportation amount incurred'),
                {
                  'ui:required': form =>
                    get('view:claimedBenefits.transportation', form) === true,
                  'ui:options': {
                    expandUnder: 'transportation',
                  },
                },
              ),
              'view:transportationWarning': {
                'ui:description': transportationWarning,
                'ui:options': {
                  expandUnder: 'transportation',
                },
              },
              'ui:validations': [validateBooleanGroup],
              'ui:errorMessages': {
                atLeastOne: 'You must have expenses for at least one benefit.',
              },
              'ui:options': {
                showFieldLabel: true,
              },
            },
          },
          schema: {
            type: 'object',
            required: ['view:claimedBenefits'],
            properties: {
              'view:claimedBenefits': {
                type: 'object',
                properties: {
                  burialAllowance,
                  plotAllowance,
                  transportation,
                  amountIncurred,
                  'view:transportationWarning': {
                    type: 'object',
                    properties: {},
                  },
                },
              },
            },
          },
        },
        burialAllowance: {
          title: 'Burial allowance',
          path: 'benefits/burial-allowance',
          depends: form =>
            get('view:claimedBenefits.burialAllowance', form) === true,
          uiSchema: {
            'ui:title': 'Burial allowance',
            burialAllowanceRequested: {
              'ui:title': 'Type of burial allowance requested',
              'ui:widget': 'radio',
              'ui:options': {
                labels: allowanceLabels,
                updateSchema: (() => {
                  const burialAllowanceTypes = burialAllowanceRequested.enum;
                  const filterAllowanceType = createSelector(
                    form => get('locationOfDeath.location', form),
                    locationData => {
                      let allowanceTypes = burialAllowanceTypes;
                      if (
                        locationData !== 'vaMedicalCenter' &&
                        locationData !== 'nursingHome'
                      ) {
                        allowanceTypes = allowanceTypes.filter(
                          type => type !== 'vaMC',
                        );
                      }
                      return { enum: allowanceTypes };
                    },
                  );
                  return form => filterAllowanceType(form);
                })(),
              },
            },
            'view:nonServiceWarning': {
              'ui:description': BurialDateWarning,
              'ui:options': {
                hideIf: formData => {
                  if (
                    !formData.burialAllowanceRequested ||
                    isEligibleNonService(formData.burialDate)
                  ) {
                    return true;
                  }
                  return formData.burialAllowanceRequested !== 'nonService';
                },
              },
            },
            burialCost: merge({}, currencyUI('Actual burial cost'), {
              'ui:options': {
                expandUnder: 'burialAllowanceRequested',
                expandUnderCondition: 'vaMC',
              },
            }),
            previouslyReceivedAllowance: {
              'ui:title': 'Did you previously receive a VA burial allowance?',
              'ui:widget': 'yesNo',
              'ui:required': form =>
                get('relationship.type', form) === 'spouse',
              'ui:options': {
                hideIf: form => get('relationship.type', form) !== 'spouse',
              },
            },
            benefitsUnclaimedRemains: {
              'ui:title':
                'Are you seeking burial benefits for the unclaimed remains of a Veteran?',
              'ui:widget': 'yesNo',
              'ui:required': form => get('relationship.type', form) === 'other',
              'ui:options': {
                hideIf: form => get('relationship.type', form) !== 'other',
              },
            },
          },
          schema: {
            type: 'object',
            required: ['burialAllowanceRequested'],
            properties: {
              burialAllowanceRequested,
              'view:nonServiceWarning': { type: 'object', properties: {} },
              burialCost,
              previouslyReceivedAllowance,
              benefitsUnclaimedRemains,
            },
          },
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
        claimantContactInformation: {
          title: 'Claimant contact information',
          path: 'claimant-contact-information',
          uiSchema: {
            'ui:title': 'Claimant contact information',
            firmName: {
              'ui:title': 'Full name of firm, corporation or state agency',
              'ui:options': {
                hideIf: form => get('relationship.isEntity', form) !== true,
              },
            },
            officialPosition: {
              'ui:title':
                'Position of person signing on behalf of firm, corporation or state agency',
              'ui:options': {
                hideIf: form => get('relationship.isEntity', form) !== true,
              },
            },
            claimantAddress: set(
              'ui:validations[1]',
              validateCentralMailPostalCode,
              address.uiSchema('Address'),
            ),
            claimantEmail: emailUI(),
            claimantPhone: phoneUI('Phone number'),
          },
          schema: {
            type: 'object',
            required: ['claimantAddress'],
            properties: {
              firmName,
              officialPosition,
              claimantAddress: address.schema(
                fullSchemaBurials,
                true,
                'centralMailAddress',
              ),
              claimantEmail,
              claimantPhone,
            },
          },
        },
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
