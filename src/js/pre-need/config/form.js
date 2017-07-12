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
import { validateMatch } from '../../common/schemaform/validation';
import ServicePeriodView from '../../common/schemaform/ServicePeriodView';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ClaimantView from '../components/ClaimantView';
import EligibleBuriedView from '../components/EligibleBuriedView';
import SupportingDocumentsDescription from '../components/SupportingDocumentsDescription';
import {
  claimantHeader,
  formatName,
  isVeteran,
  requiresSponsorInfo,
  veteranUISchema
} from '../utils/helpers';

const {
  claimant,
  veteran,
  hasCurrentlyBuried,
  currentlyBuriedPersons,
  attachments
} = fullSchemaPreNeed.properties.applications.items.properties;

const {
  fullName,
  ssn,
  date,
  dateRange,
  gender,
  phone,
  files,
  vaFileNumber
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
    files,
    vaFileNumber
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation1: {
          title: 'Applicant information',
          path: 'applicant-information-1',
          uiSchema: {
            applications: {
              'ui:options': {
                viewField: ClaimantView,
              },
              items: {
                claimant: {
                  name: fullNameUI,
                  maidenName: {
                    'ui:title': 'Maiden name'
                  },
                  ssn: ssnUI,
                  dateOfBirth: currentOrPastDateUI('Date of birth'),
                  relationshipToVet: {
                    type: {
                      'ui:title': 'Relationship to Servicemember',
                      'ui:widget': 'radio',
                      'ui:options': {
                        labels: {
                          1: 'I am the Servicemember',
                          2: 'Spouse or surviving spouse',
                          3: 'Unmarried adult child',
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
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              applications: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    claimant: {
                      type: 'object',
                      properties: _.pick([
                        'name',
                        'maidenName',
                        'ssn',
                        'dateOfBirth',
                        'relationshipToVet'
                      ], claimant.properties)
                    }
                  }
                }
              }
            }
          }
        },
        applicantInformation2: {
          title: item => formatName(item.claimant.name),
          path: 'applicant-information-2/:index',
          showPagePerItem: true,
          arrayPath: 'applications',
          itemFilter: isVeteran,
          uiSchema: {
            applications: {
              items: {
                'ui:title': claimantHeader,
                veteran: veteranUISchema
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              applications: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    veteran: {
                      type: 'object',
                      properties: _.pick([
                        'militaryServiceNumber',
                        'vaClaimNumber',
                        'gender',
                        'placeOfBirth',
                        'maritalStatus',
                        'militaryStatus'
                      ], veteran.properties)
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    sponsorInformation: {
      title: 'Sponsor Information',
      pages: {
        sponsorInformation1: {
          title: item => formatName(item.claimant.name),
          path: 'sponsor-information-1/:index',
          showPagePerItem: true,
          arrayPath: 'applications',
          depends: formData => formData.applications.some(isVeteran),
          itemFilter: item => !isVeteran(item),
          uiSchema: {
            applications: {
              items: {
                'ui:title': claimantHeader,
                'view:sponsor': {
                  'ui:title': 'Who is your Sponsor?',
                  'ui:widget': 'radio',
                  'ui:options': {
                    updateSchema: (form, pageSchema) => {
                      const veterans = form.applications ?
                        form.applications.filter(isVeteran).map(
                          a => formatName(a.claimant.name)
                        ) : [];
                      return {
                        'enum': [...veterans, 'Other'],
                        enumNames: [...veterans, 'Other']
                      };
                    }
                  }
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              applications: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    'view:sponsor': {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        },
        sponsorInformation2: {
          title: item => formatName(item.claimant.name),
          path: 'sponsor-information-2/:index',
          showPagePerItem: true,
          arrayPath: 'applications',
          itemFilter: item => !isVeteran(item) && requiresSponsorInfo(item),
          uiSchema: {
            applications: {
              items: {
                'ui:title': claimantHeader,
                'ui:description': <p>You aren’t required to fill in <strong>all</strong> fields, but VA can evaluate your claim faster if you provide more information.</p>,
                veteran: _.merge(veteranUISchema, {
                  'ui:order': [
                    '*',
                    'isDeceased',
                    'maritalStatus',
                    'dateOfDeath'
                  ],
                  currentName: fullNameUI,
                  ssn: ssnUI,
                  dateOfBirth: currentOrPastDateUI('Date of birth'),
                  isDeceased: {
                    'ui:title': 'Is the sponsor deceased?',
                    'ui:widget': 'radio',
                    'ui:options': {
                      labels: {
                        yes: 'Yes',
                        no: 'No',
                        unsure: 'I don\'t know'
                      }
                    }
                  },
                  maritalStatus: {
                    'ui:options': {
                      expandUnder: 'isDeceased',
                      expandUnderCondition: 'no'
                    }
                  },
                  dateOfDeath: _.merge(currentOrPastDateUI('Date of death'), {
                    'ui:options': {
                      expandUnder: 'isDeceased',
                      expandUnderCondition: 'yes'
                    }
                  })
                })
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              applications: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    veteran: {
                      type: 'object',
                      properties: _.pick([
                        'currentName',
                        'ssn',
                        'dateOfBirth',
                        'dateOfDeath',
                        'militaryServiceNumber',
                        'vaClaimNumber',
                        'gender',
                        'placeOfBirth',
                        'maritalStatus',
                        'militaryStatus',
                        'isDeceased'
                      ], veteran.properties)
                    }
                  }
                }
              }
            }
          }
        },
      }
    },
    militaryHistory: {
      title: 'Military History',
      pages: {
        militaryHistory: {
          title: item => formatName(item.claimant.name),
          path: 'military-history/:index',
          showPagePerItem: true,
          arrayPath: 'applications',
          itemFilter: requiresSponsorInfo,
          uiSchema: {
            applications: {
              items: {
                'ui:title': claimantHeader,
                veteran: {
                  'ui:order': [
                    'serviceRecords',
                    'view:hasServiceName',
                    'serviceName'
                  ],
                  serviceRecords: {
                    'ui:title': 'Service periods',
                    'ui:description': 'Please record all periods of service',
                    'ui:options': {
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
                      highestRank: {
                        'ui:title': 'Highest rank attained'
                      }
                    }
                  },
                  'view:hasServiceName': {
                    'ui:title': 'Used a different name during service?',
                    'ui:widget': 'yesNo'
                  },
                  serviceName: _.merge(fullNameUI, {
                    'ui:options': {
                      expandUnder: 'view:hasServiceName'
                    }
                  })
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              applications: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    veteran: {
                      type: 'object',
                      properties: {
                        serviceRecords: veteran.properties.serviceRecords,
                        // TODO: Make fields required when expanded and not required when not.
                        serviceName: _.omit('required', fullName),
                        'view:hasServiceName': {
                          type: 'boolean'
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
    },
    burialBenefits: {
      title: 'Burial Benefits',
      pages: {
        burialBenefits: {
          title: 'Burial benefits',
          path: 'burial-benefits/:index',
          showPagePerItem: true,
          arrayPath: 'applications',
          itemFilter: requiresSponsorInfo,
          uiSchema: {
            applications: {
              items: {
                'ui:title': claimantHeader,
                claimant: {
                  desiredCemetery: {
                    'ui:title': 'Your desired VA National Cemetery'
                  }
                },
                hasCurrentlyBuried: {
                  'ui:title': 'Is there anyone currently buried in a VA National Cemetery under your eligibility?',
                  'ui:widget': 'radio',
                  'ui:options': {
                    labels: {
                      1: 'Yes',
                      2: 'No',
                      3: 'I don\'t know',
                    }
                  }
                },
                currentlyBuriedPersons: {
                  'ui:options': {
                    viewField: EligibleBuriedView,
                    expandUnder: 'hasCurrentlyBuried',
                    expandUnderCondition: '1'
                  },
                  items: {
                    name: {
                      'ui:title': 'Name of deceased'
                    },
                    cemeteryNumber: {
                      'ui:title': 'VA National Cemetery where they are buried'
                    }
                  }
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              applications: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    claimant: {
                      type: 'object',
                      properties: {
                        desiredCemetery: claimant.properties.desiredCemetery
                      }
                    },
                    hasCurrentlyBuried,
                    currentlyBuriedPersons
                  }
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
          path: 'supporting-documents/:index',
          editModeOnReviewPage: true,
          showPagePerItem: true,
          arrayPath: 'applications',
          itemFilter: requiresSponsorInfo,
          uiSchema: {
            applications: {
              items: {
                'ui:title': claimantHeader,
                'ui:description': SupportingDocumentsDescription,
                attachments: fileUploadUI('Select files to upload')
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              applications: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    attachments
                  }
                }
              }
            }
          }
        }
      }
    },
    /*
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
    */
  }
};

export default formConfig;
