import React from 'react';
import _ from 'lodash/fp';

import fullSchemaPreNeed from './schema.json';

import * as address from '../../common/schemaform/definitions/address';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import dateRangeUI from '../../common/schemaform/definitions/dateRange';
import fileUploadUI from '../../common/schemaform/definitions/file';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import phoneUI from '../../common/schemaform/definitions/phone';
import { validateMatch } from '../../common/schemaform/validation';
import ServicePeriodView from '../../common/schemaform/ServicePeriodView';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ClaimantView from '../components/ClaimantView';
import EligibleBuriedView from '../components/EligibleBuriedView';
import SupportingDocumentsDescription from '../components/SupportingDocumentsDescription';
import {
  GetFormHelp,
  claimantHeader,
  formatName,
  isVeteran,
  requiresSponsorInfo,
  transform,
  fullMaidenNameUI,
  ssnDashesUI,
  veteranUI
} from '../utils/helpers';


const {
  claimant,
  veteran,
  applicant,
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
  email,
  phone,
  files,
  vaFileNumber
} = fullSchemaPreNeed.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/preneed',
  trackingPrefix: 'preneed-',
  transformForSubmit: transform,
  formId: '40-10007',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  disableSave: true,
  title: 'Apply online for pre-need determination of eligibility in a VA National Cemetery',
  subTitle: 'Form 40-10007',
  getHelp: GetFormHelp,
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    gender,
    email,
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
                  name: fullMaidenNameUI,
                  ssn: ssnDashesUI,
                  dateOfBirth: currentOrPastDateUI('Date of birth'),
                  relationshipToVet: {
                    'ui:title': 'Relationship to Servicemember',
                    'ui:widget': 'radio',
                    'ui:options': {
                      labels: {
                        1: 'I am the Servicemember/Veteran',
                        2: 'Spouse or surviving spouse',
                        3: 'Unmarried adult child',
                        4: 'Other'
                      },
                      nestedContent: {
                        1: <div className="usa-alert usa-alert-info no-background-image">You're applying as the <strong>Servicemember or Veteran</strong> whose military status and history will be used to decide if you qualify for burial in a VA national cemetery.</div>,
                        2: <div className="usa-alert usa-alert-info no-background-image">You're applying as the <strong>legally married spouse or surviving spouse</strong> of the Servicemember or Veteran who's sponsoring this application. First, we'll ask for your information as the applicant. Then, we'll ask for your sponsor's information.</div>,
                        3: <div className="usa-alert usa-alert-info no-background-image">You're applying as the <strong>unmarried adult child</strong> of the Servicemember or Veteran who's sponsoring this application. First, we'll ask for your information as the applicant. Then, we'll ask for your sponsor's information. You'll also need to provide supporting documents with information about your disability.</div>,
                      }
                    }
                  },
                  /*
                  'view:other': {
                    'ui:title': 'Please specify',
                    'ui:required': (form) => get(form, 'relationship.type') === '4',
                    'ui:options': {
                      hideIf: (form) => get(form, 'relationship.type') !== '4'
                    }
                  }
                  */
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
                      required: [
                        'name',
                        'ssn',
                        'dateOfBirth',
                        'relationshipToVet'
                      ],
                      properties: _.pick([
                        'name',
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
                veteran: veteranUI
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
                      required: [
                        'gender',
                        'maritalStatus',
                        'militaryStatus'
                      ],
                      properties: _.pick([
                        'militaryServiceNumber',
                        'vaClaimNumber',
                        'placeOfBirth',
                        'gender',
                        'maritalStatus',
                        'militaryStatus'
                      ], _.set('militaryStatus.enum', [
                        'V', 'R', 'A', 'E', 'S', 'O', 'X'
                      ], veteran.properties))
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
          depends: formData => formData.applications && formData.applications.some(isVeteran),
          itemFilter: item => !isVeteran(item),
          uiSchema: {
            applications: {
              items: {
                'ui:title': claimantHeader,
                'view:sponsor': {
                  'ui:title': 'Who is your Sponsor?',
                  'ui:widget': 'radio',
                  'ui:options': {
                    updateSchema: form => {
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
                'ui:description': <p>You aren't required to fill in <strong>all</strong> fields, but VA can evaluate your claim faster if you provide more information.</p>,
                veteran: _.merge(veteranUI, {
                  currentName: _.merge(fullNameUI, {
                    first: {
                      'ui:title': 'Sponsor\'s first name'
                    },
                    last: {
                      'ui:title': 'Sponsor\'s last name'
                    },
                    middle: {
                      'ui:title': 'Sponsor\'s middle name'
                    },
                    suffix: {
                      'ui:title': 'Sponsor\'s suffix'
                    },
                    maiden: {
                      'ui:title': 'Sponsor\'s maiden name'
                    }
                  }),
                  militaryServiceNumber: {
                    'ui:title': 'Sponsor\'s Military Service number (if they have one that\'s different than their Social Security number)'
                  },
                  vaClaimNumber: {
                    'ui:title': 'Sponsor\'s VA claim number (if known)'
                  },
                  ssn: {
                    ...ssnDashesUI,
                    'ui:title': 'Sponsor\'s social security number'
                  },
                  dateOfBirth: currentOrPastDateUI('Sponsor\'s date of birth'),
                  placeOfBirth: {
                    'ui:title': 'Sponsor\'s place of birth'
                  },
                  gender: {
                    'ui:title': 'Sponsor\'s gender'
                  },
                  maritalStatus: {
                    'ui:title': 'Sponsor\'s marital status'
                  },
                  militaryStatus: {
                    'ui:title': 'Sponsor\'s current military status (You can add more service history information later in this application)',
                    'ui:options': {
                      nestedContent: {
                        X: <div className="usa-alert usa-alert-info no-background-image">If you're not sure what your sponsor's status is—or if it isn't listed here—don't worry. You can upload supporting documents showing your sponsor's service history later in this application.</div>
                      }
                    }
                  },
                  isDeceased: {
                    'ui:title': 'Has the sponsor died?',
                    'ui:widget': 'radio',
                    'ui:options': {
                      labels: {
                        yes: 'Yes',
                        no: 'No',
                        unsure: 'I don\'t know'
                      }
                    }
                  },
                  dateOfDeath: _.merge(currentOrPastDateUI('Sponsor\'s date of death'), {
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
                      required: [
                        'ssn',
                        'gender',
                        'maritalStatus',
                        'militaryStatus',
                        'isDeceased'
                      ],
                      properties: _.pick([
                        'currentName',
                        'ssn',
                        'dateOfBirth',
                        'militaryServiceNumber',
                        'vaClaimNumber',
                        'placeOfBirth',
                        'gender',
                        'maritalStatus',
                        'militaryStatus',
                        'isDeceased',
                        'dateOfDeath',
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
                            1: 'Honorable',
                            2: 'General',
                            3: 'Entry Level Separation/Uncharacterized',
                            4: 'Other Than Honorable',
                            5: 'Bad Conduct',
                            6: 'Dishonorable',
                            7: 'Other'
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
          title: item => formatName(item.claimant.name),
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
          title: item => formatName(item.claimant.name),
          path: 'supporting-documents/:index',
          editModeOnReviewPage: true,
          showPagePerItem: true,
          arrayPath: 'applications',
          uiSchema: {
            applications: {
              items: {
                'ui:title': claimantHeader,
                'ui:description': SupportingDocumentsDescription,
                attachments: _.merge(fileUploadUI('Select files to upload'), {
                  endpoint: ''
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
                    attachments
                  }
                }
              }
            }
          }
        }
      }
    },
    contactInformation: {
      title: 'Contact Information',
      pages: {
        contactInformation: {
          title: item => formatName(item.claimant.name),
          path: 'contact-information/:index',
          showPagePerItem: true,
          arrayPath: 'applications',
          uiSchema: {
            applications: {
              items: {
                'ui:title': claimantHeader,
                claimant: {
                  address: address.uiSchema(),
                  'view:otherContactInfo': {
                    'ui:title': 'Other contact information',
                    'ui:description': 'Please enter as much contact information as possible so VA can get in touch with you, if necessary.',
                    'ui:validations': [
                      validateMatch('email', 'view:confirmEmail')
                    ],
                    phoneNumber: phoneUI('Primary telephone number'),
                    email: {
                      'ui:title': 'Email address'
                    },
                    'view:confirmEmail': {
                      'ui:title': 'Re-enter email address',
                      'ui:options': {
                        hideOnReview: true
                      }
                    }
                  }
                },
                veteran: {
                  address: _.merge(address.uiSchema('Sponsor address'), {
                    'ui:options': {
                      hideIf: (formData, index) => isVeteran(formData.applications[index])
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
                    claimant: {
                      type: 'object',
                      properties: {
                        address: address.schema(fullSchemaPreNeed),
                        'view:otherContactInfo': {
                          type: 'object',
                          properties: {
                            phoneNumber: claimant.properties.phoneNumber,
                            email: claimant.properties.email,
                            'view:confirmEmail': {
                              type: 'string',
                              format: 'email'
                            },
                          }
                        }
                      }
                    },
                    veteran: {
                      type: 'object',
                      properties: {
                        address: address.schema(fullSchemaPreNeed)
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
    certification: {
      title: 'Certification',
      pages: {
        certification: {
          title: 'Certification',
          path: 'certification',
          uiSchema: {
            'view:preparer': {
              'ui:title': 'Who is filling out this form?',
              'ui:widget': 'radio',
              'ui:options': {
                updateSchema: form => {
                  const claimants = form.applications ?
                    form.applications.map(
                      a => formatName(a.claimant.name)
                    ) : [];
                  return {
                    'enum': [...claimants, 'Other'],
                    enumNames: [...claimants, 'Other']
                  };
                }
              }
            },
            applicant: {
              'ui:options': {
                expandUnder: 'view:preparer',
                expandUnderCondition: 'Other'
              },
              name: _.merge(fullNameUI, {
                'ui:title': 'Preparer information',
                suffix: {
                  'ui:options': {
                    hideIf: () => true
                  }
                }
              }),
              mailingAddress: address.uiSchema('Mailing address'),
              'view:contactInfo': {
                'ui:title': 'Contact information',
                applicantPhoneNumber: phoneUI('Primary telephone number')
              }
            }
          },
          schema: {
            type: 'object',
            required: ['view:preparer'],
            properties: {
              'view:preparer': {
                type: 'string'
              },
              applicant: {
                type: 'object',
                properties: {
                  // TODO: Make fields required when expanded and not required when not.
                  name: _.omit('required', fullName),
                  mailingAddress: address.schema(fullSchemaPreNeed, /* true */),
                  'view:contactInfo': {
                    type: 'object',
                    // required: ['applicantPhoneNumber'],
                    properties: {
                      applicantPhoneNumber: applicant.properties.applicantPhoneNumber
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
