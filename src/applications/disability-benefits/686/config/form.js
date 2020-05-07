import { createSelector } from 'reselect';
import _ from 'lodash/fp';

import ErrorText from '../../components/ErrorText';
import fullSchema686 from 'vets-json-schema/dist/21-686C-schema.json';
import ArrayCountWidget from 'platform/forms-system/src/js/widgets/ArrayCountWidget';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

import FormFooter from 'platform/forms/components/FormFooter';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import fullNameUI from 'platform/forms/definitions/fullName';
import dataUtils from 'platform/utilities/data/index';
import environment from 'platform/utilities/environment';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../../components/GetFormHelp.jsx';
import SpouseMarriageTitle from '../components/SpouseMarriageTitle';
import DependentField from '../components/DependentField';
import createHouseholdMemberTitle from '../components/DisclosureTitle';

import {
  calculateChildAge,
  childRelationshipStatusLabels,
  dependentsMinItem,
  disableWarning,
  getMarriageTitleWithCurrent,
  getSpouseMarriageTitle,
  hasBeenMarried,
  isCurrentMarriage,
  isDomesticAddress,
  isInternationalAddressText,
  isMarried,
  isMilitaryAddress,
  isNotCurrentMarriage,
  isNotInternationalAddressText,
  isNotLivingWithParent,
  isNotLivingWithSpouse,
  isNotMilitaryAddress,
  isUSAAddress,
  schoolAttendanceWarning,
  separationReasons,
  transform,
  VAFileNumberDescription,
} from '../helpers.jsx';

import { validateAfterMarriageDate } from '../validation';
import { get686AuthorizationState } from '../selectors';
import { verifyDisabilityRating } from '../actions';
import AuthorizationMessage from '../components/AuthorizationMessage';

const { get } = dataUtils;

const {
  currentMarriage,
  dependents,
  maritalStatus,
  veteranFullName,
  veteranSocialSecurityNumber,
} = fullSchema686.properties;

const {
  date,
  domesticAddress,
  fullName,
  internationalAddressText,
  location,
  militaryAddress,
  postalCode,
  previousMarriages,
  marriages: marriagesDefinition,
  ssn,
  vaFileNumber,
} = fullSchema686.definitions;

const {
  liveWithSpouse,
  spouseDateOfBirth,
  spouseIsVeteran,
  spouseVaFileNumber,
} = currentMarriage.properties;

previousMarriages.items.required = [];
marriagesDefinition.items.required = [];
const marriageProperties = previousMarriages.items.properties;

const MARITAL_STATUS_NEVER_MARRIED = 'NEVERMARRIED';

const reasonForSeparation = {
  type: 'string',
  enum: [
    separationReasons.DEATH,
    separationReasons.DIVORCE,
    separationReasons.OTHER,
  ],
};

const explainSeparation =
  previousMarriages.items.oneOf[1].properties.explainSeparation;

// NOTE: Required fields will be conditionally set via the ui:Schema
// We cannot set required fields directly on the schema because some address
// fields will be hidden and thus break the form silently
const addressSchema = {
  type: 'object',
  properties: {
    countryDropdown: militaryAddress.properties.countryDropdown,
    countryText: internationalAddressText.properties.countryText,
    street: domesticAddress.properties.street,
    street2: domesticAddress.properties.street2,
    street3: domesticAddress.properties.street3,
    city: domesticAddress.properties.city,
    state: domesticAddress.properties.state,
    postOffice: militaryAddress.properties.postOffice,
    postalType: militaryAddress.properties.postalType,
    postalCode: militaryAddress.properties.postalCode,
  },
};

const dependentTypeSchema = {
  type: 'string',
  enum: ['SPOUSE', 'DEPENDENT_PARENT', 'CHILD'],
  enumNames: ['Spouse', 'Dependent Parent', 'Child'],
};

const dependentTypeSchemaUI = {
  'ui:title': "What was your dependent's status?",
  'ui:widget': 'radio',
};

