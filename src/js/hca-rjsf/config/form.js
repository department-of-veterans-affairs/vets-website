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
  medicalCenterLabels,
  financialDisclosureText,
  incomeDescription
} from '../helpers';

import IntroductionPage from '../components/IntroductionPage';
import InsuranceProviderView from '../components/InsuranceProviderView';
import ChildView from '../components/ChildView';

import { uiSchema as dateUI } from '../../common/schemaform/definitions/currentOrPastDate';
import { schema as fullNameSchema, uiSchema as fullNameUI } from '../../common/schemaform/definitions/fullName';
import { schema as ssnSchema, uiSchema as ssnUI } from '../../common/schemaform/definitions/ssn';
import { schema as addressSchema, uiSchema as addressUI } from '../../common/schemaform/definitions/address';

import { schema as childSchema, uiSchema as childUI } from '../definitions/child';

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
  receivesVaPension,
  discloseFinancialInformation,
  spouseFullName,
  spouseSocialSecurityNumber,
  spouseDateOfBirth,
  dateOfMarriage,
  sameAddress,
  cohabitedLastYear,
  provideSupportLastYear,
  spousePhone,
  children,
  veteranGrossIncome,
  veteranNetIncome,
  veteranOtherIncome,
  deductibleMedicalExpenses,
  deductibleFuneralExpenses,
  deductibleEducationExpenses
} = fullSchemaHca.properties;

const {
  date,
  provider,
  phone,
  monetaryValue
} = fullSchemaHca.definitions;

const stateLabels = createUSAStateLabels(states);

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
    provider,
    fullName: fullNameSchema,
    ssn: ssnSchema,
    phone,
    child: childSchema,
    monetaryValue
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran/information',
          title: 'Veteran information',
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
          }
        }
      }
    },
    householdInformation: {
      title: 'Household Information',
      pages: {
        financialDisclosure: {
          path: 'household-information/financial-disclosure',
          title: 'Financial disclosure',
          uiSchema: {
            'ui:title': 'Financial disclosure',
            'ui:description': financialDisclosureText,
            discloseFinancialInformation: {
              'ui:title': 'Do you want to provide your financial information?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            required: ['discloseFinancialInformation'],
            properties: {
              discloseFinancialInformation
            }
          }
        },
        spouseInformation: {
          path: 'household-information/spouse-information',
          title: 'Spouse’s information',
          // TODO: When veteranInformation is completed, uncomment the maritalStatus comparison
          depends: (data) => {
            return data.discloseFinancialInformation; // &&
              // data.veteranInformation.data.maritalStatus === 'married'
          },
          uiSchema: {
            'ui:title': 'Spouse’s information',
            'ui:description': 'Please fill this out to the best of your knowledge. The more accurate your responses, the faster we can process your application.',
            spouseFullName: _.merge(fullNameUI, {
              'ui:title': 'Spouse Name'
            }),
            spouseSocialSecurityNumber: _.merge(ssnUI, {
              'ui:title': 'Spouse’s social security number',
            }),
            spouseDateOfBirth: {
              'ui:title': 'Date of birth'
            },
            dateOfMarriage: {
              'ui:title': 'Date of marriage'
            },
            sameAddress: {
              'ui:title': 'Do you have the same address as your spouse?',
              'ui:widget': 'yesNo'
            },
            cohabitedLastYear: {
              'ui:title': 'Did your spouse live with you last year?',
              'ui:widget': 'yesNo'
            },
            provideSupportLastYear: {
              'ui:title': 'If your spouse did not live with you last year, did you provide financial support?',
              'ui:widget': 'yesNo',
              'ui:options': {
                // Only show if 'No' is selected for cohabitedLastYear
                hideIf: (formData) => formData.cohabitedLastYear !== false
              }
            },
            'view:spouseContactInformation': {
              'ui:title': 'Spouse’s address and telephone number',
              'ui:options': {
                // Only show if 'No' is selected for sameAddress
                hideIf: (formData) => formData.sameAddress !== false
              },
              spouseAddress: _.merge(addressUI(''), {
                'ui:options': {
                  updateSchema: (formData) => {
                    // If formData.sameAddress === false, the address fields are
                    //  shown and should be required
                    return addressSchema(formData.sameAddress === false);
                  }
                }
              }),
              spousePhone: {
                'ui:title': 'Phone'
              }
            }
          },
          schema: {
            type: 'object',
            required: [
              'spouseSocialSecurityNumber',
              'spouseDateOfBirth',
              'dateOfMarriage',
              'sameAddress'
            ],
            properties: {
              spouseFullName,
              spouseSocialSecurityNumber,
              spouseDateOfBirth,
              dateOfMarriage,
              sameAddress,
              cohabitedLastYear,
              provideSupportLastYear,
              'view:spouseContactInformation': {
                type: 'object',
                properties: {
                  spouseAddress: addressSchema(),
                  spousePhone
                }
              }
            }
          }
        },
        childInformation: {
          path: 'household-information/child-information',
          title: 'Child information',
          depends: (data) => data.discloseFinancialInformation,
          uiSchema: {
            'view:reportChildren': {
              'ui:title': 'Do you have any children to report?',
              'ui:widget': 'yesNo'
            },
            children: {
              'ui:title': '',
              items: childUI,
              'ui:options': {
                expandUnder: 'view:reportChildren',
                itemName: 'Child',
                hideTitle: true,
                viewField: ChildView
              }
            }
          },
          schema: {
            type: 'object',
            required: ['view:reportChildren'],
            properties: {
              'view:reportChildren': { type: 'boolean' },
              children
            }
          }
        },
        annualIncome: {
          path: 'household-information/annual-income',
          title: 'Annual income',
          depends: (data) => data.discloseFinancialInformation,
          uiSchema: {
            'ui:title': 'Annual income',
            'ui:description': incomeDescription,
            veteranGrossIncome: {
              'ui:title': 'Veteran gross annual income from employment'
            },
            veteranNetIncome: {
              'ui:title': 'Veteran Net Income from your Farm, Ranch, Property or Business'
            },
            veteranOtherIncome: {
              'ui:title': 'Veteran Other Income Amount'
            }
          },
          schema: {
            type: 'object',
            required: ['veteranGrossIncome', 'veteranNetIncome', 'veteranOtherIncome'],
            properties: {
              veteranGrossIncome,
              veteranNetIncome,
              veteranOtherIncome
            }
          }
        },
        deductibleExpenses: {
          path: 'household-information/deductible-expenses',
          title: 'Deductible expenses',
          depends: (data) => data.discloseFinancialInformation,
          uiSchema: {
            'ui:title': 'Previous Calendar Year’s Deductible Expenses',
            'ui:description': 'Tell us a bit about your expenses this past calendar year. Enter information for any expenses that apply to you.',
            deductibleMedicalExpenses: {
              'ui:title': 'Amount you or your spouse paid in non-reimbursable medical expenses this past year.'
            },
            deductibleFuneralExpenses: {
              'ui:title': 'Amount you paid in funeral or burial expenses for a deceased spouse or child this past year.'
            },
            deductibleEducationExpenses: {
              'ui:title': 'Amount you paid for anything related to your own education (college or vocational) this past year. Do not list your dependents’ educational expenses.'
            }
          },
          schema: {
            type: 'object',
            required: ['deductibleMedicalExpenses', 'deductibleFuneralExpenses', 'deductibleEducationExpenses'],
            properties: {
              deductibleMedicalExpenses,
              deductibleFuneralExpenses,
              deductibleEducationExpenses
            }
          }
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
