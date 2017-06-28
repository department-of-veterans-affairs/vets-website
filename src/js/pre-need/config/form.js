import React from 'react';
import _ from 'lodash/fp';

import fullSchemaPreNeed from './schema.json';

import * as address from '../../common/schemaform/definitions/address';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import dateRangeUI from '../../common/schemaform/definitions/dateRange';
import fileUploadUI from '../../common/schemaform/definitions/file';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import phoneUI from '../../common/schemaform/definitions/phone';
import ssnUI from '../../common/schemaform/definitions/ssn';
import { validateBooleanGroup, validateMatch } from '../../common/schemaform/validation';
import ServicePeriodView from '../../common/schemaform/ServicePeriodView';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import EligibleBuriedView from '../components/EligibleBuriedView';
import SupportingDocumentsDescription from '../components/SupportingDocumentsDescription';

const {
  relationship,
  veteranFullName,
  veteranMaidenName,
  veteranSocialSecurityNumber,
  veteranDateOfBirth,
  sponsorFullName,
  sponsorSocialSecurityNumber,
  sponsorMilitaryServiceNumber,
  sponsorVAClaimNumber,
  sponsorDateOfBirth,
  sponsorPlaceOfBirth,
  sponsorDeceased,
  sponsorDateOfDeath,
  sponsorGender,
  sponsorMaritalStatus,
  sponsorMilitaryStatus,
  toursOfDuty,
  desiredCemetery,
  currentlyBuried,
  eligibleBuried,
  email,
  phoneNumber,
  documents,
  preparerFullName,
  preparerPhoneNumber
} = fullSchemaPreNeed.properties;