const childStatusSchema = {
  type: 'object',
  properties: {
    childUnder18: {
      type: 'boolean',
    },
    stepChild: {
      type: 'boolean',
    },
    adopted: {
      type: 'boolean',
    },
    disabled: {
      type: 'boolean',
    },
    childOver18InSchool: {
      type: 'boolean',
    },
  },
};

const childStatusUiSchema = {
  'ui:title': "Child's status (Check all that apply)",
  'ui:required': (formData, index) =>
    formData.deaths[`${index}`].dependentType === 'CHILD',
  'ui:options': {
    expandUnder: 'dependentType',
    expandUnderCondition: 'CHILD',
    showFieldLabel: true,
    keepInPageOnReview: true,
  },
  childUnder18: {
    'ui:title': 'Child under 18',
  },
  stepChild: {
    'ui:title': 'Stepchild',
  },
  adopted: {
    'ui:title': 'Adopted child',
  },
  disabled: {
    'ui:title': 'Child incapable of self-support',
  },
  childOver18InSchool: {
    'ui:title': 'Child 18-23 and in school',
  },
};

const deathLocationUiSchema = {
  'ui:title': 'Place of death',
  city: {
    'ui:title': 'City (or APO/FPO/DPO)',
  },
  state: {
    'ui:title': 'State (or Country if outside the USA)',
  },
};
// NOTE: Required fields will be conditionally set via the ui:Schema
// We cannot set required fields directly on the schema because some location
// fields will be hidden and thus break the form silently
const locationSchema = {
  type: 'object',
  required: ['city', 'state'],
  properties: {
    state: {
      type: 'string',
      maxLength: 30,
      pattern: '^(?!\\s)(?!.*?\\s{2,})[^<>%$#@!^&*0-9]+$',
    },
    city: {
      type: 'string',
      maxLength: 30,
      pattern: '^(?!\\s)(?!.*?\\s{2,})[^<>%$#@!^&*0-9]+$',
    },
  },
};

function veteranSeparatedForOtherReason(form, index) {
  return (
    get(`marriages.${index}.view:pastMarriage.reasonForSeparation`, form) ===
    separationReasons.OTHER
  );
}

function spouseSeparatedForOtherReason(form, index) {
  return (
    get(`spouseMarriages.${index}.reasonForSeparation`, form) ===
    separationReasons.OTHER
  );
}

const spouseSelector = createSelector(
  form =>
    form.marriages && form.marriages.length
      ? form.marriages[form.marriages.length - 1].spouseFullName
      : null,
  spouse => spouse,
);

function createSpouseLabelSelector(nameTemplate) {
  return createSelector(spouseSelector, spouseFullName => {
    if (spouseFullName) {
      return {
        title: nameTemplate(spouseFullName),
      };
    }

    return {
      title: null,
    };
  });
}

// given a `key` string that optionally includes the substring `[INDEX]`,
// replace the instance of `[INDEX]` with the passed-in `index` value and return
// the new key
//
// ex: given 'marriages[INDEX].locationOfMarriage' and `0` return
// 'marriages[0].locationOfMarriage'
function insertRealIndexInKey(key, index) {
  return key.replace('[INDEX]', `[${index}]`);
}

