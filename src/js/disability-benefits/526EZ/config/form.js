import _ from '../../../common/utils/data-utils';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
import fileUploadUI from '../../../common/schemaform/definitions/file';

import initialData from '../../../../../test/disability-benefits/526EZ/schema/initialData';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import createVeteranInfoChapter from '../pages/veteranInfo';

import {
  transform,
  supportingEvidenceOrientation,
  evidenceTypesDescription,
  EvidenceTypeHelp,
  disabilityNameTitle,
  vaMedicalRecordsIntro,
  privateMedicalRecordsIntro,
  facilityDescription,
  treatmentView,
  recordReleaseWarning,
  validateAddress,
  documentDescription,
  evidenceSummaryView,
  additionalDocumentDescription,
  releaseView
} from '../helpers';

const {
  treatments
} = fullSchema526EZ.properties;

const {
  date,
  fullName,
  // files
} = fullSchema526EZ.definitions;

const FIFTY_MB = 52428800;

// We may add these back in after the typeahead, but for now...
const treatmentsSchema = _.set('items.properties.treatment.properties',
  _.omit(
    [
      'treatmentCenterType',
      'treatmentCenterCountry',
      'treatmentCenterState',
      'treatmentCenterCity'
    ],
    treatments.items.properties.treatment.properties
  ), treatments);

const privateRecordReleasesSchema = Object.assign({}, treatments.items.properties.treatment.properties, {
  privateMedicalRecordsReleaseAccepted: {
    type: 'boolean'
  },
  'view:privateMedicalRecordsReleasePermissionRestricted': {
    type: 'object',
    'ui:collapsed': true,
    properties: {}
  },
  treatmentCenterStreet1: {
    type: 'string'
  },
  treatmentCenterStreet2: {
    type: 'string'
  },
  treatmentCenterPostalCode: {
    type: 'number'
  }
});

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/21-526EZ',
  trackingPrefix: 'disability-526EZ-',
  formId: '21-526EZ',
  version: 1,
  migrations: [],
  savedFormMessages: {
    notFound: 'Please start over to apply for disability claims increase.',
    noAuth: 'Please sign in again to resume your application for disability claims increase.'
  },
  storePrefillStatus: true,
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    date,
    fullName,
    // files
  },
  title: 'Disability Claims for Increase',
  subTitle: 'Form 21-526EZ',
  // getHelp: GetFormHelp,
  chapters: {
    reviewVeteranInformation: createVeteranInfoChapter(fullSchema526EZ, true),
    veteranInformation: createVeteranInfoChapter(fullSchema526EZ, false),
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
          },
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
          title: (formData, { pagePerItemIndex }) => _.get(`disabilities.${pagePerItemIndex}.diagnosticText`, formData),
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
                  'ui:description': EvidenceTypeHelp
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
                treatments: {
                  'ui:options': {
                    itemName: 'Facility',
                    viewField: treatmentView
                  },
                  items: {
                    // Hopefully we can get rid of this annoying nesting
                    treatment: {
                      treatmentCenterName: {
                        // May have to change this to 'Name of [first]...'
                        'ui:title': 'Name of VA medical facility'
                      },
                      startTreatment: {
                        'ui:widget': 'date',
                        'ui:title': 'Approximate date of first treatment since you received your rating'
                      },
                      endTreatment: {
                        'ui:widget': 'date',
                        'ui:title': 'Approximate date of last treatment'
                      }
                      // I think we're planning on filling these in with the typeahead?
                      // treatmentCenterType: {
                      //   'ui:options': {
                      //     hideIf: () => true
                      //   }
                      // },
                      // treatmentCenterCountry: {
                      //   'ui:options': {
                      //     hideIf: () => true
                      //   }
                      // },
                      // treatmentCenterState: {
                      //   'ui:options': {
                      //     hideIf: () => true
                      //   }
                      // },
                      // treatmentCenterCity: {
                      //   'ui:options': {
                      //     hideIf: () => true
                      //   }
                      // }
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
                    treatments: treatmentsSchema
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
        privateMedicalRecordRelease: {
          title: '',
          path: 'supporting-evidence/:index/private-medical-records-release',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          depends: (formData, index) => {
            const hasRecords = _.get(`disabilities.${index}.view:privateMedicalRecords`, formData);
            // TODO: enable once previous chapter merged
            // const requestsRecords = !_.get(`disabilities.${index}.view:uploadPrivateRecords`, formData);
            const requestsRecords = true;
            return hasRecords && requestsRecords;
          },
          uiSchema: {
            disabilities: {
              items: {
                'ui:description': 'Please let us know where and when you received treatment. We’ll request your private medical records for you. If you have your private medical records available, you can upload them later in the application',
                privateRecordReleases: {
                  'ui:options': {
                    itemName: 'Private Medical Record Release',
                    viewField: releaseView
                  },
                  items: {
                    privateRecordRelease: {
                      'ui:order': [
                        'treatmentCenterName',
                        'privateMedicalRecordsReleaseAccepted',
                        'view:privateMedicalRecordsReleasePermissionRestricted',
                        'startTreatment', 'endTreatment',
                        'treatmentCenterCountry', 'treatmentCenterStreet1',
                        'treatmentCenterStreet2', 'treatmentCenterCity',
                        'treatmentCenterState', 'treatmentCenterPostalCode'
                      ],
                      treatmentCenterName: { // TODO: is this required?
                        'ui:title': 'Name of private provider or hospital'
                      },
                      privateMedicalRecordsReleaseAccepted: {
                        'ui:title': 'I give my consent, or permission, to my doctor to only release records related to this condition'
                      },
                      'view:privateMedicalRecordsReleasePermissionRestricted': {
                        'ui:description': () => recordReleaseWarning,
                        'ui:options': {
                          expandUnder: 'privateMedicalRecordsReleaseAccepted'
                        }
                      },
                      startTreatment: {
                        'ui:widget': 'date',
                        'ui:title': 'Approximate date of first treatment since you received your rating'
                      },
                      endTreatment: {
                        'ui:widget': 'date',
                        'ui:title': 'Approximate date of last treatment'
                      },
                      treatmentCenterCountry: { // TODO: need to update schema to use default def
                        'ui:title': 'Country'
                      },
                      treatmentCenterStreet1: {
                        'ui:title': 'Street'
                      },
                      treatmentCenterStreet2: {
                        'ui:title': 'Street'
                      },
                      treatmentCenterCity: {
                        'ui:title': 'City'
                      },
                      treatmentCenterState: {
                        'ui:title': 'State'
                      },
                      treatmentCenterPostalCode: {
                        'ui:title': 'Postal code',
                        'ui:options': {
                          widgetClassNames: 'usa-input-medium'
                        }
                      },
                      'ui:validations': [validateAddress]
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
                    privateRecordReleases: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          privateRecordRelease: {
                            type: 'object',
                            properties: _.omit(['treatmentCenterType'], privateRecordReleasesSchema)
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
        recordUpload: {
          title: 'Upload your private medical records',
          depends: (formData, index) => {
            const hasRecords = _.get(`disabilities.${index}.view:privateMedicalRecords`, formData);
            // TODO: enable once previous chapter merged
            // const uploadRecords = _.get(`disabilities.${index}.view:uploadPrivateRecords`, formData);
            const uploadRecords = true;
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
    }
  }
};


export default formConfig;
