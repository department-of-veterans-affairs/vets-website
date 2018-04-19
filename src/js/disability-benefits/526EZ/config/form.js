import _ from '../../../../platform/utilities/data';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
// NOTE: Easier to run schema locally with hot reload for dev
// import fullSchema526EZ from '/local/path/vets-json-schema/dist/21-526EZ-schema.json';
import fileUploadUI from '../../../common/schemaform/definitions/file';
import ServicePeriodView from '../../../common/schemaform/components/ServicePeriodView';
import dateRangeUI from '../../../common/schemaform/definitions/dateRange';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// TODO: Load live user prefill data from network
// TODO: initialData for dev / testing purposes only and should be removed for production
import initialData from '../../../../../test/disability-benefits/526EZ/schema/initialData';

import {
  transform,
  supportingEvidenceOrientation,
  evidenceTypesDescription,
  evidenceTypeHelp,
  disabilityNameTitle,
  vaMedicalRecordsIntro,
  privateMedicalRecordsIntro,
  privateRecordsChoice,
  privateRecordsChoiceHelp,
  facilityDescription,
  treatmentView,
  recordReleaseWarning,
  // validateAddress, // TODO: This needs to be fleshed out
  documentDescription,
  evidenceSummaryView,
  additionalDocumentDescription,
  GetFormHelp,
  specialCircumstancesDescription,
  FDCDescription,
  FDCWarning,
  noFDCWarning,
} from '../helpers';

const {
  treatments,
  privateRecordReleases
} = fullSchema526EZ.properties;

const {
  date,
  dateRange,
  servicePeriods,
  // files
  privateTreatmentCenterAddress,
} = fullSchema526EZ.definitions;

const FIFTY_MB = 52428800;

// TODO: Remove once typeahead supports auto-filling address and treatment center type
const vaTreatments = ((treatmentsCommonDef) => {
  const { type, maxItems, items } = treatmentsCommonDef;

  return {
    type,
    maxItems,
    items: {
      type: items.type,
      // TODO: use standard required property once treatmentCenterType added
      // back in schema (because it's required)
      required: ['treatmentCenterName'],
      properties: _.omit(
        ['treatmentCenterAddress', 'treatmentCenterType'],
        items.properties
      )
    }
  };

})(treatments);