// pass in the key so the address we care about can be pulled out of the
// entire formData object
function createAddressUISchemaForKey(key, isRequiredCallback = () => true) {
  return {
    countryDropdown: {
      'ui:title': 'Country',
      'ui:required': isRequiredCallback,
    },
    countryText: {
      'ui:title': 'Enter Country',
      'ui:required': (formData, index) =>
        isInternationalAddressText(
          get(`${insertRealIndexInKey(key, index)}`, formData),
        ),
      'ui:options': {
        hideIf: (formData, index) =>
          isNotInternationalAddressText(
            get(`${insertRealIndexInKey(key, index)}`, formData),
          ),
      },
    },
    street: {
      'ui:title': 'Street',
      'ui:required': isRequiredCallback,
      'ui:errorMessages': {
        required: 'Please enter a street address',
      },
    },
    street2: {
      'ui:title': 'Line 2',
    },
    street3: {
      'ui:title': 'Line 3',
    },
    city: {
      'ui:title': 'City',
      'ui:required': isRequiredCallback,
      'ui:errorMessages': {
        required: 'Please enter a city',
      },
    },
    state: {
      'ui:title': 'State',
      'ui:required': (formData, index) =>
        isDomesticAddress(get(`${insertRealIndexInKey(key, index)}`, formData)),
      'ui:errorMessages': {
        required: 'Please enter a state',
      },
      'ui:options': {
        hideIf: (formData, index) =>
          !isUSAAddress(get(`${insertRealIndexInKey(key, index)}`, formData)),
      },
    },
    postOffice: {
      'ui:title': 'Post Office',
      'ui:required': (formData, index) =>
        isMilitaryAddress(get(`${insertRealIndexInKey(key, index)}`, formData)),
      'ui:errorMessages': {
        pattern: 'Please enter a valid post office',
        required: 'Please enter a post office ',
      },
      'ui:options': {
        hideIf: (formData, index) =>
          isNotMilitaryAddress(
            get(`${insertRealIndexInKey(key, index)}`, formData),
          ),
      },
    },
    postalType: {
      'ui:title': 'Postal Type',
      'ui:required': (formData, index) =>
        isMilitaryAddress(get(`${insertRealIndexInKey(key, index)}`, formData)),
      'ui:errorMessages': {
        pattern: 'Please enter a valid postal type',
        required: 'Please enter a postal type',
      },
      'ui:options': {
        hideIf: (formData, index) =>
          isNotMilitaryAddress(
            get(`${insertRealIndexInKey(key, index)}`, formData),
          ),
      },
    },
    postalCode: {
      'ui:title': 'Postal Code',
      'ui:required': (formData, index) =>
        isUSAAddress(get(`${insertRealIndexInKey(key, index)}`, formData)),
      'ui:errorMessages': {
        pattern: 'Please enter a valid postal code',
        required: 'Please enter a postal code',
      },
    },
  };
}

