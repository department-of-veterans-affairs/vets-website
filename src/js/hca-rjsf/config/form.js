import _ from 'lodash/fp';

import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import { states } from '../../common/utils/options-for-select';
import { createUSAStateLabels } from '../../common/schemaform/helpers';

import {
  transform,
  dischargeTypeLabels,
  lastServiceBranchLabels,
  FacilityHelp,
  medicalCentersByState,
  medicalCenterLabels
} from '../helpers';

import IntroductionPage from '../components/IntroductionPage';
import InsuranceProviderView from '../components/InsuranceProviderView';

import { uiSchema as dateUI } from '../../common/schemaform/definitions/currentOrPastDate';

const {
  lastEntryDate,
  lastDischargeDate,
  lastServiceBranch,
  dischargeType,
  purpleHeartRecipient,
  isFormerPow,
  postNov111998Combat,
  disabledInLineOfDuty,
  swAsiaCombat,
  vietnamService,
  exposedToRadiation,
  radiumTreatments,
  campLejeune,
  isMedicaidEligible,
  isEnrolledMedicarePartA,
  medicarePartAEffectiveDate,
  isCoveredByHealthInsurance,
  vaMedicalFacility,
  isEssentialAcaCoverage,
  wantsInitialVaContact,
  isVaServiceConnected,
  compensableVaServiceConnected,
  receivesVaPension
} = fullSchemaHca.properties;

const {
  date,
  provider
} = fullSchemaHca.definitions;

const stateLabels = createUSAStateLabels(states);

import { uiSchema as fullNameUISchema } from '../../common/schemaform/definitions/fullName';
import * as ssn from '../../common/schemaform/definitions/ssn';

const {
  fullName,
  date
} = fullSchemaHca.definitions;