const {
  fullName,
  ssn,
  date,
  dateRange,
  gender,
  phone,
  files
} = fullSchemaPreNeed.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/preneed',
  trackingPrefix: 'preneed-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  disableSave: true,
  title: 'Apply online for pre-need determination of eligibility in a VA National Cemetery',
  subTitle: 'Form 40-10007',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    gender,
    phone,
    files
  },
  chapters: {
    veteranInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation1: {
          title: 'Applicant information',
          path: 'applicant-information-1',
          uiSchema: {
            relationship: {
              type: {
                'ui:title': 'What\'s your relationship to the Servicemember whose benefit you are claiming?',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: {
                    servicemember: 'I am the Servicemember',
                    spouseOrChild: 'Spouse, surviving spouse, or unmarried adult child',
                    other: 'Other'
                  }
                }
              },
              other: {
                'ui:title': 'Please specify your relationship',
                // 'ui:required': (form) => _.get('relationship.type', form) === 'other',
                'ui:options': {
                  hideIf: (form) => _.get('relationship.type', form) !== 'other'
                }
              }
            },
          },
          schema: {
            type: 'object',
            required: ['relationship'],
            properties: {
              relationship
            }
          }
        },
        applicantInformation2: {
          title: 'Applicant information',
          path: 'applicant-information-2',
          uiSchema: {
            'ui:description': <p>You aren’t required to fill in <strong>all</strong> fields, but VA can evaluate your claim faster if you provide more information.</p>,
            veteranFullName: fullNameUI,
            veteranMaidenName: {
              'ui:title': 'Maiden name (if applicable)'
            },
            veteranSocialSecurityNumber: ssnUI,
            veteranDateOfBirth: currentOrPastDateUI('Date of birth')
          },
          schema: {
            type: 'object',
            required: [
              'veteranSocialSecurityNumber',
              'veteranDateOfBirth'
            ],
            properties: {
              veteranFullName,
              veteranMaidenName,
              veteranSocialSecurityNumber,
              veteranDateOfBirth
            }
          }
        },
        sponsorInformation: {
          title: 'Sponsor information',
          path: 'sponsor-information',
          uiSchema: {
            sponsorFullName: fullNameUI,
            sponsorSocialSecurityNumber: _.merge(ssnUI, {
              'ui:title': 'Sponsor Social Security number'
            }),
            sponsorMilitaryServiceNumber: {
              'ui:title': 'Sponsor Military Service number (if different from Social Security number)'
            },
            sponsorVAClaimNumber: {
              'ui:title': 'Sponsor VA claim number (if known)'
            },
            sponsorDateOfBirth: currentOrPastDateUI('Sponsor date of birth'),
            sponsorPlaceOfBirth: {
              'ui:title': 'Sponsor place of birth'
            },
            sponsorDeceased: {
              'ui:title': 'Is the Sponsor deceased?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  Y: 'Yes',
                  N: 'No',
                  U: 'I don\'t know'
                }
              }
            },
            sponsorDateOfDeath: _.merge(currentOrPastDateUI('Sponsor date of death'), {
              'ui:options': {
                expandUnder: 'sponsorDeceased',
                expandUnderCondition: 'Y'
              }
            }),
            sponsorAddress: _.merge(address.uiSchema(), {
              'ui:title': 'Sponsor address',
              'ui:options': {
                expandUnder: 'sponsorDeceased',
                expandUnderCondition: 'N'
              }
            }),
            sponsorGender: {
              'ui:title': 'Sponsor gender',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  F: 'Female',
                  M: 'Male'
                }
              }
            },
            sponsorMaritalStatus: {
              'ui:title': 'Sponsor marital status',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  single: 'Single',
                  separated: 'Separated',
                  married: 'Married',
                  divorced: 'Divorced',
                  widowed: 'Widowed'
                }
              }
            },
            sponsorMilitaryStatus: {
              'ui:title': 'Sponsor military status to determine eligibility. Check all that apply.',
              veteran: {
                'ui:title': 'Veteran'
              },
              retiredActiveDuty: {
                'ui:title': 'Retired Active Duty'
              },
              diedOnActiveDuty: {
                'ui:title': 'Died on Active Duty'
              },
              retiredReserve: {
                'ui:title': 'Retired Reserve'
              },
              retiredNationalGuard: {
                'ui:title': 'Retired National Guard'
              },
              deathInactiveDuty: {
                'ui:title': 'Death Related to Inactive Duty Training'
              },
              other: {
                'ui:title': 'Other'
              },
              'ui:validations': [
                validateBooleanGroup
              ],
              'ui:options': {
                showFieldLabel: true
              }
            }
          },
          schema: {
            type: 'object',
            required: [
              'sponsorSocialSecurityNumber',
              'sponsorDeceased',
              'sponsorGender',
              'sponsorMaritalStatus',
              'sponsorMilitaryStatus'
            ],
            properties: {
              sponsorFullName,
              sponsorSocialSecurityNumber,
              sponsorMilitaryServiceNumber,
              sponsorVAClaimNumber,
              sponsorDateOfBirth,
              sponsorPlaceOfBirth,
              sponsorDeceased,
              sponsorDateOfDeath,
              sponsorAddress: address.schema(fullSchemaPreNeed),
              sponsorGender,
              sponsorMaritalStatus,
              sponsorMilitaryStatus
            }
          }
        }
      }
    },
    militaryHistory: {
      title: 'Military History',
      pages: {
        militaryHistory: {
          title: 'Military history',
          path: 'military-history',
          uiSchema: {
            toursOfDuty: {
              'ui:title': 'Service periods',
              'ui:description': 'Please record all periods of service',
              'ui:options': {
                itemName: 'Service Period',
                viewField: ServicePeriodView
              },
              items: {
                'ui:order': ['serviceBranch', '*'],
                serviceBranch: {
                  'ui:title': 'Branch of service'
                },
                dateRange: dateRangeUI(
                  'Start of service period',
                  'End of service period',
                  'End of service must be after start of service'
                ),
                dischargeType: {
                  'ui:title': 'Discharge character of service',
                  'ui:options': {
                    labels: {
                      honorable: 'Honorable',
                      general: 'General',
                      other: 'Other Than Honorable',
                      'bad-conduct': 'Bad Conduct',
                      dishonorable: 'Dishonorable',
                      undesirable: 'Undesirable'
                    }
                  }
                },
                rank: {
                  'ui:title': 'Highest rank attained'
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              toursOfDuty
            }
          }
        }
      }
    },
    burialBenefits: {
      title: 'Burial Benefits',
      pages: {
        burialBenefits: {
          title: 'Burial benefits',
          path: 'burial-benefits',
          uiSchema: {
            desiredCemetery: {
              'ui:title': 'Your desired VA National Cemetery'
            },
            currentlyBuried: {
              'ui:title': 'Is there anyone currently buried in a VA National Cemetery under your eligibility?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  Y: 'Yes',
                  N: 'No',
                  U: 'I don\'t know'
                }
              }
            },
            eligibleBuried: {
              'ui:options': {
                viewField: EligibleBuriedView,
                expandUnder: 'currentlyBuried',
                expandUnderCondition: 'Y'
              },
              items: {
                name: {
                  'ui:title': 'Name of deceased'
                },
                cemetery: {
                  'ui:title': 'VA National Cemetery where they are buried'
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              desiredCemetery,
              currentlyBuried,
              eligibleBuried
            }
          }
        }
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        personalInformation: {
          title: 'Personal information',
          path: 'personal-information',
          uiSchema: {
            personalAddress: address.uiSchema(),
            'view:otherContactInfo': {
              'ui:title': 'Other contact information',
              'ui:description': 'Please enter as much contact information as possible so VA can get in touch with you, if necessary.',
              'ui:validations': [
                validateMatch('email', 'view:confirmEmail')
              ],
              email: {
                'ui:title': 'Email address'
              },
              'view:confirmEmail': {
                'ui:title': 'Re-enter email address',
                'ui:options': {
                  hideOnReview: true
                }
              },
              phoneNumber: phoneUI('Primary telephone number')
            }
          },
          schema: {
            type: 'object',
            properties: {
              personalAddress: address.schema(fullSchemaPreNeed),
              'view:otherContactInfo': {
                type: 'object',
                properties: {
                  email,
                  'view:confirmEmail': {
                    type: 'string',
                    format: 'email'
                  },
                  phoneNumber
                }
              }
            }
          }
        }
      }
    },
    supportingDocuments: {
      title: 'Supporting documents',
      pages: {
        supportingDocuments: {
          title: 'supportingDocuments',
          path: 'supporting-documents',
          editModeOnReviewPage: true,
          uiSchema: {
            'ui:description': SupportingDocumentsDescription,
            documents: fileUploadUI('Select files to upload')
          },
          schema: {
            type: 'object',
            properties: {
              documents
            }
          }
        }
      }
    },
    certification: {
      title: 'Certification',
      pages: {
        certification: {
          title: 'Certification',
          path: 'certification',
          uiSchema: {
            'view:isPreparer': {
              'ui:title': 'Is someone else filling out this application for you?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  N: 'No',
                  Y: 'Yes'
                }
              }
            },
            'view:preparer': {
              'ui:options': {
                expandUnder: 'view:isPreparer',
                expandUnderCondition: 'Y'
              },
              preparerFullName: _.merge(fullNameUI, {
                'ui:title': 'Preparer information',
                suffix: {
                  'ui:options': {
                    hideIf: () => true
                  }
                }
              }),
              preparerAddress: address.uiSchema('Mailing address'),
              'view:contactInfo': {
                'ui:title': 'Contact information',
                preparerPhoneNumber: phoneUI('Primary telephone number')
              }
            }
          },
          schema: {
            type: 'object',
            required: ['view:isPreparer'],
            properties: {
              'view:isPreparer': {
                type: 'string',
                'enum': ['N', 'Y']
              },
              'view:preparer': {
                type: 'object',
                properties: {
                  preparerFullName,
                  preparerAddress: address.schema(fullSchemaPreNeed, true),
                  'view:contactInfo': {
                    type: 'object',
                    required: ['preparerPhoneNumber'],
                    properties: {
                      preparerPhoneNumber
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