function createLocationUISchemaForKey(
  key,
  title = '',
  isRequiredCallback = () => true,
) {
  return {
    'ui:title': title,
    state: {
      'ui:title': 'State (or country if outside the USA)',
      'ui:required': isRequiredCallback,
    },
    city: {
      'ui:title': 'City or county',
      'ui:required': isRequiredCallback,
    },
  };
}

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/dependents_applications`,
  transformForSubmit: transform,
  authorize: verifyDisabilityRating,
  getAuthorizationState: get686AuthorizationState,
  authorizationMessage: AuthorizationMessage,
  trackingPrefix: '686-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {
    notFound:
      'Please start over to apply to add a dependent to your VA compensation benefits.',
    noAuth:
      'Please sign in again to continue your application to add a dependent to your VA compensation benefits.',
  },
  title: 'Apply to add a dependent to your VA benefits',
  subTitle: 'VA Form 21-686c',
  preSubmitInfo,
  downtime: {
    dependencies: [externalServices.evss],
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    location,
    postalCode,
    previousMarriages,
    marriages: marriagesDefinition,
    fullName,
    ssn,
    date,
    vaFileNumber,
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          title: 'Veteran Information',
          path: 'veteran-information',
          uiSchema: {
            veteranFullName: _.merge(fullNameUI, {
              first: {
                'ui:title': 'Your first name',
              },
              middle: {
                'ui:title': 'Your middle name',
              },
              last: {
                'ui:title': 'Your last name',
              },
              suffix: {
                'ui:title': 'Your suffix',
              },
            }),
            veteranSocialSecurityNumber: _.merge(_.unset('ui:title', ssnUI), {
              'ui:title': 'Your Social Security number',
              'ui:required': formData => !formData['view:noSSN'],
            }),
            'view:noSSN': {
              'ui:title': 'I don’t have a Social Security number',
            },
            veteranVAfileNumber: {
              'ui:options': {
                expandUnder: 'view:noSSN',
              },
              'ui:title': 'Your VA file number',
              'ui:required': formData => formData['view:noSSN'],
              'ui:help': VAFileNumberDescription,
              'ui:errorMessages': {
                pattern: 'Your VA file number must be between 7 to 9 digits',
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName,
              veteranSocialSecurityNumber,
              'view:noSSN': {
                type: 'boolean',
              },
              veteranVAfileNumber: vaFileNumber,
            },
          },
        },
        veteranAddress: {
          title: 'Veteran Address',
          path: 'veteran-address',
          uiSchema: {
            veteranAddress: createAddressUISchemaForKey('veteranAddress'),
          },
          schema: {
            type: 'object',
            properties: {
              veteranAddress: addressSchema,
            },
          },
        },
      },
    },
    householdInformation: {
      title: 'Household Information',
      pages: {
        marriageInformation: {
          title: 'Marriage history',
          path: 'household/marriage-information',
          uiSchema: {
            maritalStatus: {
              'ui:title': 'What’s your marital status?',
              'ui:widget': 'radio',
            },
            marriages: {
              'ui:title': 'How many times have you been married?',
              'ui:widget': ArrayCountWidget,
              'ui:field': 'StringField',
              'ui:required': hasBeenMarried,
              'ui:options': {
                showFieldLabel: 'label',
                keepInPageOnReview: true,
                expandUnder: 'maritalStatus',
                expandUnderCondition: status =>
                  !!status && status !== MARITAL_STATUS_NEVER_MARRIED,
              },
              'ui:errorMessages': {
                required: 'You must enter at least 1 marriage',
              },
            },
          },
          schema: {
            type: 'object',
            required: ['maritalStatus'],
            properties: {
              maritalStatus,
              marriages: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
        marriageHistory: {
          title: (form, { pagePerItemIndex }) =>
            getMarriageTitleWithCurrent(form, pagePerItemIndex),
          path: 'household/marriages/:index',
          showPagePerItem: true,
          arrayPath: 'marriages',
          uiSchema: {
            marriages: {
              items: {
                'ui:options': {
                  updateSchema: (form, schema, uiSchema, index) => ({
                    title: getMarriageTitleWithCurrent(form, index),
                  }),
                },
                spouseFullName: {
                  'ui:options': {
                    updateSchema: (function makeUpdateSchema() {
                      let formerSpouseSchema;
                      let currentSpouseSchema;
                      return (form, schema, uiSchema, index) => {
                        if (!formerSpouseSchema) {
                          formerSpouseSchema = _.merge(schema, {
                            properties: {
                              first: {
                                title: 'Former spouse’s first name',
                              },
                              last: {
                                title: 'Former spouse’s last name',
                              },
                              middle: {
                                title: 'Former spouse’s middle name',
                              },
                            },
                          });
                          currentSpouseSchema = _.merge(schema, {
                            properties: {
                              first: {
                                title: 'Spouse’s first name',
                              },
                              last: {
                                title: 'Spouse’s last name',
                              },
                              middle: {
                                title: 'Spouse’s middle name',
                              },
                            },
                          });
                        }
                        return isCurrentMarriage(form, index)
                          ? currentSpouseSchema
                          : formerSpouseSchema;
                      };
                    })(),
                  },
                },
                dateOfMarriage: currentOrPastDateUI(
                  'When did you get married?',
                ),
                locationOfMarriage: createLocationUISchemaForKey(
                  'marriages[INDEX].locationOfMarriage',
                  'Where did you get married? (city and state or foreign country)',
                ),
                'view:pastMarriage': {
                  'ui:options': {
                    hideIf: isCurrentMarriage,
                  },
                  dateOfSeparation: _.assign(
                    currentOrPastDateUI('When did the marriage end?'),
                    {
                      'ui:required': isNotCurrentMarriage,
                      'ui:validations': [validateAfterMarriageDate],
                    },
                  ),
                  locationOfSeparation: createLocationUISchemaForKey(
                    'marriages[INDEX].view:pastMarriage.locationOfSeparation',
                    'Where did the marriage end? (city and state or foreign country)',
                    isNotCurrentMarriage,
                  ),
                  reasonForSeparation: {
                    'ui:title': 'How did this marriage end?',
                    'ui:widget': 'radio',
                    'ui:required': isNotCurrentMarriage,
                  },
                  explainSeparation: {
                    'ui:options': {
                      expandUnder: 'reasonForSeparation',
                      expandUnderCondition: reason =>
                        !!reason && reason === 'Other',
                    },
                    'ui:title': 'Explain reason for separation',
                    'ui:required': veteranSeparatedForOtherReason,
                  },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              marriages: {
                type: 'array',
                items: {
                  type: 'object',
                  required: [
                    'spouseFullName',
                    'dateOfMarriage',
                    'locationOfMarriage',
                  ],
                  properties: {
                    spouseFullName: marriageProperties.spouseFullName,
                    dateOfMarriage: marriageProperties.dateOfMarriage,
                    locationOfMarriage: locationSchema,
                    'view:pastMarriage': {
                      type: 'object',
                      properties: {
                        dateOfSeparation: marriageProperties.dateOfSeparation,
                        locationOfSeparation: locationSchema,
                        reasonForSeparation,
                        explainSeparation,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    currentSpouseInfo: {
      title: 'Spouse Information',
      pages: {
        spouseInformation: {
          title: 'Spouse information',
          path: 'spouse-information',
          depends: isMarried,
          uiSchema: {
            currentMarriage: {
              spouseDateOfBirth: _.merge(currentOrPastDateUI(''), {
                'ui:options': {
                  updateSchema: createSpouseLabelSelector(
                    spouseName =>
                      `${spouseName.first} ${spouseName.last}’s date of birth`,
                  ),
                },
              }),
              spouseSocialSecurityNumber: _.merge(ssnUI, {
                'ui:title': '',
                'ui:options': {
                  updateSchema: createSpouseLabelSelector(
                    spouseName =>
                      `${spouseName.first} ${
                        spouseName.last
                      }’s Social Security number`,
                  ),
                },
              }),
              spouseIsVeteran: {
                'ui:widget': 'yesNo',
                'ui:options': {
                  updateSchema: createSpouseLabelSelector(
                    spouseName =>
                      `Is ${spouseName.first} ${
                        spouseName.last
                      } also a Veteran?`,
                  ),
                },
              },
              spouseVaFileNumber: {
                'ui:title': 'What is their VA file number?',
                'ui:options': {
                  expandUnder: 'spouseIsVeteran',
                },
                'ui:errorMessages': {
                  pattern: 'Your VA file number must be between 7 to 9 digits',
                },
              },
              liveWithSpouse: {
                'ui:widget': 'yesNo',
                'ui:options': {
                  updateSchema: createSpouseLabelSelector(
                    spouseName =>
                      `Do you live with ${spouseName.first} ${
                        spouseName.last
                      }?`,
                  ),
                },
              },
              spouseAddress: _.merge(
                createAddressUISchemaForKey(
                  'currentMarriage.spouseAddress',
                  isNotLivingWithSpouse,
                ),
                {
                  'ui:options': {
                    expandUnder: 'liveWithSpouse',
                    expandUnderCondition: false,
                  },
                },
              ),
            },
            spouseMarriages: {
              'ui:title':
                'How many times has your spouse been married (including current marriage)?',
              'ui:widget': ArrayCountWidget,
              'ui:field': 'StringField',
              'ui:options': {
                showFieldLabel: 'label',
                keepInPageOnReview: true,
                countOffset: -1,
              },
              'ui:errorMessages': {
                required: 'You must enter at least 1 marriage',
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              currentMarriage: {
                type: 'object',
                required: [
                  'spouseDateOfBirth',
                  'spouseSocialSecurityNumber',
                  'spouseIsVeteran',
                  'liveWithSpouse',
                ],
                properties: {
                  spouseDateOfBirth,
                  spouseSocialSecurityNumber: veteranSocialSecurityNumber,
                  spouseIsVeteran,
                  spouseVaFileNumber,
                  liveWithSpouse,
                  spouseAddress: addressSchema,
                },
              },
              spouseMarriages: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
        spouseMarriageHistory: {
          title: (form, { pagePerItemIndex }) =>
            getSpouseMarriageTitle(pagePerItemIndex),
          path: 'spouse-info/marriages/:index',
          depends: isMarried,
          showPagePerItem: true,
          arrayPath: 'spouseMarriages',
          uiSchema: {
            spouseMarriages: {
              items: {
                'ui:title': SpouseMarriageTitle,
                dateOfMarriage: _.merge(currentOrPastDateUI(''), {
                  'ui:required': () => true,
                  'ui:options': {
                    updateSchema: createSpouseLabelSelector(
                      spouseName =>
                        `When did
                           ${spouseName.first} ${spouseName.last}
                           get married?`,
                    ),
                  },
                }),
                locationOfMarriage: _.merge(
                  createLocationUISchemaForKey(
                    'spouseMarriages[INDEX].locationOfMarriage',
                  ),
                  {
                    'ui:options': {
                      updateSchema: createSpouseLabelSelector(
                        spouseName =>
                          `Where did
                             ${spouseName.first} ${spouseName.last}
                             get married? (city and state or foreign country)`,
                      ),
                    },
                  },
                ),
                spouseFullName: _.merge(fullNameUI, {
                  first: {
                    'ui:title': '',
                    'ui:options': {
                      updateSchema: createSpouseLabelSelector(
                        spouseName =>
                          `First name of
                             ${spouseName.first} ${spouseName.last}’s
                             former spouse`,
                      ),
                    },
                  },
                  middle: {
                    'ui:title': '',
                    'ui:options': {
                      updateSchema: createSpouseLabelSelector(
                        spouseName =>
                          `Middle name of
                             ${spouseName.first} ${spouseName.last}’s
                            former spouse`,
                      ),
                    },
                  },
                  last: {
                    'ui:title': '',
                    'ui:options': {
                      updateSchema: createSpouseLabelSelector(
                        spouseName =>
                          `Last name of
                             ${spouseName.first} ${spouseName.last}’s
                             former spouse`,
                      ),
                    },
                  },
                }),
                dateOfSeparation: _.assign(
                  currentOrPastDateUI('When did this marriage end?'),
                  {
                    'ui:validations': [validateAfterMarriageDate],
                    'ui:required': () => true,
                  },
                ),
                locationOfSeparation: _.merge(
                  createLocationUISchemaForKey(
                    'spouseMarriages[INDEX].locationOfSeparation',
                  ),
                  {
                    'ui:title':
                      'Where did this marriage end? (city and state or foreign country)',
                  },
                ),
                reasonForSeparation: {
                  'ui:title': 'How did this marriage end?',
                  'ui:widget': 'radio',
                  'ui:required': () => true,
                },
                explainSeparation: {
                  'ui:options': {
                    expandUnder: 'reasonForSeparation',
                    expandUnderCondition: reason =>
                      !!reason && reason === 'Other',
                  },
                  'ui:title': 'Explain reason for separation',
                  'ui:required': spouseSeparatedForOtherReason,
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              spouseMarriages: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    dateOfMarriage: marriageProperties.dateOfMarriage,
                    locationOfMarriage: locationSchema,
                    spouseFullName: marriageProperties.spouseFullName,
                    dateOfSeparation: marriageProperties.dateOfSeparation,
                    locationOfSeparation: locationSchema,
                    reasonForSeparation,
                    explainSeparation,
                  },
                },
              },
            },
          },
        },
      },
    },
    unMarriedChildren: {
      title: 'Veteran’s Unmarried Children',
      pages: {
        dependents: {
          path: 'unmarried-children',
          title: 'Veteran’s Unmarried Children',
          uiSchema: {
            'ui:description':
              'Please provide details about your unmarried children.',
            'view:hasUnmarriedChildren': {
              'ui:widget': 'yesNo',
              'ui:title': 'Do you have unmarried children?',
            },
            dependents: {
              'ui:options': {
                itemName: 'Child',
                expandUnder: 'view:hasUnmarriedChildren',
                viewField: DependentField,
              },
              'ui:errorMessages': {
                minItems: dependentsMinItem,
              },
              items: {
                fullName: _.merge(fullNameUI, {
                  first: {
                    'ui:title': 'Child’s first name',
                  },
                  middle: {
                    'ui:title': 'Child’s middle name',
                  },
                  last: {
                    'ui:title': 'Child’s last name',
                  },
                  suffix: {
                    'ui:title': 'Child’s suffix',
                  },
                }),
                childDateOfBirth: currentOrPastDateUI('Child’s date of birth'),
              },
            },
          },
          schema: {
            type: 'object',
            required: ['view:hasUnmarriedChildren'],
            properties: {
              'view:hasUnmarriedChildren': {
                type: 'boolean',
              },
              dependents: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: ['fullName', 'childDateOfBirth'],
                  properties: {
                    fullName: dependents.items.properties.fullName,
                    childDateOfBirth:
                      dependents.items.properties.childDateOfBirth,
                  },
                },
              },
            },
          },
        },
        childrenInformation: {
          path: 'unmarried-children/information/:index',
          title: item =>
            `${item.fullName.first || ''} ${item.fullName.last ||
              ''} information`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['childRelationship'],
                  properties: {
                    childSocialSecurityNumber:
                      dependents.items.properties.childSocialSecurityNumber,
                    'view:noSSN': { type: 'boolean' },
                    childRelationship:
                      dependents.items.properties.childRelationship,
                    inSchool: dependents.items.properties.attendingCollege,
                    'view:schoolWarning': {
                      type: 'object',
                      properties: {},
                    },
                    disabled: dependents.items.properties.disabled,
                    'view:disableWarning': {
                      type: 'object',
                      properties: {},
                    },
                    married: dependents.items.properties.previouslyMarried,
                    'view:stepChildCondition': {
                      type: 'boolean',
                    },
                  },
                },
              },
            },
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle(
                  'fullName',
                  'Information',
                ),
                childSocialSecurityNumber: _.merge(ssnUI, {
                  'ui:title': 'Child’s Social Security number',
                  'ui:required': (formData, index) =>
                    !_.get(`dependents.${index}.view:noSSN`, formData),
                }),
                'view:noSSN': {
                  'ui:title':
                    'Does not have a Social Security number (foreign national, etc.)',
                },
                childRelationship: {
                  'ui:title': 'What’s the status of this child?',
                  'ui:options': {
                    showFieldLabel: true,
                    labels: childRelationshipStatusLabels,
                  },
                  'ui:widget': 'radio',
                },
                inSchool: {
                  'ui:title': 'Child is 18 to 23 years old and in school',
                  'ui:options': {
                    hideIf: (form, index) => {
                      const childAge = calculateChildAge(form, index);
                      if (childAge) {
                        return childAge < 18 || childAge > 23;
                      }
                      return true;
                    },
                  },
                },
                'view:schoolWarning': {
                  'ui:description': schoolAttendanceWarning,
                  'ui:options': {
                    expandUnder: 'inSchool',
                  },
                },
                disabled: {
                  'ui:title': 'Seriously disabled before 18 years old',
                  'ui:options': {
                    hideIf: (form, index) => {
                      const childAge = calculateChildAge(form, index);
                      if (childAge) {
                        return childAge >= 18;
                      }
                      return true;
                    },
                  },
                },
                'view:disableWarning': {
                  'ui:description': disableWarning,
                  'ui:options': {
                    expandUnder: 'disabled',
                  },
                },
                married: {
                  'ui:title': 'Child was previously married',
                },
                'view:stepChildCondition': {
                  'ui:options': {
                    expandUnder: 'childRelationship',
                    expandUnderCondition: relationship =>
                      relationship === 'stepchild',
                  },
                  'ui:required': (formData, index) =>
                    _.get(`dependents.${index}.childRelationship`, formData) ===
                    'stepchild',
                  'ui:widget': 'yesNo',
                  'ui:title':
                    'Is your child the biological child of your spouse?',
                },
              },
            },
          },
        },
        childrenAddress: {
          path: 'unmarried-children/address/:index',
          title: item =>
            `${item.fullName.first || ''} ${item.fullName.last || ''} address`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['childInHousehold'],
                  properties: {
                    childInHousehold:
                      dependents.items.properties.childInHousehold,
                    childInfo: {
                      type: 'object',
                      properties: {
                        childAddress: addressSchema,
                        personWhoLivesWithChild: {
                          type: 'object',
                          properties: {
                            first: {
                              type: 'string',
                            },
                            last: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle('fullName', 'Address'),
                childInHousehold: {
                  'ui:title': 'Does your child currently live with you?',
                  'ui:widget': 'yesNo',
                },
                childInfo: {
                  'ui:options': {
                    expandUnder: 'childInHousehold',
                    expandUnderCondition: false,
                  },
                  childAddress: _.merge(
                    createAddressUISchemaForKey(
                      'dependents[INDEX].childInfo.childAddress',
                      isNotLivingWithParent,
                    ),
                    {
                      'ui:title': 'Child’s Address',
                    },
                  ),
                  personWhoLivesWithChild: {
                    first: {
                      'ui:title':
                        'First name of person child lives with (if applicable)',
                    },
                    last: {
                      'ui:title':
                        'Last name of person child lives with (if applicable)',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    reportDependentDeaths: {
      title: 'Report The Death Of A Dependent',
      pages: {
        deaths: {
          path: 'report-death-of-dependent',
          title: 'Dependent Information',
          schema: {
            type: 'object',
            properties: {
              deaths: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: [
                    'dependentType',
                    'fullName',
                    'deceasedDateOfDeath',
                    'deceasedLocationOfDeath',
                  ],
                  properties: {
                    dependentType: dependentTypeSchema,
                    childStatus: childStatusSchema,
                    fullName,
                    deceasedDateOfDeath: date,
                    deceasedLocationOfDeath: locationSchema,
                  },
                },
              },
            },
          },
          uiSchema: {
            deaths: {
              'ui:options': {
                viewField: DependentField,
              },
              items: {
                dependentType: dependentTypeSchemaUI,
                childStatus: childStatusUiSchema,
                fullName: _.merge(fullNameUI, {
                  first: {
                    'ui:title': 'Dependent’s first name',
                  },
                  middle: {
                    'ui:title': 'Dependent’s middle name',
                  },
                  last: {
                    'ui:title': 'Dependent’s last name',
                  },
                }),
                deceasedDateOfDeath: currentOrPastDateUI(
                  'Dependent’s date of death',
                ),
                deceasedLocationOfDeath: deathLocationUiSchema,
              },
            },
          },
        },
      },
    },
    reportMarriageOfChild: {
      title: 'Report the marriage of a child',
      pages: {
        reportChildMarriedInformation: {
          title: 'Information of child that has been married',
          path: 'report-marriage-of-child',
          uiSchema: {
            marriedChildName: _.merge(fullNameUI, {
              first: {
                'ui:title': 'Child’s first name',
              },
              middle: {
                'ui:title': 'Child’s middle name',
              },
              last: {
                'ui:title': 'Child’s last name',
              },
            }),
            dateChildMarried: currentOrPastDateUI(
              'When did this child get married?',
            ),
          },
          // 4908 NOTE: These properties will need to be udpated once the schema file for the 686
          // has been given corresponding properties for this chapter. For now they reference definitions.
          // they will map to reportMarriageOfChild.properties.<key-name>
          schema: {
            type: 'object',
            properties: {
              marriedChildName: fullName,
              dateChildMarried: date,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
