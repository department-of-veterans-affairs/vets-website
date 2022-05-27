import React from 'react';
import { merge, omit, without } from 'lodash';
import get from 'platform/utilities/data/get';
import { createSelector } from 'reselect';

import fullSchema5490 from 'vets-json-schema/dist/22-5490-schema.json';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import { vagovprod, VAGOVSTAGING } from 'site/constants/buckets';

import * as address from 'platform/forms/definitions/address';
import FormFooter from 'platform/forms/components/FormFooter';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import createNonRequiredFullName from 'platform/forms/definitions/nonRequiredFullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import dateRangeUi from 'platform/forms-system/src/js/definitions/dateRange';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import environment from 'platform/utilities/environment';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import fullNameUi from 'platform/forms/definitions/fullName';
import monthYearUI from 'platform/forms-system/src/js/definitions/monthYear';
import * as personId from 'platform/forms/definitions/personId';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  validateMonthYear,
  validateFutureDateIfExpectedGrad,
} from 'platform/forms-system/src/js/validation';

import PreSubmitInfo from '../containers/PreSubmitInfo';
import {
  benefitsRelinquishedInfo,
  benefitsRelinquishedWarning,
  benefitsDisclaimerChild,
  benefitsDisclaimerSpouse,
  relationshipLabels,
  highSchoolStatusLabels,
  transform,
  isOnlyWhitespace,
  applicantIsChildOfSponsor,
  addWhitespaceOnlyError,
  isAlphaNumeric,
} from '../helpers';

import { urlMigration } from '../../config/migrations';

import { stateLabels, survivorBenefitsLabels } from '../../utils/labels';

import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';
import postHighSchoolTrainingsUi from '../../definitions/postHighSchoolTrainings';

import contactInformationPage from '../../pages/contactInformation';
import createDirectDepositPage from '../../pages/directDeposit';
import applicantInformationUpdate from '../components/applicantInformationUpdate';
import applicantServicePage from '../../pages/applicantService';
import createSchoolSelectionPage, {
  schoolSelectionOptionsFor,
} from '../../pages/schoolSelection';
import additionalBenefitsPage from '../../pages/additionalBenefits';
import employmentHistoryPage from '../../pages/employmentHistory';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import benefitSelectionWarning from '../components/BenefitSelectionWarning';

import manifest from '../manifest.json';
import { newFormFields, newFormPages, RELATIONSHIP } from '../constants';
import GoToYourProfileLink from '../../1990e/components/GoToYourProfileLink';
import RelatedVeterans from '../components/RelatedVeterans';
import { phoneSchema, phoneUISchema } from '../schema';
import EmailViewField from '../components/EmailViewField';
import { isValidPhone, validateEmail } from '../validation';
import EmailReviewField from '../components/EmailReviewField';
import YesNoReviewField from '../components/YesNoReviewField';
import MailingAddressViewField from '../components/MailingAddressViewField';

const {
  benefit,
  benefitsRelinquishedDate,
  currentlyActiveDuty,
  currentSameAsPrevious,
  highSchool,
  outstandingFelony,
  previousBenefits,
  serviceBranch,
  sponsorStatus,
  spouseInfo,
  veteranDateOfBirth,
  veteranDateOfDeath,
} = fullSchema5490.properties;

const {
  secondaryContact,
  date,
  dateRange,
  educationType,
  fullName,
  postHighSchoolTrainings,
  vaFileNumber,
  phone,
  ssn,
} = fullSchema5490.definitions;

const { /* fullName, date, dateRange, usaPhone, */ email } = commonDefinitions;
const contactMethods = ['Email', 'Home Phone', 'Mobile Phone', 'Mail'];
const nonRequiredFullName = createNonRequiredFullName(fullName);

