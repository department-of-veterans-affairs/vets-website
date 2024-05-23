import { merge, omit } from 'lodash';
import get from 'platform/utilities/data/get';

import fullSchema5490 from 'vets-json-schema/dist/22-5490-schema.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import * as personId from 'platform/forms/definitions/personId';
import fullNameUi from 'platform/forms/definitions/fullName';
import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import createNonRequiredFullName from 'platform/forms/definitions/nonRequiredFullName';
import PreSubmitInfo from '../containers/PreSubmitInfo';
import {
  benefitsRelinquishedInfo,
  benefitsRelinquishedWarning,
  benefitsDisclaimerChild,
  benefitsDisclaimerSpouse,
  relationshipAndChildTypeLabels,
  transform,
} from '../helpers';

import { urlMigration } from '../../config/migrations';

import { survivorBenefitsLabels } from '../../utils/labels';

import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';

import contactInformationPage from '../../pages/contactInformation';
// import createDirectDepositPage5490 from '../content/directDeposit';
import applicantInformationUpdate from '../components/applicantInformationUpdate';
import GuardianInformation from '../components/GuardianInformation';
import applicantServicePage from '../../pages/applicantService';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import benefitSelectionWarning from '../components/BenefitSelectionWarning';

import manifest from '../manifest.json';
import createDirectDepositPageUpdate from '../content/directDepositUpdate';

const {
  benefit,
  benefitsRelinquishedDate,
  currentlyActiveDuty,
  currentSameAsPrevious,
  outstandingFelony,
  previousBenefits,
  serviceBranch,
  sponsorStatus,
  spouseInfo,
  veteranDateOfBirth,
  veteranDateOfDeath,
} = fullSchema5490.properties;

const {
  date,
  dateRange,
  educationType,
  fullName,
  vaFileNumber,
  phone,
  ssn,
} = fullSchema5490.definitions;

const nonRequiredFullName = createNonRequiredFullName(fullName);

const relationshipEqualToSpouse = (myGet, formData) => {
  return myGet('relationshipAndChildType', formData) === 'spouse';
};

const relationshipNotEqualToSpouse = (myGet, formData) => {
  return myGet('relationshipAndChildType', formData) !== 'spouse';
};

const relationshipEqualToChild = (myGet, formData) => {
  return (
    myGet('relationshipAndChildType', formData) === 'adopted' ||
    myGet('relationshipAndChildType', formData) === 'biological' ||
    myGet('relationshipAndChildType', formData) === 'step'
  );
};

const relationshipNotEqualToChild = (myGet, formData) => {
  return (
    myGet('relationshipAndChildType', formData) !== 'adopted' ||
    myGet('relationshipAndChildType', formData) !== 'biological' ||
    myGet('relationshipAndChildType', formData) !== 'step'
  );
};

const getRelationship = (myGet, formData) => {
  return myGet('relationshipAndChildType', formData);
};

const removeAdditionalBenefit = () => {
  return {
    applicantInformation: applicantInformationUpdate(fullSchema5490, {
      labels: {
        relationshipAndChildType: relationshipAndChildTypeLabels,
      },
    }),
    applicantService: applicantServicePage(fullSchema5490),
  };
};

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
    phone,
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: removeAdditionalBenefit(),
    },
    benefitSelection: {
      title: 'Benefits eligibility',
      pages: {
        benefitSelection: {
          title: 'Benefits eligibility',
          path: 'benefits/eligibility',
          initialData: {},
          uiSchema: {
            'ui:title': 'Benefit selection',
            'view:benefitsDisclaimerChild': {
              'ui:description': benefitsDisclaimerChild,
              'ui:options': {
                hideIf: form => relationshipNotEqualToChild(get, form),
              },
            },
            'view:benefitsDisclaimerSpouse': {
              'ui:description': benefitsDisclaimerSpouse,
              'ui:options': {
                hideIf: form => relationshipNotEqualToSpouse(get, form),
              },
            },
            benefit: {
              'ui:widget': 'radio',
              'ui:title': 'Select the benefit that is the best match for you:',
              'ui:options': {
                labels: survivorBenefitsLabels,
                updateSchema: (form, schema, uiSchema) => {
                  const relationship = getRelationship(get, form);
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
            restorativeTraining: {
              'ui:title':
                ' Are you looking for Special Restorative Training because of a disability? Special Restorative Training could include speech and voice therapy, language retraining, lip reading, or Braille reading and writing.',
              'ui:widget': 'yesNo',
            },
            vocationalTraining: {
              'ui:title':
                'Are you looking for Special Vocational Training or specialized courses because a disability prevents you from pursuing an education program?',
              'ui:widget': 'yesNo',
            },
            educationalCounseling: {
              'ui:title':
                'Would you like to get vocational and educational counseling?',
              'ui:widget': 'yesNo',
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
              restorativeTraining: {
                type: 'boolean',
              },
              vocationalTraining: {
                type: 'boolean',
              },
              educationalCounseling: {
                type: 'boolean',
              },
            },
          },
        },
        benefitRelinquishment: {
          title: 'Benefits relinquishment',
          path: 'benefits/relinquishment',
          initialData: {},
          depends: {
            relationship: 'child',
          },
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
          uiSchema: {
            spouseInfo: {
              marriageDate: {
                ...dateUI('Date of marriage'),
                'ui:title': 'Date of marriage',
                'ui:required': formData =>
                  relationshipEqualToSpouse(get, formData),
              },
              divorcePending: {
                'ui:title':
                  'Is there a divorce or annulment pending with your sponsor?',
                'ui:widget': 'yesNo',
                'ui:required': formData =>
                  relationshipEqualToSpouse(get, formData),
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
                hideIf: formData => relationshipNotEqualToSpouse(get, formData),
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
                  relationshipEqualToSpouse(get, formData),
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
                  relationshipEqualToChild(get, formData),
              },
            },
            'view:sponsorDateOfDeath': {
              ...currentOrPastDateUI('Sponsor’s date of death'),
              'ui:options': {
                expandUnder: 'sponsorStatus',
                expandUnderCondition: status => status && status !== 'powOrMia',
                hideIf: formData =>
                  get('benefit', formData) === 'chapter35' ||
                  relationshipEqualToChild(get, formData),
              },
            },
            'view:sponsorDateListedMiaOrPow': {
              ...currentOrPastDateUI('Sponsor’s date listed as MIA or POW'),
              'ui:options': {
                expandUnder: 'sponsorStatus',
                expandUnderCondition: status => status && status === 'powOrMia',
                hideIf: formData =>
                  get('benefit', formData) === 'chapter35' ||
                  relationshipEqualToChild(get, formData),
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

    personalInformation: {
      title: 'Personal information',
      pages: {
        contactInformation: contactInformationPage(
          fullSchema5490,
          'relativeAddress',
        ),
        directDeposit: createDirectDepositPageUpdate(),
      },
    },
    GuardianInformation: {
      title: 'Guardian information',
      pages: {
        guardianInformation: GuardianInformation(fullSchema5490, {}),
      },
    },
  },
};

export default formConfig;