const formConfig = {
  urlPrefix: '/',
  intentToFileUrl: '/evss_claims/intent_to_file/compensation',
  // submitUrl: '/v0/21-526EZ',
  submit: () => Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'disability-526EZ-',
  formId: '21-526EZ',
  version: 1,
  migrations: [],
  prefillEnabled: true,
  verifyRequiredPrefill: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for disability claims increase.',
    noAuth: 'Please sign in again to resume your application for disability claims increase.'
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  getHelp: GetFormHelp,
  defaultDefinitions: {
    date,
    dateRange,
    servicePeriods,
    // files
    privateTreatmentCenterAddress
  },
  title: 'Apply for increased disability compensation',
  subTitle: 'Form 21-526EZ',
  // getHelp: GetFormHelp, // TODO: May need updated form help content
  chapters: {
    reviewVeteranDetails: {
      title: 'Review Veteran Details',
      pages: {
        // veteranInformation:
        // primaryAddress:
        // paymentInformation:
        specialCircumstances: {
          title: 'Special Circumstances',
          path: 'special-circumstances',
          uiSchema: {
            'ui:description': specialCircumstancesDescription,
            'view:suicidal': {
              'ui:title': 'In crisis or thinking of suicide?'
            },
            'view:homeless': {
              'ui:title': 'Homeless or at risk of becoming homeless?'
            },
            'view:extremeFinancialHardship': {
              'ui:title': 'Suffering from extreme financial hardship?'
            },
            'view:blindOrSightImpaired': {
              'ui:title': 'Blind or sight-impaired?'
            }
          },
          schema: {
            type: 'object',
            properties: {
              'view:suicidal': {
                type: 'boolean'
              },
              'view:homeless': {
                type: 'boolean'
              },
              'view:extremeFinancialHardship': {
                type: 'boolean'
              },
              'view:blindOrSightImpaired': {
                type: 'boolean'
              }
            }
          }
        },
        militaryHistory: {
          title: 'Military service history',
          path: 'review-veteran-details/military-service-history',
          'ui:description': 'things',
          initialData,
          uiSchema: {
            servicePeriods: {
              'ui:title': 'Military service history',
              'ui:description':
                'This is the service history we have on file for you. If you need to update your service history, you can edit or add another service period.',
              'ui:options': {
                itemName: 'Service Period',
                viewField: ServicePeriodView,
                reviewMode: true
              },
              items: {
                serviceBranch: {
                  'ui:title': 'Branch of service'
                },
                dateRange: dateRangeUI(
                  'Service start date',
                  'Service end date',
                  'End of service must be after start of service'
                ),
                dischargeType: {
                  'ui:title': 'Character of discharge',
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
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              servicePeriods
            }
          }
        }
      }
    },
    chapterThree: {
      title: 'Chapter Three',
      pages: {
        pageOne: {
          title: 'Page One',
          path: 'chapter-three/page-one',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {}
          }
        }
      }
    },
    supportingEvidence: {
      title: 'Supporting Evidence',
      pages: {
        orientation: {
          title: '',
          path: 'supporting-evidence/orientation',
          initialData,
          uiSchema: {
            'ui:description': supportingEvidenceOrientation
          },
          schema: {
            type: 'object',
            properties: {}
          }
        },
        evidenceType: {
          title: (formData, { pagePerItemIndex }) => _.get(`disabilities.${pagePerItemIndex}.name`, formData),
          path: 'supporting-evidence/:index/evidence-type',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': evidenceTypesDescription,
                'view:vaMedicalRecords': {
                  'ui:title': 'VA medical records'
                },
                'view:privateMedicalRecords': {
                  'ui:title': 'Private medical records'
                },
                'view:otherEvidence': {
                  'ui:title': 'Lay statements or other evidence'
                },
                'view:evidenceTypeHelp': {
                  'ui:description': evidenceTypeHelp
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    'view:vaMedicalRecords': {
                      type: 'boolean'
                    },
                    'view:privateMedicalRecords': {
                      type: 'boolean'
                    },
                    'view:otherEvidence': {
                      type: 'boolean'
                    },
                    'view:evidenceTypeHelp': {
                      type: 'object',
                      properties: {}
                    }
                  }
                }
              }
            }
          }
        },
        vaMedicalRecordsIntro: {
          title: '',
          path: 'supporting-evidence/:index/va-medical-records-intro',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          depends: (formData, index) => _.get(`disabilities.${index}.view:vaMedicalRecords`, formData),
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': vaMedicalRecordsIntro,
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {}
                }
              }
            }
          }
        },
        vaFacilities: {
          title: '',
          path: 'supporting-evidence/:index/va-facilities',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          depends: (formData, index) => _.get(`disabilities.${index}.view:vaMedicalRecords`, formData),
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': facilityDescription,
                vaTreatments: {
                  'ui:options': {
                    itemName: 'Facility',
                    viewField: treatmentView
                  },
                  items: {
                    treatmentCenterName: {
                      'ui:title': 'Name of VA medical facility'
                    },
                    treatmentDateRange: dateRangeUI(
                      'Approximate date of first treatment',
                      'Approximate date of last treatment',
                      'Date of last treatment must be after date of first treatment'
                    ),
                    // TODO: Put these back as hidden in the UI once typeahead fills this out
                    // treatmentCenterType: {},
                    // treatmentCenterAddress: {}
                  }
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    vaTreatments
                  }
                }
              }
            }
          }
        },
        privateMedicalRecordsIntro: {
          title: '',
          path: 'supporting-evidence/:index/private-medical-records-intro',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          depends: (formData, index) => _.get(`disabilities.${index}.view:privateMedicalRecords`, formData),
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': privateMedicalRecordsIntro
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {}
                }
              }
            }
          }
        },
        privateRecordChoice: {
          title: '',
          path: 'supporting-evidence/:index/private-medical-records-choice',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          depends: (formData, index) => _.get(`disabilities.${index}.view:privateMedicalRecords`, formData),
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': privateRecordsChoice,
                'view:uploadPrivateRecords': {
                  'ui:title': 'Do you want to upload your private medical records?',
                  'ui:widget': 'radio',
                  'ui:options': {
                    labels: {
                      yes: 'Yes',
                      no: 'No, please get them from my doctor'
                    }
                  }
                },
                'view:privateRecordsChoiceHelp': {
                  'ui:description': privateRecordsChoiceHelp
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    'view:uploadPrivateRecords': {
                      type: 'string',
                      'enum': ['yes', 'no']
                    },
                    'view:privateRecordsChoiceHelp': {
                      type: 'object',
                      properties: {}
                    }
                  }
                }
              }
            }
          }
        },
        privateMedicalRecordRelease: {
          title: '',
          path: 'supporting-evidence/:index/private-medical-records-release',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          depends: (formData, index) => {
            const hasRecords = _.get(`disabilities.${index}.view:privateMedicalRecords`, formData);
            const requestsRecords = _.get(`disabilities.${index}.view:uploadPrivateRecords`, formData) === 'no';
            return hasRecords && requestsRecords;
          },
          uiSchema: {
            disabilities: {
              items: {
                'ui:description': 'Please let us know where and when you received treatment. We’ll request your private medical records for you. If you have your private medical records available, you can upload them later in the application',
                privateRecordReleases: {
                  'ui:options': {
                    itemName: 'Private Medical Record Release',
                    viewField: treatmentView
                  },
                  items: {
                    'ui:order': [
                      'treatmentCenterName',
                      'privateMedicalRecordsReleaseRestricted',
                      'view:releaseRestrictedNotice',
                      'treatmentDateRange',
                      'treatmentCenterAddress'
                    ],
                    treatmentCenterName: {
                      'ui:title': 'Name of private provider or hospital'
                    },
                    treatmentDateRange: dateRangeUI(
                      'Approximate date of first treatment',
                      'Approximate date of last treatment',
                      'Date of last treatment must be after date of first treatment'
                    ),
                    privateMedicalRecordsReleaseRestricted: {
                      'ui:title': 'I give my consent, or permission, to my doctor to only release records related to this condition'
                    },
                    'view:releaseRestrictedNotice': {
                      'ui:description': () => recordReleaseWarning,
                      'ui:options': {
                        expandUnder: 'privateMedicalRecordsReleaseRestricted'
                      }
                    },
                    treatmentCenterAddress: {
                      'ui:order': [
                        'country',
                        'addressLine1',
                        'addressLine2',
                        'city',
                        'state',
                        'zip'
                      ],
                      // TODO: confirm validation for PCIU address across all usage
                      // 'ui:validations': [validateAddress],
                      country: {
                        'ui:title': 'Country'
                      },
                      addressLine1: {
                        'ui:title': 'Street address'
                      },
                      addressLine2: {
                        'ui:title': 'Street address'
                      },
                      city: {
                        'ui:title': 'City'
                      },
                      state: {
                        'ui:title': 'State'
                      },
                      zip: {
                        'ui:title': 'Postal code',
                        'ui:options': {
                          widgetClassNames: 'usa-input-medium',
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    privateRecordReleases: _.set(
                      'items.properties.view:releaseRestrictedNotice',
                      {
                        type: 'object',
                        'ui:collapsed': true,
                        properties: {}
                      },
                      privateRecordReleases
                    )
                  }
                }
              }
            },
          }
        },
        recordUpload: {
          title: 'Upload your private medical records',
          depends: (formData, index) => {
            const hasRecords = _.get(`disabilities.${index}.view:privateMedicalRecords`, formData);
            const uploadRecords = _.get(`disabilities.${index}.view:uploadPrivateRecords`, formData) === 'yes';
            return hasRecords && uploadRecords;
          },
          path: 'supporting-evidence/:index/documents',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          uiSchema: {
            disabilities: {
              items: {
                privateRecords: Object.assign({},
                  fileUploadUI('Upload your private medical records', {
                    itemDescription: 'Adding additional evidence:',
                    endpoint: '/v0/preneeds/preneed_attachments', // TODO: update this with correct endpoint (e.g. '/v0/21-526EZ/medical_records')
                    addAnotherLabel: 'Add Another Document',
                    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
                    maxSize: FIFTY_MB,
                    createPayload: (file) => {
                      const payload = new FormData();
                      payload.append('preneed_attachment[file_data]', file); // TODO: update this with correct property (e.g. 'health_record[file_data]')

                      return payload;
                    },
                    parseResponse: (response, file) => {
                      return {
                        name: file.name,
                        confirmationCode: response.data.attributes.guid
                      };
                    },
                    attachmentSchema: {
                      'ui:title': 'Document type'
                    },
                    attachmentName: {
                      'ui:title': 'Document name'
                    }
                  }),
                  { 'ui:description': documentDescription }
                )
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    privateRecords: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['name', 'attachmentId'],
                        properties: {
                          name: {
                            type: 'string'
                          },
                          size: {
                            type: 'integer'
                          },
                          confirmationCode: {
                            type: 'string'
                          },
                          attachmentId: {
                            type: 'string',
                            'enum': [
                              '1',
                              '2',
                              '3',
                              // '4', // TODO: Confirm this should be taken out
                              '5',
                              '6'
                            ],
                            enumNames: [
                              'Discharge',
                              'Marriage related',
                              'Dependent related',
                              // 'VA preneed form',
                              'Letter',
                              'Other'
                            ]
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
        documentUpload: {
          title: 'Lay statements or other evidence',
          depends: (formData, index) => _.get(`disabilities.${index}.view:otherEvidence`, formData),
          path: 'supporting-evidence/:index/additionalDocuments',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          uiSchema: {
            disabilities: {
              items: {
                additionalDocuments: Object.assign({},
                  fileUploadUI('Lay statements or other evidence', {
                    itemDescription: 'Adding additional evidence:',
                    endpoint: '/v0/preneeds/preneed_attachments', // TODO: update this with correct endpoint (e.g. '/v0/21-526EZ/medical_records')
                    addAnotherLabel: 'Add Another Document',
                    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
                    maxSize: FIFTY_MB,
                    createPayload: (file) => {
                      const payload = new FormData();
                      payload.append('preneed_attachment[file_data]', file); // TODO: update this with correct property (e.g. 'health_record[file_data]')

                      return payload;
                    },
                    parseResponse: (response, file) => {
                      return {
                        name: file.name,
                        confirmationCode: response.data.attributes.guid
                      };
                    },
                    attachmentSchema: {
                      'ui:title': 'Document type'
                    },
                    attachmentName: {
                      'ui:title': 'Document name'
                    }
                  }),
                  { 'ui:description': additionalDocumentDescription }
                )
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    additionalDocuments: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['name', 'attachmentId'],
                        properties: {
                          name: {
                            type: 'string'
                          },
                          size: {
                            type: 'integer'
                          },
                          confirmationCode: {
                            type: 'string'
                          },
                          attachmentId: {
                            type: 'string',
                            'enum': [
                              '1',
                              '2',
                              '3',
                              // '4',
                              '5',
                              '6'
                            ],
                            enumNames: [
                              'Discharge',
                              'Marriage related',
                              'Dependent related',
                              // 'VA preneed form',
                              'Letter',
                              'Other'
                            ]
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
        evidenceSummary: {
          title: 'Summary of evidence',
          path: 'supporting-evidence/:index/evidence-summary',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': 'Summary of evidence',
                'ui:description': evidenceSummaryView
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {}
                }
              }
            }
          }
        }
      }
    },
    chapterFive: {
      title: 'Chapter Five',
      pages: {
        pageOne: {
          title: 'Page One',
          path: 'chapter-five/page-one',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {}
          }
        }
      }
    },
    additionalInformation: {
      title: 'Additional Information',
      pages: {
        expedited: {
          title: 'Fully developed claim program',
          path: 'additional-information/fdc',
          uiSchema: {
            'ui:description': FDCDescription,
            noRapidProcessing: {
              'ui:title':
                'Do you want to apply using the Fully Developed Claim program?',
              'ui:widget': 'yesNo',
              'ui:options': {
                yesNoReverse: true,
                labels: {
                  Y: 'Yes, I have uploaded all my supporting documents.',
                  N:
                    'No, I have some extra information that I will submit to VA later.'
                }
              }
            },
            fdcWarning: {
              'ui:description': FDCWarning,
              'ui:options': {
                expandUnder: 'noRapidProcessing',
                expandUnderCondition: false
              }
            },
            noFDCWarning: {
              'ui:description': noFDCWarning,
              'ui:options': {
                expandUnder: 'noRapidProcessing',
                expandUnderCondition: true
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              noRapidProcessing: {
                type: 'boolean'
              },
              fdcWarning: {
                type: 'object',
                properties: {}
              },
              noFDCWarning: {
                type: 'object',
                properties: {}
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