const {
  cityOfBirth,
  stateOfBirth
} = fullSchemaHca.properties;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '',
  trackingPrefix: 'hca-rjsf-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  title: 'Apply for health care',
  subTitle: 'Form 10-10ez',
  defaultDefinitions: {
    date,
    provider
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information/personal-information',
          title: 'Veteran information',
          initialData: {},
          uiSchema: {
            veteranFullName: _.merge(fullNameUISchema, {
              last: {
                'ui:errorMessages': {
                  minLength: 'Please provide a valid name. Must be at least 2 characters.'
                }
              }
            }),
            mothersMaidenName: {
              'ui:title': 'Mother’s maiden name'
            }
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName: _.merge(fullName, {
                properties: {
                  suffix: {
                    type: 'string'
                  }
                }
              }),
              mothersMaidenName: {
                type: 'string'
              }
            }
          }
        },
        birthInformation: {
          path: 'veteran-information/birth-information',
          title: 'Veteran information',
          initialData: {},
          uiSchema: {
            veteranDateOfBirth: {
              'ui:title': 'Date of birth'
            },
            veteranSocialSecurityNumber: ssn.uiSchema,
            cityOfBirth: {
              'ui:title': 'City of birth'
            },
            stateOfBirth: {
              'ui:title': 'State of birth'
            }
          },
          schema: {
            type: 'object',
            required: ['veteranDateOfBirth', 'veteranSocialSecurityNumber'],
            properties: {
              veteranDateOfBirth: date,
              veteranSocialSecurityNumber: ssn.schema,
              cityOfBirth,
              stateOfBirth: _.merge(stateOfBirth, {
                type: 'string'
              })
            }
          }
        },
        demographicInformation: {
          path: 'veteran-information/demographic-information',
          title: 'Veteran information',
          initialData: {},
          uiSchema: {},
          schema: {}
        },
        veteranAddress: {
          path: 'veteran-information/veteran-address',
          title: 'Permanent address',
          initialData: {},
          uiSchema: {},
          schema: {}
        },
        contactInformation: {
          path: 'veteran-information/contact-information',
          title: 'Contact information',
          initialData: {},
          uiSchema: {},
          schema: {}
        }
      }
    },
    insuranceInformation: {
      title: 'Insurance Information',
      pages: {
        medicare: {
          path: 'insurance-information/medicare',
          title: 'Medicaid or Medicare coverage',
          initialData: {},
          uiSchema: {
            isMedicaidEligible: {
              'ui:title': 'Are you eligible for Medicaid?',
              'ui:widget': 'yesNo',
              'ui:help': 'Medicaid is a United States health program for eligible individuals and families with low income and few resources.'
            },
            isEnrolledMedicarePartA: {
              'ui:title': 'Are you enrolled in Medicare Part A (hospital insurance)?',
              'ui:widget': 'yesNo',
              'ui:help': 'Medicare is a social insurance program administered by the United States government, providing health insurance coverage to people aged 65 and over or who meet special criteria.'
            },
            medicarePartAEffectiveDate: _.merge(
              dateUI('What is your Medicare Part A effective date?'), {
                'ui:required': (formData) => formData.isEnrolledMedicarePartA,
                'ui:options': {
                  expandUnder: 'isEnrolledMedicarePartA'
                }
              }
            )
          },
          schema: {
            type: 'object',
            required: ['isMedicaidEligible', 'isEnrolledMedicarePartA'],
            properties: {
              isMedicaidEligible,
              isEnrolledMedicarePartA,
              medicarePartAEffectiveDate
            }
          }
        },
        general: {
          path: 'insurance-information/general',
          title: 'Other coverage',
          uiSchema: {
            'ui:title': 'Other coverage',
            isCoveredByHealthInsurance: {
              'ui:title': 'Are you covered by health insurance? (Including coverage through a spouse or another person)',
              'ui:widget': 'yesNo'
            },
            providers: {
              'ui:options': {
                expandUnder: 'isCoveredByHealthInsurance',
                viewField: InsuranceProviderView
              },
              items: {
                insuranceName: {
                  'ui:title': 'Name of provider'
                },
                insurancePolicyHolderName: {
                  'ui:title': 'Name of policy holder'
                },
                // TODO: make these required only if the other is empty
                insurancePolicyNumber: {
                  'ui:title': 'Policy number (either this or the group code is required)'
                },
                insuranceGroupCode: {
                  'ui:title': 'Group code (either this or policy number is required)'
                }
              }
            }
          },
          schema: {
            type: 'object',
            required: ['isCoveredByHealthInsurance'],
            properties: {
              isCoveredByHealthInsurance,
              providers: {
                type: 'array',
                minItems: 1,
                items: _.merge(provider, {
                  required: [
                    'insuranceName',
                    'insurancePolicyHolderName',
                    'insurancePolicyNumber',
                    'insuranceGroupCode'
                  ]
                })
              }
            }
          }
        },
        vaFacility: {
          path: 'insurance-information/va-facility',
          title: 'VA Facility',
          uiSchema: {
            'ui:title': 'VA Facility',
            isEssentialAcaCoverage: {
              'ui:title': 'I am enrolling to obtain minimum essential coverage under the Affordable Care Act'
            },
            'view:preferredFacility': {
              'ui:title': 'Select your preferred VA medical facility',
              'view:facilityState': {
                'ui:title': 'State',
                'ui:options': {
                  labels: stateLabels
                }
              },
              vaMedicalFacility: {
                'ui:title': 'Center/clinic',
                'ui:options': {
                  labels: medicalCenterLabels,
                  updateSchema: (form) => {
                    const state = _.get('view:preferredFacility.view:facilityState', form);
                    if (state) {
                      return {
                        'enum': medicalCentersByState[state]
                      };
                    }

                    return {
                      'enum': []
                    };
                  }
                }
              }
            },
            'view:locator': {
              'ui:description': FacilityHelp
            },
            wantsInitialVaContact: {
              'ui:title': 'Do you want VA to contact you to schedule your first appointment?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              isEssentialAcaCoverage,
              'view:preferredFacility': {
                type: 'object',
                required: ['view:facilityState', 'vaMedicalFacility'],
                properties: {
                  'view:facilityState': {
                    type: 'string',
                    'enum': states.USA.map(state => state.value)
                  },
                  vaMedicalFacility: _.assign(vaMedicalFacility, {
                    type: 'string',
                    'enum': []
                  })
                }
              },
              'view:locator': {
                type: 'object',
                properties: {}
              },
              wantsInitialVaContact
            }
          }
        }
      }
    },
    vaBenefits: {
      title: 'VA Benefits',
      pages: {
        vaBenefits: {
          path: 'va-benefits/basic-information',
          title: 'VA benefits',
          uiSchema: {
            'ui:title': 'Current compensation',
            compensableVaServiceConnected: {
              'ui:title': 'Do you currently receive monetary compensation (pay) from the VA for a service-connected disability with a rating of 10%, 20%, 30%, or 40%?',
              'ui:widget': 'yesNo'
            },
            isVaServiceConnected: {
              'ui:title': 'Do you currently receive monetary compensation (pay) from the VA for a service-connected disability with a rating of 50% or more?',
              'ui:widget': 'yesNo'
            },
            receivesVaPension: {
              'ui:title': 'Do you receive a VA pension?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            required: ['isVaServiceConnected', 'compensableVaServiceConnected', 'receivesVaPension'],
            properties: {
              compensableVaServiceConnected,
              isVaServiceConnected,
              receivesVaPension
            }
          },
        }
      }
    },
    militaryService: {
      title: 'Military Service',
      pages: {
        serviceInformation: {
          path: 'military-service/service-information',
          title: 'Service periods',
          uiSchema: {
            lastServiceBranch: {
              'ui:title': 'Last branch of service',
              'ui:options': {
                labels: lastServiceBranchLabels
              }
            },
            // TODO: this should really be a dateRange, but that requires a backend schema change. For now
            // leaving them as dates, but should change these to get the proper dateRange validation
            lastEntryDate: dateUI('Start of service period'),
            lastDischargeDate: dateUI('Date of discharge'),
            dischargeType: {
              'ui:title': 'Character of discharge',
              'ui:options': {
                labels: dischargeTypeLabels
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              lastServiceBranch: _.assign(lastServiceBranch, { type: 'string' }),
              lastEntryDate,
              lastDischargeDate,
              dischargeType: _.assign(dischargeType, { type: 'string' })
            },
            required: [
              'lastServiceBranch',
              'lastEntryDate',
              'lastDischargeDate',
              'dischargeType'
            ],
          }
        },
        additionalInformation: {
          path: 'military-service/additional-information',
          title: 'Service history',
          uiSchema: {
            'ui:title': 'Check all that apply to you.',
            purpleHeartRecipient: {
              'ui:title': 'Purple Heart award recipient',
            },
            isFormerPow: {
              'ui:title': 'Former prisoner of war',
            },
            postNov111998Combat: {
              'ui:title': 'Served in combat theater of operations after November 11, 1998',
            },
            disabledInLineOfDuty: {
              'ui:title': 'Discharged or retired from the military for a disability incurred in the line of duty',
            },
            swAsiaCombat: {
              'ui:title': 'Served in Southwest Asia during the Gulf War between August 2, 1990, and Nov 11, 1998',
            },
            vietnamService: {
              'ui:title': 'Served in Vietnam between January 9, 1962, and May 7, 1975',
            },
            exposedToRadiation: {
              'ui:title': 'Exposed to radiation while in the military',
            },
            radiumTreatments: {
              'ui:title': 'Received nose/throat radium treatments while in the military',
            },
            campLejeune: {
              'ui:title': 'Served on active duty at least 30 days at Camp Lejeune from January 1, 1953, through December 31, 1987',
            }
          },
          schema: {
            type: 'object',
            properties: {
              purpleHeartRecipient,
              isFormerPow,
              postNov111998Combat,
              disabledInLineOfDuty,
              swAsiaCombat,
              vietnamService,
              exposedToRadiation,
              radiumTreatments,
              campLejeune
            }
          }
        }
      }
    }
  }
};

export default formConfig;