const checkImageSrc = environment.isStaging()
  ? `${VAGOVSTAGING}/img/check-sample.png`
  : `${vagovprod}/img/check-sample.png`;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/5490`,
  trackingPrefix: 'edu-5490-',
  formId: VA_FORM_IDS.FORM_22_5490,
  saveInProgress: {
    messages: {
      inProgress:
        'Your education benefits application (22-5490) is in progress.',
      expired:
        'Your saved education benefits application (22-5490) has expired. If you want to apply for education benefits, please start a new application.',
      saved: 'Your education benefits application has been saved.',
    },
  },
  version: 1,
  migrations: [urlMigration('/5490')],
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Apply for education benefits as an eligible dependent',
  subTitle: 'Form 22-5490',
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
    field: 'privacyAgreementAccepted',
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    date,
    educationType,
    dateRange,
    fullName,
    ssn,
    vaFileNumber,
  },
  chapters: {
    /**
     * OLD CHAPTERS
     */
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantInformation: applicantInformationUpdate(fullSchema5490, {
          labels: { relationship: relationshipLabels },
        }),
        additionalBenefits: {
          ...additionalBenefitsPage(fullSchema5490, {
            fields: ['civilianBenefitsAssistance', 'civilianBenefitsSource'],
          }),
          depends: formData => !formData.showUpdatedFryDeaApp,
        },
        applicantService: {
          ...applicantServicePage(fullSchema5490),
          depends: formData => !formData.showUpdatedFryDeaApp,
        },
      },
    },
    benefitSelection: {
      title: 'Benefits eligibility',
      pages: {
        benefitSelection: {
          title: 'Benefits eligibility',
          path: 'benefits/eligibility',
          initialData: {},
          depends: formData => !formData.showUpdatedFryDeaApp,
          uiSchema: {
            'ui:title': 'Benefit selection',
            'view:benefitsDisclaimerChild': {
              'ui:description': benefitsDisclaimerChild,
              'ui:options': {
                hideIf: form => get('relationship', form) !== 'child',
              },
            },
            'view:benefitsDisclaimerSpouse': {
              'ui:description': benefitsDisclaimerSpouse,
              'ui:options': {
                hideIf: form => get('relationship', form) !== 'spouse',
              },
            },
            benefit: {
              'ui:widget': 'radio',
              'ui:title': 'Select the benefit that is the best match for you:',
              'ui:options': {
                labels: survivorBenefitsLabels,
                updateSchema: (form, schema, uiSchema) => {
                  const relationship = get('relationship', form);
                  const nestedContent = {
                    chapter33: benefitSelectionWarning(
                      'chapter33',
                      relationship,
                    ),
                    chapter35: benefitSelectionWarning(
                      'chapter35',
                      relationship,
                    ),
                  };
                  const uiOptions = get('ui:options', uiSchema);
                  uiOptions.nestedContent = nestedContent;
                  return schema;
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['benefit'],
            properties: {
              'view:benefitsDisclaimerChild': {
                type: 'object',
                properties: {},
              },
              'view:benefitsDisclaimerSpouse': {
                type: 'object',
                properties: {},
              },
              benefit,
            },
          },
        },
        benefitRelinquishment: {
          title: 'Benefits relinquishment',
          path: 'benefits/relinquishment',
          initialData: {},
          depends: formData =>
            !formData.showUpdatedFryDeaApp && formData.relationship === 'child',
          uiSchema: {
            'ui:title': 'Benefits relinquishment',
            'view:benefitsRelinquishedInfo': {
              'ui:description': benefitsRelinquishedInfo,
            },
            benefitsRelinquishedDate: currentOrPastDateUI('Effective date'),
            'view:benefitsRelinquishedWarning': {
              'ui:description': benefitsRelinquishedWarning,
            },
          },
          schema: {
            type: 'object',
            required: ['benefitsRelinquishedDate'],
            properties: {
              'view:benefitsRelinquishedInfo': {
                type: 'object',
                properties: {},
              },
              benefitsRelinquishedDate,
              'view:benefitsRelinquishedWarning': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        benefitHistory: {
          title: 'Benefits history',
          path: 'benefits/history',
          depends: formData => !formData.showUpdatedFryDeaApp,
          initialData: {},
          uiSchema: {
            'ui:title': 'Benefits history',
            'ui:description':
              'Before this application, have you ever applied for or received any of the following VA benefits?',
            previousBenefits: {
              'ui:order': [
                'disability',
                'dic',
                'chapter31',
                'view:ownServiceBenefits',
                'ownServiceBenefits',
                'view:claimedSponsorService',
                'chapter35',
                'chapter33',
                'transferOfEntitlement',
                'veteranFullName',
                'view:veteranId',
                'view:otherBenefitReceived',
                'other',
              ],
              'view:noPreviousBenefits': {
                'ui:title': 'None',
              },
              'view:otherBenefitReceived': {
                'ui:title': 'Other benefit',
              },
              disability: {
                'ui:title': 'Disability Compensation or Pension',
              },
              dic: {
                'ui:title': 'Dependents’ Indemnity Compensation (DIC)',
              },
              chapter31: {
                'ui:title':
                  'Veteran Readiness and Employment benefits (Chapter 31)',
              },
              'view:ownServiceBenefits': {
                'ui:title':
                  'Veterans education assistance based on your own service',
                'ui:options': {
                  expandUnderClassNames: 'schemaform-expandUnder-indent',
                },
              },
              ownServiceBenefits: {
                'ui:title': 'Describe the benefits you used',
                'ui:options': {
                  expandUnder: 'view:ownServiceBenefits',
                },
              },
              'view:claimedSponsorService': {
                'ui:title':
                  'Veterans education assistance based on someone else’s service',
                'ui:options': {
                  expandUnderClassNames: 'schemaform-expandUnder-indent',
                },
              },
              chapter35: {
                'ui:title':
                  'Survivors’ and Dependents’ Educational Assistance Program (DEA, Chapter 35)',
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService',
                },
              },
              chapter33: {
                'ui:title':
                  'Post-9/11 GI Bill Marine Gunnery Sergeant David Fry Scholarship (Chapter 33)',
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService',
                },
              },
              transferOfEntitlement: {
                'ui:title': 'Transferred Entitlement',
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService',
                },
              },
              veteranFullName: merge({}, fullNameUi, {
                'ui:title': 'Sponsor Veteran’s name',
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService',
                  updateSchema: form => {
                    if (
                      get('previousBenefits.view:claimedSponsorService', form)
                    ) {
                      return fullName;
                    }
                    return nonRequiredFullName;
                  },
                },
                // Re-label the inputs to add 'sponsor'
                first: { 'ui:title': "Sponsor's first name" },
                last: { 'ui:title': "Sponsor's last name" },
                middle: { 'ui:title': "Sponsor's middle name" },
                suffix: { 'ui:title': "Sponsor's suffix" },
              }),
              'view:veteranId': merge({}, personId.uiSchema(), {
                veteranSocialSecurityNumber: {
                  'ui:title': "Sponsor's Social Security number",
                  'ui:required': formData =>
                    get(
                      'previousBenefits.view:claimedSponsorService',
                      formData,
                    ) &&
                    !get(
                      'previousBenefits.view:veteranId.view:noSSN',
                      formData,
                    ),
                },
                'view:noSSN': {
                  'ui:title':
                    'I don’t know my sponsor’s Social Security number',
                },
                vaFileNumber: {
                  'ui:title': "Sponsor's VA number",
                  'ui:required': formData =>
                    get(
                      'previousBenefits.view:claimedSponsorService',
                      formData,
                    ) &&
                    !!get(
                      'previousBenefits.view:veteranId.view:noSSN',
                      formData,
                    ),
                },
                'ui:options': {
                  expandUnder: 'view:claimedSponsorService',
                },
              }),
              other: {
                'ui:title': 'What benefit?',
                'ui:options': {
                  expandUnder: 'view:otherBenefitReceived',
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              previousBenefits: merge(
                {},
                omit(previousBenefits, [
                  'anyOf',
                  'properties.veteranFullName',
                  'properties.veteranSocialSecurityNumber',
                  'properties.vaFileNumber',
                ]),
                {
                  properties: {
                    'view:ownServiceBenefits': { type: 'boolean' },
                    'view:claimedSponsorService': { type: 'boolean' },
                    veteranFullName: fullName,
                    'view:veteranId': personId.schema(fullSchema5490),
                    'view:otherBenefitReceived': { type: 'boolean' },
                  },
                },
              ),
            },
          },
        },
      },
    },
    sponsorInformation: {
      title: 'Sponsor information',
      pages: {
        sponsorInformation: {
          title: 'Sponsor information',
          path: 'sponsor/information',
          depends: formData => !formData.showUpdatedFryDeaApp,
          uiSchema: {
            spouseInfo: {
              divorcePending: {
                'ui:title':
                  'Is there a divorce or annulment pending with your sponsor?',
                'ui:widget': 'yesNo',
                'ui:required': formData =>
                  get('relationship', formData) === 'spouse',
              },
              remarried: {
                'ui:title':
                  'If you’re the surviving spouse, did you get remarried?',
                'ui:widget': 'yesNo',
              },
              remarriageDate: {
                ...dateUI('Date you got remarried'),
                'ui:options': {
                  expandUnder: 'remarried',
                },
                'ui:required': formData =>
                  get('spouseInfo.remarried', formData),
              },
              'ui:options': {
                hideIf: formData => get('relationship', formData) !== 'spouse',
              },
            },
            currentSameAsPrevious: {
              'ui:options': {
                hideIf: formData =>
                  !get('previousBenefits.view:claimedSponsorService', formData),
              },
              'ui:title': 'Same sponsor as previously claimed benefits',
            },
            'view:currentSponsorInformation': {
              'ui:options': {
                hideIf: formData => formData.currentSameAsPrevious,
              },
              veteranFullName: merge({}, fullNameUi, {
                'ui:options': {
                  updateSchema: form => {
                    if (!get('currentSameAsPrevious', form)) {
                      return fullName;
                    }
                    return nonRequiredFullName;
                  },
                },
                'ui:title': 'Name of Sponsor',
                first: {
                  'ui:title': "Sponsor's first name",
                },
                middle: {
                  'ui:title': "Sponsor's middle name",
                },
                last: {
                  'ui:title': "Sponsor's last name",
                },
                suffix: {
                  'ui:title': "Sponsor's suffix",
                },
              }),
              'view:veteranId': merge({}, personId.uiSchema(), {
                veteranSocialSecurityNumber: {
                  'ui:title': "Sponsor's Social Security number",
                  'ui:required': formData =>
                    !get('currentSameAsPrevious', formData) &&
                    !get(
                      'view:currentSponsorInformation.view:veteranId.view:noSSN',
                      formData,
                    ),
                },
                'view:noSSN': {
                  'ui:title':
                    'I don’t know my sponsor’s Social Security number',
                },
                vaFileNumber: {
                  'ui:required': formData =>
                    !!get(
                      'view:currentSponsorInformation.view:veteranId.view:noSSN',
                      formData,
                    ),
                  'ui:title': "Sponsor's VA number",
                },
              }),
            },
            veteranDateOfBirth: currentOrPastDateUI('Sponsor’s date of birth'),
            veteranDateOfDeath: {
              ...currentOrPastDateUI(
                "Sponsor's date of death or date listed as MIA or POW",
              ),
              'ui:options': {
                hideIf: formData =>
                  get('benefit', formData) === 'chapter33' &&
                  get('relationship', formData) === 'spouse',
              },
            },
            sponsorStatus: {
              'ui:title': 'Do any of these situations apply to your sponsor?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  diedOnDuty:
                    'Died while serving on active duty or duty other than active duty',
                  diedFromDisabilityOrOnReserve:
                    'Died from a service-connected disability while a member of the Selected Reserve',
                  powOrMia: 'Listed as MIA or POW',
                },
                hideIf: formData =>
                  get('benefit', formData) === 'chapter35' ||
                  get('relationship', formData) === 'child',
              },
            },
            'view:sponsorDateOfDeath': {
              ...currentOrPastDateUI('Sponsor’s date of death'),
              'ui:options': {
                expandUnder: 'sponsorStatus',
                expandUnderCondition: status => status && status !== 'powOrMia',
                hideIf: formData =>
                  get('benefit', formData) === 'chapter35' ||
                  get('relationship', formData) === 'child',
              },
            },
            'view:sponsorDateListedMiaOrPow': {
              ...currentOrPastDateUI('Sponsor’s date listed as MIA or POW'),
              'ui:options': {
                expandUnder: 'sponsorStatus',
                expandUnderCondition: status => status && status === 'powOrMia',
                hideIf: formData =>
                  get('benefit', formData) === 'chapter35' ||
                  get('relationship', formData) === 'child',
              },
            },
          },
          schema: {
            type: 'object',
            required: ['veteranDateOfBirth'],
            properties: {
              spouseInfo,
              currentSameAsPrevious,
              'view:currentSponsorInformation': {
                type: 'object',
                properties: {
                  veteranFullName: fullName,
                  'view:veteranId': personId.schema(fullSchema5490),
                },
              },
              veteranDateOfBirth,
              veteranDateOfDeath,
              sponsorStatus,
              'view:sponsorDateOfDeath': {
                $ref: '#/definitions/date',
              },
              'view:sponsorDateListedMiaOrPow': {
                $ref: '#/definitions/date',
              },
            },
          },
        },
        sponsorService: {
          title: 'Sponsor service',
          path: 'sponsor/service',
          depends: formData => !formData.showUpdatedFryDeaApp,
          uiSchema: {
            'ui:title': 'Sponsor service',
            serviceBranch: {
              'ui:title': "Sponsor's branch of service",
            },
            currentlyActiveDuty: {
              'ui:title': 'Is your sponsor on active duty?',
              'ui:widget': 'yesNo',
            },
            outstandingFelony: {
              'ui:title':
                'Do you or your sponsor have an outstanding felony and/or warrant?',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            properties: {
              serviceBranch,
              currentlyActiveDuty,
              outstandingFelony,
            },
          },
        },
      },
    },
    educationHistory: {
      title: 'Education history',
      pages: {
        educationHistory: {
          title: 'Education history',
          path: 'education/history',
          depends: formData => !formData.showUpdatedFryDeaApp,
          initialData: {},
          uiSchema: {
            highSchool: {
              status: {
                'ui:title': 'What’s your current high school status?',
                'ui:options': {
                  labels: highSchoolStatusLabels,
                  expandUnderClassNames: 'schemaform-expandUnder-indent',
                },
              },
              highSchoolOrGedCompletionDate: {
                ...monthYearUI(null),
                'ui:options': {
                  monthYear: true,
                  expandUnderCondition: status =>
                    status === 'graduated' || status === 'graduationExpected',
                  expandUnder: 'status',
                  updateSchema: form => {
                    const status = get('highSchool.status', form);

                    if (status === 'graduationExpected') {
                      return {
                        title:
                          'When do you expect to earn your high school diploma?',
                      };
                    }

                    return {
                      title: 'When did you earn your high school diploma?',
                    };
                  },
                },
                'ui:validations': [
                  validateMonthYear,
                  validateFutureDateIfExpectedGrad,
                ],
              },
              'view:hasHighSchool': {
                'ui:options': {
                  expandUnderCondition: status => status === 'discontinued',
                  expandUnder: 'status',
                },
                name: {
                  'ui:title': 'Name of high school',
                },
                city: {
                  'ui:title': 'City',
                },
                state: {
                  'ui:title': 'State',
                  'ui:options': {
                    labels: stateLabels,
                  },
                },
                dateRange: dateRangeUi(),
              },
            },
            'view:hasTrainings': {
              'ui:title': 'Do you have any training after high school?',
              'ui:widget': 'yesNo',
              'ui:options': {
                hideIf: form => {
                  const status = get('highSchool.status', form);
                  return (
                    status === 'discontinued' ||
                    status === 'graduationExpected' ||
                    status === 'neverAttended'
                  );
                },
              },
            },
            postHighSchoolTrainings: merge({}, postHighSchoolTrainingsUi, {
              'ui:options': {
                expandUnder: 'view:hasTrainings',
              },
            }),
          },
          schema: {
            type: 'object',
            properties: {
              highSchool: {
                type: 'object',
                properties: {
                  status: highSchool.properties.status,
                  highSchoolOrGedCompletionDate: date,
                  'view:hasHighSchool': {
                    type: 'object',
                    properties: {
                      name: highSchool.properties.name,
                      city: highSchool.properties.city,
                      state: highSchool.properties.state,
                      dateRange: highSchool.properties.dateRange,
                    },
                  },
                },
              },
              'view:hasTrainings': {
                type: 'boolean',
              },
              postHighSchoolTrainings,
            },
          },
        },
      },
    },
    employmentHistory: {
      title: 'Employment history',
      pages: {
        employmentHistory: {
          ...employmentHistoryPage(fullSchema5490, false),
          depends: formData => !formData.showUpdatedFryDeaApp,
        },
      },
    },
    schoolSelection: {
      title: 'School selection',
      pages: {
        schoolSelection: {
          ...createSchoolSelectionPage(
            fullSchema5490,
            schoolSelectionOptionsFor['5490'],
          ),
          uiSchema: {
            educationProgram: {
              name: {
                'ui:title':
                  'Name of school, university, or training facility you want to attend',
              },
              educationType: {
                'ui:options': {
                  updateSchema: (() => {
                    const edTypes = educationType.enum;
                    // Using reselect here avoids running the filter code
                    // and creating a new object unless either benefit or
                    // relationship has changed
                    const filterEducationType = createSelector(
                      form => get('benefit', form),
                      form => get('relationship', form),
                      (benefitData, relationshipData) => {
                        // Remove tuition top-up
                        const filterOut = ['tuitionTopUp'];
                        // Correspondence not available to Chapter 35 (DEA) children
                        if (
                          benefitData === 'chapter35' &&
                          relationshipData === 'child'
                        ) {
                          filterOut.push('correspondence');
                        }
                        // Flight training available to Chapter 33 (Fry Scholarships) only
                        if (benefitData && benefitData !== 'chapter33') {
                          filterOut.push('flightTraining');
                        }

                        return { enum: without(edTypes, filterOut) };
                      },
                    );

                    return form => filterEducationType(form);
                  })(),
                },
              },
            },
          },
          depends: formData => !formData.showUpdatedFryDeaApp,
        },
      },
    },
    personalInformation: {
      title: 'Personal information',
      pages: {
        contactInformation: {
          ...contactInformationPage(fullSchema5490, 'relativeAddress'),
          depends: formData => !formData.showUpdatedFryDeaApp,
        },
        secondaryContact: {
          title: 'Secondary contact',
          path: 'personal-information/secondary-contact',
          depends: formData => !formData.showUpdatedFryDeaApp,
          initialData: {},
          uiSchema: {
            'ui:title': 'Secondary contact',
            'ui:description':
              'This person should know where you can be reached at all times.',
            secondaryContact: {
              fullName: {
                'ui:title': 'Name',
              },
              phone: phoneUI('Telephone number'),
              sameAddress: {
                'ui:title': 'Address for secondary contact is the same as mine',
              },
              address: merge({}, address.uiSchema(), {
                'ui:options': {
                  hideIf: formData =>
                    get('secondaryContact.sameAddress', formData) === true,
                },
              }),
            },
          },
          schema: {
            type: 'object',
            properties: {
              secondaryContact: {
                type: 'object',
                properties: {
                  fullName: secondaryContact.properties.fullName,
                  phone,
                  sameAddress: secondaryContact.properties.sameAddress,
                  address: address.schema(fullSchema5490),
                },
              },
            },
          },
        },
        directDeposit: {
          ...createDirectDepositPage(fullSchema5490),
          depends: formData => !formData.showUpdatedFryDeaApp,
        },
      },
    },
    /**
     * END OLD CHAPTERS
     */

    /**
     * NEW CHAPTERS
     */
    newApplicantInformationChapter: {
      title: 'Your information',
      pages: {
        [newFormPages.newApplicantInformation]: {
          depends: formData => formData.showUpdatedFryDeaApp,
          title: 'Your information',
          path: 'new/applicant-information/personal-information',
          subTitle: 'Your information',
          instructions:
            'This is the personal information we have on file for you.',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your personal information</h3>
                  <p>
                    This is the personal information we have on file for you. If
                    you notice any errors, please correct them now. Any updates
                    you make will change the information for your education
                    benefits only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to update your personal
                    information for other VA benefits, you can do that from your
                    profile.
                  </p>
                  <p className="vads-u-margin-bottom--3">
                    <GoToYourProfileLink />
                  </p>
                </>
              ),
            },
            [newFormFields.newUserFullName]: {
              ...fullNameUI,
              first: {
                ...fullNameUI.first,
                'ui:title': 'Your first name',
                'ui:validations': [
                  (errors, field) => {
                    if (isOnlyWhitespace(field)) {
                      errors.addError('Please enter a first name');
                    }
                  },
                ],
              },
              last: {
                ...fullNameUI.last,
                'ui:title': 'Your last name',
                'ui:validations': [
                  (errors, field) => {
                    if (isOnlyWhitespace(field)) {
                      errors.addError('Please enter a last name');
                    }
                  },
                ],
              },
              middle: {
                ...fullNameUI.middle,
                'ui:title': 'Your middle name',
              },
            },
            [newFormFields.newDateOfBirth]: {
              ...currentOrPastDateUI('Your date of birth'),
            },
          },
          schema: {
            type: 'object',
            required: [newFormFields.newDateOfBirth],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [newFormFields.newUserFullName]: {
                ...fullName,
                properties: {
                  ...fullName.properties,
                  middle: {
                    ...fullName.properties.middle,
                    maxLength: 30,
                  },
                },
              },
              [newFormFields.newDateOfBirth]: date,
              'view:dateOfBirthUnder18Alert': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
    newVeteranServiceMember: {
      title: 'Veteran and service member information',
      pages: {
        [newFormPages.chooseServiceMember]: {
          title: 'Veteran and service member information',
          path: 'new/choose-veteran-or-service-member',
          depends: formData => formData.showUpdatedFryDeaApp,
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Choose your Veteran or service member</h3>
                  <p>
                    Based on Department of Defense records, these are the
                    Veterans and service members we have on file related to you,
                    as well as the associated eduacational benefits you may be
                    eligible for.
                  </p>
                  <RelatedVeterans />
                </>
              ),
            },
            [newFormFields.firstSponsor]: {
              'ui:title':
                'Which sponsor’s benefits would you like to use first?',
              // 'ui:widget': FirstSponsorRadioGroup,
              // 'ui:reviewWidget': FirstSponsorReviewField,
              'ui:errorMessages': {
                required: 'Please select at least one sponsor',
              },
            },
            'view:firstSponsorAdditionalInfo': {
              'ui:description': (
                <va-additional-info
                  trigger="Which sponsor should I use first?"
                  class="vads-u-margin-bottom--4"
                >
                  <p className="vads-u-margin-top--0">
                    Though unlikely, you may need to consider differences in the
                    amount of benefits each sponsor offers and when they expire.
                    Benefits from other sponsors can be used after your first
                    sponsor’s benefits expire.
                  </p>
                  <p className="vads-u-margin-bottom--0">
                    If you choose “I’m not sure,” or if there are additional
                    things to consider regarding your sponsors, a VA
                    representative will reach out to help you decide.
                  </p>
                </va-additional-info>
              ),
            },
          },
          schema: {
            type: 'object',
            required: [newFormFields.firstSponsor],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [newFormFields.firstSponsor]: {
                type: 'string',
              },
              'view:firstSponsorAdditionalInfo': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        [newFormPages.newSponsorInformation]: {
          title: 'Enter your sponsor’s info',
          path: 'new/sponsor/information',
          depends: formData =>
            formData.showUpdatedFryDeaApp &&
            (!formData.sponsors?.sponsors?.length ||
              formData.sponsors?.someoneNotListed),
          uiSchema: {
            'view:noSponsorWarning': {
              'ui:description': (
                <va-alert
                  close-btn-aria-label="Close notification"
                  status="warning"
                  visible
                >
                  <h3 slot="headline">
                    We do not have any sponsor information on file
                  </h3>
                  <p>
                    If you think this is incorrect, reach out to your sponsor so
                    they can{' '}
                    <a href="https://myaccess.dmdc.osd.mil/identitymanagement/authenticate.do?execution=e3s1">
                      update this information on the DoD milConnect website
                    </a>
                    .
                  </p>
                  <p>
                    You may still continue this application and enter your
                    sponsor information manually.
                  </p>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => formData.sponsors?.sponsors?.length,
              },
            },
            'view:sponsorNotOnFileWarning': {
              'ui:description': (
                <va-alert
                  close-btn-aria-label="Close notification"
                  status="warning"
                  visible
                >
                  <h3 slot="headline">
                    One of your selected sponsors is not on file
                  </h3>
                  <p>
                    If you think this is incorrect, reach out to your sponsor so
                    they can{' '}
                    <a href="https://myaccess.dmdc.osd.mil/identitymanagement/authenticate.do?execution=e3s1">
                      update this information on the DoD milConnect website
                    </a>
                    .
                  </p>
                  <p>
                    You may still continue this application and enter your
                    sponsor information manually.
                  </p>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => !formData.sponsors?.sponsors?.length,
              },
            },
            [newFormFields.newRelationshipToServiceMember]: {
              'ui:title':
                'What’s your relationship to the service member whose benefit has been transferred to you?',
              'ui:widget': 'radio',
            },
            [newFormFields.newSponsorFullName]: {
              ...fullNameUI,
              first: {
                ...fullNameUI.first,
                'ui:title': 'Your sponsor’s first name',
                'ui:validations': [
                  (errors, field) =>
                    addWhitespaceOnlyError(
                      field,
                      errors,
                      'Please enter a first name',
                    ),
                ],
              },
              last: {
                ...fullNameUI.last,
                'ui:title': 'Your sponsor’s last name',
                'ui:validations': [
                  (errors, field) =>
                    addWhitespaceOnlyError(
                      field,
                      errors,
                      'Please enter a last name',
                    ),
                ],
              },
              middle: {
                ...fullNameUI.middle,
                'ui:title': 'Your sponsor’s middle name',
              },
            },
            [newFormFields.newSponsorDateOfBirth]: {
              ...currentOrPastDateUI('Your sponsor’s date of birth'),
            },
          },
          schema: {
            type: 'object',
            required: [
              newFormFields.newRelationshipToServiceMember,
              newFormFields.newSponsorDateOfBirth,
            ],
            properties: {
              'view:noSponsorWarning': {
                type: 'object',
                properties: {},
              },
              'view:sponsorNotOnFileWarning': {
                type: 'object',
                properties: {},
              },
              [newFormFields.newRelationshipToServiceMember]: {
                type: 'string',
                enum: [RELATIONSHIP.SPOUSE, RELATIONSHIP.CHILD],
              },
              [newFormFields.newSponsorFullName]: {
                ...fullName,
                required: ['first', 'last'],
                properties: {
                  ...fullName.properties,
                  middle: {
                    ...fullName.properties.middle,
                    maxLength: 30,
                  },
                },
              },
              [newFormFields.newSponsorDateOfBirth]: date,
            },
          },
        },
      },
    },
    newBenefitSelection: {
      title: 'Benefit selection',
      pages: {
        [newFormPages.benefitSelection]: {
          title: 'Benefit Selection',
          path: 'new/benefit-selection',
          depends: formData => formData.showUpdatedFryDeaApp,
          uiSchema: {
            // 'view:noSponsorWarning': {
            //   'ui:description': (
            //     <va-alert
            //       close-btn-aria-label="Close notification"
            //       status="warning"
            //       visible
            //     >
            //       <h3 slot="headline">
            //         We do not have any sponsor information on file
            //       </h3>
            //       <p>
            //         If you think this is incorrect, reach out to your sponsor so
            //         they can{' '}
            //         <a href="https://myaccess.dmdc.osd.mil/identitymanagement/authenticate.do?execution=e3s1">
            //           update this information on the DoD milConnect website
            //         </a>
            //         .
            //       </p>
            //       <p>
            //         You may still continue this application and enter your
            //         sponsor information manually.
            //       </p>
            //     </va-alert>
            //   ),
            //   'ui:options': {
            //     hideIf: formData => formData.sponsors?.sponsors?.length,
            //   },
            // },
            // 'view:sponsorNotOnFileWarning': {
            //   'ui:description': (
            //     <va-alert
            //       close-btn-aria-label="Close notification"
            //       status="warning"
            //       visible
            //     >
            //       <h3 slot="headline">
            //         One of your selected sponsors is not on file
            //       </h3>
            //       <p>
            //         If you think this is incorrect, reach out to your sponsor so
            //         they can{' '}
            //         <a href="https://myaccess.dmdc.osd.mil/identitymanagement/authenticate.do?execution=e3s1">
            //           update this information on the DoD milConnect website
            //         </a>
            //         .
            //       </p>
            //       <p>
            //         You may still continue this application and enter your
            //         sponsor information manually.
            //       </p>
            //     </va-alert>
            //   ),
            //   'ui:options': {
            //     hideIf: formData => !formData.sponsors?.sponsors?.length,
            //   },
            // },
            // [newFormFields.newRelationshipToServiceMember]: {
            //   'ui:title':
            //     'What’s your relationship to the service member whose benefit has been transferred to you?',
            //   'ui:widget': 'radio',
            // },
            // [newFormFields.newSponsorFullName]: {
            //   ...fullNameUI,
            //   first: {
            //     ...fullNameUI.first,
            //     'ui:title': 'Your sponsor’s first name',
            //     'ui:validations': [
            //       (errors, field) =>
            //         addWhitespaceOnlyError(
            //           field,
            //           errors,
            //           'Please enter a first name',
            //         ),
            //     ],
            //   },
            //   last: {
            //     ...fullNameUI.last,
            //     'ui:title': 'Your sponsor’s last name',
            //     'ui:validations': [
            //       (errors, field) =>
            //         addWhitespaceOnlyError(
            //           field,
            //           errors,
            //           'Please enter a last name',
            //         ),
            //     ],
            //   },
            //   middle: {
            //     ...fullNameUI.middle,
            //     'ui:title': 'Your sponsor’s middle name',
            //   },
            // },
            // [newFormFields.newSponsorDateOfBirth]: {
            //   ...currentOrPastDateUI('Your sponsor’s date of birth'),
            // },
          },
          schema: {
            type: 'object',
            required: [
              // newFormFields.newRelationshipToServiceMember,
              // newFormFields.newSponsorDateOfBirth,
            ],
            properties: {
              // 'view:noSponsorWarning': {
              //   type: 'object',
              //   properties: {},
              // },
              // 'view:sponsorNotOnFileWarning': {
              //   type: 'object',
              //   properties: {},
              // },
              // [newFormFields.newRelationshipToServiceMember]: {
              //   type: 'string',
              //   enum: [SPONSOR_RELATIONSHIP.SPOUSE, SPONSOR_RELATIONSHIP.CHILD],
              // },
              // [newFormFields.newSponsorFullName]: {
              //   ...fullName,
              //   required: ['first', 'last'],
              //   properties: {
              //     ...fullName.properties,
              //     middle: {
              //       ...fullName.properties.middle,
              //       maxLength: 30,
              //     },
              //   },
              // },
              // [newFormFields.newSponsorDateOfBirth]: date,
            },
          },
        },
      },
    },
    newHighSchool: {
      title: 'Sponsor information',
      pages: {
        [newFormPages.newVerifyHighSchool]: {
          title: 'Verify your high school education',
          path: 'new/child/high-school-education',
          depends: formData =>
            formData.showUpdatedFryDeaApp &&
            applicantIsChildOfSponsor(formData),
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Verify your high school education</h3>
                  <va-alert
                    close-btn-aria-label="Close notification"
                    status="info"
                    visible
                  >
                    <h3 slot="headline">We need additional information</h3>
                    <div>
                      Since you indicated that you are the child of your
                      sponsor, please include information about your high school
                      education.
                    </div>
                  </va-alert>
                </>
              ),
            },
            [newFormFields.newHighSchoolDiploma]: {
              'ui:title':
                'Did you earn a high school diploma or equivalency certificate?',
              'ui:widget': 'radio',
            },
          },
          schema: {
            type: 'object',
            required: [newFormFields.newHighSchoolDiploma],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [newFormFields.newHighSchoolDiploma]: {
                type: 'string',
                enum: ['Yes', 'No'],
              },
            },
          },
        },
        [newFormPages.newSponsorHighSchool]: {
          title: 'Verify your high school graduation date',
          path: 'new/sponsor/high-school-education',
          depends: formData =>
            formData.showUpdatedFryDeaApp &&
            applicantIsChildOfSponsor(formData) &&
            formData[newFormFields.newHighSchoolDiploma] === 'Yes',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Verify your high school education</h3>
                  <va-alert
                    close-btn-aria-label="Close notification"
                    status="info"
                    visible
                  >
                    <h3 slot="headline">We need additional information</h3>
                    <div>
                      Since you indicated that you are the child of your
                      sponsor, please include information about your high school
                      education.
                    </div>
                  </va-alert>
                </>
              ),
            },
            [newFormFields.newHighSchoolDiplomaDate]: {
              ...currentOrPastDateUI(
                'When did you earn your high school diploma or equivalency certificate?',
              ),
            },
          },
          schema: {
            type: 'object',
            required: [newFormFields.newHighSchoolDiplomaDate],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [newFormFields.newHighSchoolDiplomaDate]: date,
            },
          },
        },
      },
    },
    // Mariage chapter
    // Outstanding felony chapter
    newContactInformationChapter: {
      title: 'Contact information',
      pages: {
        [newFormPages.newContactInformation.newContactInformation]: {
          depends: formData => formData.showUpdatedFryDeaApp,
          title: 'Phone numbers and email address',
          path: 'new/contact-information/email-phone',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your phone numbers and email address</h3>
                  <div className="meb-list-label">
                    <strong>We’ll use this information to:</strong>
                  </div>
                  <ul>
                    <li>
                      Contact you if we have questions about your application
                    </li>
                    <li>Tell you important information about your benefits</li>
                  </ul>
                  <p>
                    This is the contact information we have on file for you. If
                    you notice any errors, please correct them now. Any updates
                    you make will change the information for your education
                    benefits only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to update your contact
                    information for other VA benefits, you can do that from your
                    profile.
                  </p>
                  <p>
                    <GoToYourProfileLink />
                  </p>
                </>
              ),
            },
            [newFormFields.newViewPhoneNumbers]: {
              'ui:description': (
                <>
                  <h4 className="form-review-panel-page-header vads-u-font-size--h5 fry-dea-review-page-only">
                    Phone numbers and email addresss
                  </h4>
                  <p className="fry-dea-review-page-only">
                    If you’d like to update your phone numbers and email
                    address, please edit the form fields below.
                  </p>
                </>
              ),
              ...phoneUISchema(
                'mobile',
                newFormFields.newMobilePhoneNumber,
                newFormFields.newMobilePhoneNumberInternational,
              ),
              ...phoneUISchema(
                'home',
                newFormFields.newPhoneNumber,
                newFormFields.newPhoneNumberInternational,
              ),
            },
            [newFormFields.newEmail]: {
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: EmailViewField,
              },
              [newFormFields.newEmail]: {
                ...emailUI('Email address'),
                'ui:validations': [validateEmail],
                'ui:reviewField': EmailReviewField,
              },
              [newFormFields.newConfirmEmail]: {
                ...emailUI('Confirm email address'),
                'ui:options': {
                  ...emailUI()['ui:options'],
                  hideOnReview: true,
                },
              },
              'ui:validations': [
                (errors, field) => {
                  if (
                    field[newFormFields.newEmail] !==
                    field[newFormFields.newConfirmEmail]
                  ) {
                    errors[newFormFields.newConfirmEmail].addError(
                      'Sorry, your emails must match',
                    );
                  }
                },
              ],
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [newFormFields.newViewPhoneNumbers]: {
                type: 'object',
                properties: {
                  [newFormFields.newMobilePhoneNumber]: phoneSchema(),
                  [newFormFields.newMobilePhoneNumberInternational]: {
                    type: 'boolean',
                  },
                  [newFormFields.newPhoneNumber]: phoneSchema(),
                  [newFormFields.newPhoneNumberInternational]: {
                    type: 'boolean',
                  },
                },
              },
              [newFormFields.newEmail]: {
                type: 'object',
                required: [
                  newFormFields.newEmail,
                  newFormFields.newConfirmEmail,
                ],
                properties: {
                  [newFormFields.newEmail]: email,
                  [newFormFields.newConfirmEmail]: email,
                },
              },
            },
          },
        },
        [newFormPages.newContactInformation.newMailingAddress]: {
          depends: formData => formData.showUpdatedFryDeaApp,
          title: 'Mailing address',
          path: 'new/contact-information/mailing-address',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your mailing address</h3>
                  <p>
                    We’ll send any important information about your application
                    to this address.
                  </p>
                  <p>
                    This is the mailing address we have on file for you. If you
                    notice any errors, please correct them now. Any updates you
                    make will change the information for your education benefits
                    only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to update your personal
                    information for other VA benefits, you can do that from your
                    profile.
                  </p>
                  <p className="vads-u-margin-bottom--4">
                    <GoToYourProfileLink />
                  </p>
                </>
              ),
            },
            'view:mailingAddress': {
              'ui:description': (
                <>
                  <h4 className="form-review-panel-page-header vads-u-font-size--h5 fry-dea-review-page-only">
                    Mailing address
                  </h4>
                  <p className="fry-dea-review-page-only">
                    If you’d like to update your mailing address, please edit
                    the form fields below.
                  </p>
                </>
              ),
              livesOnMilitaryBase: {
                'ui:title': (
                  <span id="LiveOnMilitaryBaseTooltip">
                    I live on a United States military base outside of the
                    country
                  </span>
                ),
                'ui:reviewField': YesNoReviewField,
              },
              livesOnMilitaryBaseInfo: {
                'ui:description': (
                  <va-additional-info
                    trigger="Learn more about military base addresses"
                    class="vads-u-margin-top--4"
                  >
                    <p>
                      U.S. military bases are considered a domestic address and
                      a part of the United States.
                    </p>
                  </va-additional-info>
                ),
              },
              [newFormFields.newAddress]: {
                ...address.uiSchema(''),
                street: {
                  'ui:title': 'Street address',
                  'ui:errorMessages': {
                    required: 'Please enter your full street address',
                  },
                  'ui:validations': [
                    (errors, field) => {
                      if (isOnlyWhitespace(field)) {
                        errors.addError(
                          'Please enter your full street address',
                        );
                      }
                    },
                  ],
                },
                city: {
                  'ui:title': 'City',
                  'ui:errorMessages': {
                    required: 'Please enter a valid city',
                  },
                  'ui:validations': [
                    (errors, field) => {
                      if (isOnlyWhitespace(field)) {
                        errors.addError('Please enter a valid city');
                      }
                    },
                  ],
                },
                state: {
                  'ui:title': 'State/Province/Region',
                  'ui:errorMessages': {
                    required: 'State is required',
                  },
                },
                postalCode: {
                  'ui:title': 'Postal Code (5-digit)',
                  'ui:errorMessages': {
                    required: 'Zip code must be 5 digits',
                  },
                },
              },
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: MailingAddressViewField,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              'view:mailingAddress': {
                type: 'object',
                properties: {
                  livesOnMilitaryBase: {
                    type: 'boolean',
                  },
                  livesOnMilitaryBaseInfo: {
                    type: 'object',
                    properties: {},
                  },
                  [newFormFields.newAddress]: {
                    ...address.schema(fullSchema5490, true),
                  },
                },
              },
            },
          },
        },
        [newFormPages.newContactInformation.newPreferredContactMethod]: {
          depends: formData => formData.showUpdatedFryDeaApp,
          title: 'Contact preferences',
          path: 'new/contact-information/contact-preferences',
          uiSchema: {
            'view:contactMethodIntro': {
              'ui:description': (
                <>
                  <h3 className="fry-dea-form-page-only">
                    Choose your contact method for follow-up questions
                  </h3>
                </>
              ),
            },
            [newFormFields.newContactMethod]: {
              'ui:title':
                'How should we contact you if we have questions about your application?',
              'ui:widget': 'radio',
              'ui:errorMessages': {
                required: 'Please select at least one way we can contact you.',
              },
              'ui:options': {
                updateSchema: (() => {
                  const filterContactMethods = createSelector(
                    form =>
                      form[newFormFields.newViewPhoneNumbers][
                        newFormFields.newMobilePhoneNumber
                      ]?.phone,
                    form =>
                      form[newFormFields.newViewPhoneNumbers][
                        newFormFields.newPhoneNumber
                      ]?.phone,
                    (mobilePhoneNumber, homePhoneNumber) => {
                      const invalidContactMethods = [];
                      if (!mobilePhoneNumber) {
                        invalidContactMethods.push('Mobile Phone');
                      }
                      if (!homePhoneNumber) {
                        invalidContactMethods.push('Home Phone');
                      }

                      return {
                        enum: contactMethods.filter(
                          method => !invalidContactMethods.includes(method),
                        ),
                      };
                    },
                  );
                  return form => filterContactMethods(form);
                })(),
              },
            },
            'view:receiveTextMessages': {
              'ui:description': (
                <>
                  <div className="fry-dea-form-page-only">
                    <h3>Choose how you want to get notifications</h3>
                    <p>
                      We recommend that you opt in to text message notifications
                      about your benefits. These include notifications that
                      prompt you to verify your enrollment so you’ll receive
                      your education payments. This is an easy way to verify
                      your monthly enrollment.
                    </p>
                    <va-alert status="info">
                      <>
                        If you choose to get text message notifications from
                        VA’s GI Bill program, message and data rates may apply.
                        Two messages per month. At this time, we can only send
                        text messages to U.S. mobile phone numbers. Text STOP to
                        opt out or HELP for help.{' '}
                        <a
                          href="https://benefits.va.gov/gibill/isaksonroe/verification_of_enrollment.asp"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          View Terms and Conditions and Privacy Policy.
                        </a>
                      </>
                    </va-alert>
                  </div>
                </>
              ),
              [newFormFields.newReceiveTextMessages]: {
                'ui:title':
                  'Would you like to receive text message notifications on your education benefits?',
                'ui:widget': 'radio',
                'ui:validations': [
                  (errors, field, formData) => {
                    const isYes = field.slice(0, 4).includes('Yes');
                    const phoneExists = !!formData[
                      newFormFields.newViewPhoneNumbers
                    ][newFormFields.newMobilePhoneNumber].phone;
                    const isInternational =
                      formData[newFormFields.newViewPhoneNumbers][
                        newFormFields.newMobilePhoneNumberInternational
                      ];

                    if (isYes) {
                      if (!phoneExists) {
                        errors.addError(
                          'You can’t select that response because we don’t have a mobile phone number on file for you.',
                        );
                      } else if (isInternational) {
                        errors.addError(
                          'You can’t select that response because you have an international mobile phone number',
                        );
                      }
                    }
                  },
                ],
                'ui:options': {
                  widgetProps: {
                    Yes: { 'data-info': 'yes' },
                    No: { 'data-info': 'no' },
                  },
                  selectedProps: {
                    Yes: { 'aria-describedby': 'yes' },
                    No: { 'aria-describedby': 'no' },
                  },
                },
              },
            },
            'view:noMobilePhoneAlert': {
              'ui:description': (
                <va-alert status="warning">
                  <>
                    You can’t choose to get text message notifications because
                    we don’t have a mobile phone number on file for you.
                  </>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData =>
                  isValidPhone(
                    formData[newFormFields.newViewPhoneNumbers][
                      newFormFields.newMobilePhoneNumber
                    ].phone,
                  ) ||
                  formData[newFormFields.newViewPhoneNumbers][
                    newFormFields.newMobilePhoneNumberInternational
                  ],
              },
            },
            'view:internationalTextMessageAlert': {
              'ui:description': (
                <va-alert status="warning">
                  <>
                    You can’t choose to get text notifications because you have
                    an international mobile phone number. At this time, we can
                    send text messages about your education benefits to U.S.
                    mobile phone numbers.
                  </>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData =>
                  !isValidPhone(
                    formData[newFormFields.newViewPhoneNumbers][
                      newFormFields.newMobilePhoneNumber
                    ].phone,
                  ) ||
                  !formData[newFormFields.newViewPhoneNumbers][
                    newFormFields.newMobilePhoneNumberInternational
                  ],
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:contactMethodIntro': {
                type: 'object',
                properties: {},
              },
              [newFormFields.newContactMethod]: {
                type: 'string',
                enum: contactMethods,
              },
              'view:receiveTextMessages': {
                type: 'object',
                required: [newFormFields.newReceiveTextMessages],
                properties: {
                  [newFormFields.newReceiveTextMessages]: {
                    type: 'string',
                    enum: [
                      'Yes, send me text message notifications',
                      'No, just send me email notifications',
                    ],
                  },
                },
              },
              'view:noMobilePhoneAlert': {
                type: 'object',
                properties: {},
              },
              'view:internationalTextMessageAlert': {
                type: 'object',
                properties: {},
              },
            },
            required: [newFormFields.newContactMethod],
          },
        },
      },
    },
    bankAccountInfoChapter: {
      title: 'Direct deposit',
      pages: {
        [newFormPages.newDirectDeposit]: {
          depends: formData => formData.showUpdatedFryDeaApp,
          path: 'new/direct-deposit',
          uiSchema: {
            'ui:description': (
              <p className="vads-u-margin-bottom--4">
                <strong>Note</strong>: VA makes payments only through direct
                deposit, also called electronic funds transfer (EFT).
              </p>
            ),
            [newFormFields.newBankAccount]: {
              ...bankAccountUI,
              'ui:order': ['accountType', 'accountNumber', 'routingNumber'],
              accountType: {
                ...bankAccountUI.accountType,
                'ui:errorMessages': {
                  required: 'Please select an account type',
                },
              },
              accountNumber: {
                ...bankAccountUI.accountNumber,
                'ui:validations': [
                  (errors, field) => {
                    if (!isAlphaNumeric(field)) {
                      errors.addError('Please enter a valid account number');
                    }
                  },
                ],
              },
            },
            'view:directDepositLearnMore': {
              'ui:description': (
                <va-additional-info trigger="Where can I find these numbers?">
                  <img
                    key="check-image-src"
                    src={checkImageSrc}
                    alt="Example of a check showing where the account and routing numbers are"
                  />
                  <p>
                    The bank routing number is the first 9 digits on the bottom
                    left corner of a printed check. Your account number is the
                    second set of numbers on the bottom of a printed check, just
                    to the right of the bank routing number.
                  </p>
                </va-additional-info>
              ),
            },
          },
          schema: {
            type: 'object',
            properties: {
              [newFormFields.newBankAccount]: {
                type: 'object',
                required: ['accountType', 'routingNumber', 'accountNumber'],
                properties: {
                  accountType: {
                    type: 'string',
                    enum: ['checking', 'savings'],
                  },
                  routingNumber: {
                    type: 'string',
                    pattern: '^\\d{9}$',
                  },
                  accountNumber: {
                    type: 'string',
                  },
                },
              },
              'view:directDepositLearnMore': {
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
