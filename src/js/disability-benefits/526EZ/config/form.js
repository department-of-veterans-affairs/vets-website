// import _ from '../../../common/utils/data-utils';
import _ from 'lodash/fp';

import fullSchema526EZ from '/Users/adhocteam/Sites/vets-json-schema/dist/21-526EZ-schema.json';
import fileUploadUI from '../../../common/schemaform/definitions/file';
import dateRangeUI from '../../../common/schemaform/definitions/dateRange';
import { pciuCountries, states, statesOnlyInPCIU } from '../../../common/utils/address';

import initialData from '../../../../../test/disability-benefits/526EZ/schema/initialData';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

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
  // validateAddress, // TODO: Check if needed
  documentDescription,
  evidenceSummaryView,
  additionalDocumentDescription,
  releaseView
} from '../helpers';

const {
  treatments,
  privateRecordReleases
} = fullSchema526EZ.properties;

const {
  date,
  // files
  dateRange,
  privateTreatmentCenterAddress
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
      properties: _.omit(
        ['treatmentCenterAddress', 'treatmentCenterType'],
        items.properties
      )
    }
  };

})(treatments);

// TODO: Replace once validations finished
const privateTreatmentCenterAddressDef = ((address) => {
  const usCombinedStates = [...states.USA, ...statesOnlyInPCIU];
  const usaStatesLabels = usCombinedStates.map(state => state.label);
  const usaStates = usCombinedStates.map(state => state.value);
  const { type, oneOf, required, properties } = address;
  return {
    type,
    oneOf: oneOf.map((obj) => _.cloneDeep(obj)),
    required,
    properties: _.assign(properties, {
      country: {
        type: 'string',
        'enum': pciuCountries,
      },
      state: {
        type: 'string',
        'enum': usaStates,
        enumNames: usaStatesLabels
      }
    })
  };
})(privateTreatmentCenterAddress);

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
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    date,
    dateRange,
    privateTreatmentCenterAddress: privateTreatmentCenterAddressDef
    // files
  },
  title: 'Disability Claims for Increase',
  subTitle: 'Form 21-526EZ',
  // getHelp: GetFormHelp,
  chapters: {
    chapterOne: {
      title: 'Chapter One',
      pages: {
        pageOne: {
          title: 'Page One',
          path: 'chapter-one/page-one',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {}
          },
        }
      }
    },
    chapterTwo: {
      title: 'Chapter Two',
      pages: {
        pageOne: {
          title: 'Page One',
          path: 'chapter-two/page-one',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {}
          },
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
                    // Hopefully we can get rid of this annoying nesting
                    treatmentCenterName: {
                      // May have to change this to 'Name of [first]...'
                      'ui:title': 'Name of VA medical facility'
                    },
                    treatmentDateRange: dateRangeUI(
                      'Approximate date of first treatment',
                      'Approximate date of last treatment',
                      'Date of last treatment must be after date of first treatment'
                    ),
                    // I think we're planning on filling these in with the typeahead?
                    // treatmentCenterType: {
                    //   'ui:options': {
                    //     hideIf: () => true
                    //   }
                    // },
                    // treatmentCenterAddress: {
                    //   country: {
                    //     'ui:options': {
                    //       hideIf: () => true
                    //     }
                    //   },
                    //   state: {
                    //     'ui:options': {
                    //       hideIf: () => true
                    //     }
                    //   },
                    //   city: {
                    //     'ui:options': {
                    //       hideIf: () => true
                    //     }
                    //   }
                    // }
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
                    viewField: releaseView
                  },
                  items: {
                    'ui:order': [
                      'treatmentCenterName',
                      'privateMedicalRecordsReleaseAccepted',
                      'view:privateMedicalRecordsReleasePermissionRestricted',
                      'treatmentDateRange',
                      'treatmentCenterAddress'
                    ],
                    treatmentCenterName: { // TODO: is this required?
                      'ui:title': 'Name of private provider or hospital'
                    },
                    treatmentDateRange: dateRangeUI(
                      'Approximate date of first treatment',
                      'Approximate date of last treatment',
                      'Date of last treatment must be after date of first treatment'
                    ),
                    privateMedicalRecordsReleaseAccepted: {
                      'ui:title': 'I give my consent, or permission, to my doctor to only release records related to this condition'
                    },
                    'view:privateMedicalRecordsReleasePermissionRestricted': {
                      'ui:description': () => recordReleaseWarning,
                      'ui:options': {
                        expandUnder: 'privateMedicalRecordsReleaseAccepted'
                      }
                    },
                    treatmentCenterAddress: {
                      'ui:order': [
                        'country',
                        'addressLine1',
                        'addressLine2',
                        'city',
                        'state',
                        'zipFirstFive'
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
                      zipFirstFive: {
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
                    privateRecordReleases
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
