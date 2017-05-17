import _ from 'lodash/fp';

import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import {
  states,
  genders,
  maritalStatuses
} from '../../common/utils/options-for-select';

import { validateMatch } from '../../common/schemaform/validation';
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

import fullNameUI from '../../common/schemaform/definitions/fullName';
import { schema as addressSchema, uiSchema as addressUI } from '../../common/schemaform/definitions/address';
import { schema as childSchema, uiSchema as childUI } from '../definitions/child';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import ssnUI from '../../common/schemaform/definitions/ssn';

const {
  mothersMaidenName,
  cityOfBirth,
  isSpanishHispanicLatino,
  isAmericanIndianOrAlaskanNative,
  isBlackOrAfricanAmerican,
  isNativeHawaiianOrOtherPacificIslander,
  isAsian,
  isWhite,
  email,
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
  spouseGrossIncome,
  spouseNetIncome,
  spouseOtherIncome,
  deductibleMedicalExpenses,
  deductibleFuneralExpenses,
  deductibleEducationExpenses
} = fullSchemaHca.properties;

const {
  fullName,
  date,
  provider,
  phone,
  monetaryValue,
  ssn
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
    fullName,
    ssn: ssn.oneOf[0], // Mmm...not a fan.
    phone,
    child: childSchema(fullSchemaHca),
    monetaryValue,
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
            veteranFullName: _.merge(fullNameUI, {
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
              veteranFullName: fullName,
              mothersMaidenName
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
            veteranSocialSecurityNumber: ssnUI,
            'view:placeOfBirth': {
              'ui:title': 'Place of birth',
              cityOfBirth: {
                'ui:title': 'City'
              },
              stateOfBirth: {
                'ui:title': 'State',
                'ui:options': {
                  labels: stateLabels
                }
              }
            }
          },
          schema: {
            type: 'object',
            required: ['veteranDateOfBirth', 'veteranSocialSecurityNumber'],
            properties: {
              veteranDateOfBirth: date,
              veteranSocialSecurityNumber: ssn.oneOf[0],
              'view:placeOfBirth': {
                type: 'object',
                properties: {
                  cityOfBirth,
                  stateOfBirth: {
                    type: 'string',
                    'enum': states.USA.map(state => state.value)
                  }
                }
              }
            }
          }
        },
        demographicInformation: {
          path: 'veteran-information/demographic-information',
          title: 'Veteran information',
          initialData: {},
          uiSchema: {
            gender: {
              'ui:title': 'Gender'
            },
            maritalStatus: {
              'ui:title': 'Marital status'
            },
            'view:demographicCategories': {
              'ui:title': 'Which categories best describe you?',
              'ui:description': 'You may check more than one.',
              isSpanishHispanicLatino: {
                'ui:title': 'Spanish, Hispanic, or Latino'
              },
              isAmericanIndianOrAlaskanNative: {
                'ui:title': 'American Indian or Alaskan Native'
              },
              isBlackOrAfricanAmerican: {
                'ui:title': 'Black or African American'
              },
              isNativeHawaiianOrOtherPacificIslander: {
                'ui:title': 'Native Hawaiian or Other Pacific Islander'
              },
              isAsian: {
                'ui:title': 'Asian'
              },
              isWhite: {
                'ui:title': 'White'
              }
            }
          },
          schema: {
            type: 'object',
            required: ['gender', 'maritalStatus'],
            properties: {
              gender: {
                type: 'string',
                'enum': genders.map(gender => gender.value),
                enumNames: genders.map(gender => gender.label)
              },
              maritalStatus: {
                type: 'string',
                'enum': maritalStatuses
              },
              'view:demographicCategories': {
                type: 'object',
                properties: {
                  isSpanishHispanicLatino,
                  isAmericanIndianOrAlaskanNative,
                  isBlackOrAfricanAmerican,
                  isNativeHawaiianOrOtherPacificIslander,
                  isAsian,
                  isWhite
                }
              }
            }
          }
        },
        veteranAddress: {
          path: 'veteran-information/veteran-address',
          title: 'Permanent address',
          initialData: {},
          uiSchema: {
            address: addressUI('Permanent address', true)
          },
          schema: {
            type: 'object',
            properties: {
              address: _.merge(addressSchema(fullSchemaHca, true), {
                properties: {
                  street: {
                    minLength: 1,
                    maxLength: 30
                  },
                  street2: {
                    minLength: 1,
                    maxLength: 30
                  },
                  street3: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 30
                  },
                  city: {
                    minLength: 1,
                    maxLength: 30
                  }
                }
              })
            }
          }
        },
        contactInformation: {
          path: 'veteran-information/contact-information',
          title: 'Contact information',
          initialData: {},
          uiSchema: {
            'ui:validations': [
              validateMatch('email', 'view:emailConfirmation')
            ],
            email: {
              'ui:title': 'Email address',
              'ui:errorMessages': {
                pattern: 'Please put your email in this format x@x.xxx'
              }
            },
            'view:emailConfirmation': {
              'ui:title': 'Re-enter email address',
              'ui:errorMessages': {
                pattern: 'Please put your email in this format x@x.xxx'
              }
            },
            homePhone: {
              'ui:title': 'Home telephone number',
              'ui:errorMessages': {
                pattern: 'Phone number must be 10 digits'
              }
            },
            mobilePhone: {
              'ui:title': 'Mobile telephone number',
              'ui:errorMessages': {
                pattern: 'Phone number must be 10 digits'
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              email,
              'view:emailConfirmation': email,
              homePhone: phone,
              mobilePhone: phone
            }
          }
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
              currentOrPastDateUI('What is your Medicare Part A effective date?'), {
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
            cohabitedLastYear: {
              'ui:title': 'Did your spouse live with you last year?',
              'ui:widget': 'yesNo'
            },
            provideSupportLastYear: {
              'ui:title': 'If your spouse did not live with you last year, did you provide financial support?',
              'ui:widget': 'yesNo',
              'ui:options': {
                expandUnder: 'cohabitedLastYear',
                expandUnderCondition: false
              }
            },
            sameAddress: {
              'ui:title': 'Do you have the same address as your spouse?',
              'ui:widget': 'yesNo'
            },
            'view:spouseContactInformation': {
              'ui:title': 'Spouse’s address and telephone number',
              'ui:options': {
                expandUnder: 'sameAddress',
                expandUnderCondition: false
              },
              spouseAddress: _.merge(addressUI('', true), {
                'ui:options': {
                  updateSchema: (formData) => {
                    // If formData.sameAddress === false, the address fields are
                    //  shown and should be required
                    return addressSchema(fullSchemaHca, formData.sameAddress === false);
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
              cohabitedLastYear,
              provideSupportLastYear,
              sameAddress,
              'view:spouseContactInformation': {
                type: 'object',
                properties: {
                  spouseAddress: addressSchema(fullSchemaHca),
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
            },
            'view:spouseIncome': {
              'ui:title': 'Spouse income',
              'ui:options': {
                hideIf: (formData) => formData.maritalStatus !== 'married' // Something else too?
              },
              spouseGrossIncome: {
                'ui:title': 'Spouse gross annual income from employment',
                'ui:required': (formData) => formData.maritalStatus === 'married'
              },
              spouseNetIncome: {
                'ui:title': 'Spouse Net Income from your Farm, Ranch, Property or Business',
                'ui:required': (formData) => formData.maritalStatus === 'married'
              },
              spouseOtherIncome: {
                'ui:title': 'Spouse Other Income Amount',
                'ui:required': (formData) => formData.maritalStatus === 'married'
              }
            },
            'view:childrenIncome': {
              'ui:options': {
                // Or should this be !formData.reportChildren?
                hideIf: (formData) => !_.get('children.length', formData)
              }
            }
          },
          schema: {
            type: 'object',
            required: ['veteranGrossIncome', 'veteranNetIncome', 'veteranOtherIncome'],
            properties: {
              veteranGrossIncome,
              veteranNetIncome,
              veteranOtherIncome,
              'view:spouseIncome': {
                type: 'object',
                properties: {
                  spouseGrossIncome,
                  spouseNetIncome,
                  spouseOtherIncome
                }
              },
              'view:childrenIncome': {}
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
            lastEntryDate: currentOrPastDateUI('Start of service period'),
            lastDischargeDate: currentOrPastDateUI('Date of discharge'),
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
              lastServiceBranch,
              lastEntryDate,
              lastDischargeDate,
              dischargeType
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
