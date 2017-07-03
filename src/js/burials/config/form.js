import _ from 'lodash/fp';

// import { transform } from '../helpers';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { fileHelp, transportationWarning, transform } from '../helpers';
import { relationshipLabels, locationOfDeathLabels, allowanceLabels } from '../labels.jsx';
import { validateBooleanGroup } from '../../common/schemaform/validation';

import * as address from '../../common/schemaform/definitions/address';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import FullNameField from '../../common/schemaform/FullNameField';
import phoneUI from '../../common/schemaform/definitions/phone';
import ssnUI from '../../common/schemaform/definitions/ssn';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import toursOfDutyUI from '../definitions/toursOfDuty';
import fileUploadUI from '../../common/schemaform/definitions/file';
import { validateBurialAndDeathDates } from '../validation';
import GetFormHelp from '../../common/schemaform/GetPensionOrBurialFormHelp';

const {
  relationship,
  claimantFullName,
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
  placeOfBirth,
  officialPosition
} = fullSchemaBurials.properties;

const {
  fullName,
  vaFileNumber,
  ssn,
  date,
  usaPhone,
  files,
  dateRange
} = fullSchemaBurials.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/burial_claims',
  trackingPrefix: 'burials-530-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  transformForSubmit: transform,
  formId: '21P-530',
  version: 0,
  savedFormMessages: {
    notFound: 'Please start over to apply for burial benefits.',
    noAuth: 'Please sign in again to resume your application for burial benefits.'
  },
  title: 'Apply for burial benefits',
  subTitle: 'Form 21P-530',
  getHelp: GetFormHelp,
  defaultDefinitions: {
    fullName,
    vaFileNumber,
    ssn,
    date,
    usaPhone,
    dateRange
  },
  chapters: {
    claimantInformation: {
      title: 'Claimant Information',
      pages: {
        claimantInformation: {
          title: 'Claimant information',
          path: 'claimant-information',
          uiSchema: {
            claimantFullName: fullNameUI,
            relationship: {
              type: {
                'ui:title': 'Relationship to the deceased Veteran',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: relationshipLabels
                }
              },
              other: {
                'ui:title': 'Please specify',
                'ui:required': (form) => _.get('relationship.type', form) === 'other',
                'ui:options': {
                  expandUnder: 'type',
                  expandUnderCondition: 'other'
                }
              },
              'view:isEntity': {
                'ui:title': 'Claiming as a firm, corporation or state agency',
                'ui:options': {
                  expandUnder: 'type',
                  expandUnderCondition: 'other',
                  widgetClassNames: 'schemaform-label-no-top-margin'
                }
              }
            },
            'ui:options': {
              showPrefillMessage: true
            }
          },
          schema: {
            type: 'object',
            required: ['claimantFullName', 'relationship'],
            properties: {
              claimantFullName,
              relationship: _.merge(relationship, {
                properties: {
                  'view:isEntity': {
                    type: 'boolean'
                  }
                }
              })
            }
          }
        }
      }
    },
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          title: 'Deceased Veteran information',
          path: 'veteran-information',
          uiSchema: {
            'ui:title': 'Deceased Veteran information',
            veteranFullName: fullNameUI,
            veteranSocialSecurityNumber: _.assign(ssnUI, {
              'ui:title': 'Social Security number (must have this or a VA file number)',
              'ui:required': form => !form.vaFileNumber,
            }),
            vaFileNumber: {
              'ui:title': 'VA file number (must have this or a Social Security number)',
              'ui:required': form => !form.veteranSocialSecurityNumber,
              'ui:options': {
                widgetClassNames: 'usa-input-medium'
              },
              'ui:errorMessages': {
                pattern: 'File number must be 8 digits'
              }
            },
            veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
            placeOfBirth: {
              'ui:title': 'Place of birth'
            }
          },
          schema: {
            type: 'object',
            required: ['veteranFullName', 'veteranDateOfBirth'],
            properties: {
              veteranFullName,
              veteranSocialSecurityNumber,
              vaFileNumber,
              veteranDateOfBirth,
              placeOfBirth
            }
          }

        },
        burialInformation: {
          title: 'Burial information',
          path: 'veteran-information/burial',
          uiSchema: {
            burialDate: currentOrPastDateUI('Date of burial (includes cremation or interment)'),
            deathDate: currentOrPastDateUI('Date of death'),
            locationOfDeath: {
              location: {
                'ui:title': 'Where did the Veteran’s death occur?',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: locationOfDeathLabels
                }
              },
              other: {
                'ui:title': 'Please specify',
                'ui:required': (form) => _.get('locationOfDeath.location', form) === 'other',
                'ui:options': {
                  expandUnder: 'location',
                  expandUnderCondition: 'other'
                }
              }
            },
            'ui:validations': [
              validateBurialAndDeathDates
            ]
          },
          schema: {
            type: 'object',
            required: ['burialDate', 'deathDate', 'locationOfDeath'],
            properties: {
              deathDate,
              burialDate,
              locationOfDeath
            }
          }
        }
      }
    },
    militaryHistory: {
      title: 'Military History',
      pages: {
        servicePeriods: {
          title: 'Service Periods',
          path: 'military-history/service-periods',
          uiSchema: {
            toursOfDuty: toursOfDutyUI
          },
          schema: {
            type: 'object',
            properties: {
              toursOfDuty
            }
          }
        },
        previousNames: {
          title: 'Previous Names',
          path: 'military-history/previous-names',
          uiSchema: {
            previousNames: {
              'ui:options': {
                expandUnder: 'view:serveUnderOtherNames',
                viewField: FullNameField
              },
              items: fullNameUI
            },
            'view:serveUnderOtherNames': {
              'ui:title': 'Did the veteran serve under another name?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              'view:serveUnderOtherNames': {
                type: 'boolean'
              },
              previousNames: _.assign(previousNames, {
                minItems: 1
              })
            }
          }
        }
      }
    },
    benefitsSelection: {
      title: 'Benefits Selection',
      pages: {
        benefitsSelection: {
          title: 'Benefits selection',
          path: 'benefits/selection',
          uiSchema: {
            'view:claimedBenefits': {
              'ui:title': 'What expenses did you incur for the Veteran’s burial?',
              burialAllowance: {
                'ui:title': 'Burial allowance'
              },
              plotAllowance: {
                'ui:title': 'Plot or interment allowance (Check this box if you incurred expenses for the plot to bury the Veteran’s remains.)'
              },
              transportation: {
                'ui:title': 'Transportation expenses (Transportation of the Veteran’s remains from the place of death to the final resting place)'
              },
              amountIncurred: {
                'ui:title': 'Amount incurred',
                'ui:required': form => _.get('view:claimedBenefits.transportation', form) === true,
                'ui:options': {
                  expandUnder: 'transportation',
                  classNames: 'schemaform-currency-input'
                }
              },
              'view:transportationWarning': {
                'ui:description': transportationWarning,
                'ui:options': {
                  expandUnder: 'transportation',
                  classNames: 'schemaform-currency-input'
                }
              },
              'ui:validations': [
                validateBooleanGroup
              ],
              'ui:errorMessages': {
                atLeastOne: 'You must have expenses for at least one benefit.'
              },
              'ui:options': {
                showFieldLabel: true
              }
            }
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
                    properties: {}
                  }
                }
              }
            }
          }
        },
        burialAllowance: {
          title: 'Burial allowance',
          path: 'benefits/burial-allowance',
          depends: form => _.get('view:claimedBenefits.burialAllowance', form) === true,
          uiSchema: {
            'ui:title': 'Burial allowance',
            burialAllowanceRequested: {
              'ui:title': 'Type of burial allowance requested',
              'ui:widget': 'radio',
              'ui:options': {
                labels: allowanceLabels
              }
            },
            burialCost: {
              'ui:title': 'Actual burial cost',
              'ui:options': {
                expandUnder: 'burialAllowanceRequested',
                expandUnderCondition: 'vaMC'
              }
            },
            previouslyReceivedAllowance: {
              'ui:title': 'Did you previously receive a VA burial allowance?',
              'ui:widget': 'yesNo',
              'ui:required': form => _.get('relationship.type', form) === 'spouse',
              'ui:options': {
                hideIf: form => _.get('relationship.type', form) !== 'spouse'
              }
            },
            benefitsUnclaimedRemains: {
              'ui:title': 'Are you seeking burial benefits for the unclaimed remains of a Veteran?',
              'ui:widget': 'yesNo',
              'ui:required': form => _.get('relationship.type', form) === 'other',
              'ui:options': {
                hideIf: form => _.get('relationship.type', form) !== 'other'
              }
            }
          },
          schema: {
            type: 'object',
            required: ['burialAllowanceRequested'],
            properties: {
              burialAllowanceRequested,
              burialCost,
              previouslyReceivedAllowance,
              benefitsUnclaimedRemains,
            }
          }
        },
        plotAllowance: {
          title: 'Plot or interment allowance',
          path: 'benefits/plot-allowance',
          depends: form => _.get('view:claimedBenefits.plotAllowance', form) === true,
          uiSchema: {
            'ui:title': 'Plot or interment allowance',
            placeOfRemains: {
              'ui:title': 'Place of burial or location of deceased Veteran’s remains'
            },
            federalCemetery: {
              'ui:title': 'Was the Veteran buried in a national cemetery, or one owned by the federal government?',
              'ui:widget': 'yesNo'
            },
            stateCemetery: {
              'ui:title': 'Was the Veteran buried in a state Veterans cemetery?',
              'ui:widget': 'yesNo',
              'ui:required': form => form.federalCemetery === false,
              'ui:options': {
                expandUnder: 'federalCemetery',
                expandUnderCondition: false
              }
            },
            govtContributions: {
              'ui:title': 'Did a federal/state government or the Veteran’s employer contribute to the burial?',
              'ui:widget': 'yesNo'
            },
            amountGovtContribution: {
              'ui:title': 'Amount of government or employer contribution:',
              'ui:options': {
                expandUnder: 'govtContributions',
                classNames: 'schemaform-currency-input'
              }
            }
          },
          schema: {
            type: 'object',
            required: ['placeOfRemains', 'federalCemetery', 'govtContributions'],
            properties: {
              placeOfRemains,
              federalCemetery,
              stateCemetery,
              govtContributions,
              amountGovtContribution
            }
          }
        }
      }
    },
    additionalInformation: {
      title: 'Additional Information',
      pages: {
        claimantContactInformation: {
          title: 'Claimant contact information',
          path: 'claimant-contact-information',
          uiSchema: {
            'ui:title': 'Claimant contact information',
            officialPosition: {
              'ui:title': 'Position of person signing on behalf of firm, corporation or state agency',
              'ui:options': {
                hideIf: form => _.get('relationship.view:isEntity', form) !== true
              }
            },
            claimantAddress: address.uiSchema('Address'),
            claimantEmail: {
              'ui:title': 'Email address'
            },
            claimantPhone: phoneUI('Phone number')
          },
          schema: {
            type: 'object',
            required: ['claimantAddress'],
            properties: {
              officialPosition,
              claimantAddress: address.schema(fullSchemaBurials, true),
              claimantEmail,
              claimantPhone
            }
          }
        },
        documentUpload: {
          title: 'Document upload',
          path: 'documents',
          editModeOnReviewPage: true,
          depends: form =>
            form.burialAllowanceRequested === 'service' || _.get('view:claimedBenefits.transportation', form) === true,
          uiSchema: {
            'ui:title': 'Document upload',
            'ui:description': fileHelp,
            deathCertificate: _.assign(fileUploadUI('Veterans death certificate', {
              hideIf: form => form.burialAllowanceRequested !== 'service'
            }), {
              'ui:required': form => form.burialAllowanceRequested === 'service',
            }),
            transportationReceipts: _.assign(fileUploadUI('Receipt(s) for transportation of the Veteran’s remains', {
              addAnotherLabel: 'Add Another Receipt',
              hideIf: form => _.get('view:claimedBenefits.transportation', form) !== true
            }), {
              'ui:required': form => _.get('view:claimedBenefits.transportation', form) === true,
            })
          },
          schema: {
            type: 'object',
            properties: {
              deathCertificate: _.assign(files, {
                minItems: 1,
                maxItems: 1
              }),
              transportationReceipts: _.assign(files, {
                minItems: 1
              })
            }
          }
        }
      }
    }
  }
};

export default formConfig;
