import React from 'react';
import _ from '../../../common/utils/data-utils';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
import fileUploadUI from '../../../common/schemaform/definitions/file';

import { isValidUSZipCode, isValidCanPostalCode } from '../../../common/utils/address';
import phoneUI from '../../../common/schemaform/definitions/phone';
import initialData from '../../../../../test/disability-benefits/526EZ/schema/initialData';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

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
} from '../helpers';

const {
  treatments
} = fullSchema526EZ.properties;

const {
  date,
  // files,
  phone
} = fullSchema526EZ.definitions;

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

// TODO: Move to helpers
function validatePostalCodes(errors, formData) {
  let isValidPostalCode = true;
  // Checks if postal code is valid
  if (formData.treatmentCenterCountry === 'USA') {
    isValidPostalCode = isValidPostalCode && isValidUSZipCode(formData.treamentCenterPostalCode);
  }
  if (formData.treatmentCenterCountry === 'CAN') {
    isValidPostalCode = isValidPostalCode && isValidCanPostalCode(formData.treamentCenterPostalCode);
  }

  // Add error message for postal code if it is invalid
  if (formData.treatmentCenterPostalCode && !isValidPostalCode) {
    errors.treatmentCenterPostalCode.addError('Please provide a valid postal code');
  }
}
const stateRequiredCountries = new Set(['USA', 'CAN', 'MEX']);

function validateAddress(errors, formData) {
  // Adds error message for state if it is blank and one of the following countries:
  // USA, Canada, or Mexico
  if (stateRequiredCountries.has(formData.treatmentCenterCountry)
    && formData.treatmentCenterState === undefined) {
    // && currentSchema.required.length) {
    errors.treatmentCenterState.addError('Please select a state or province');
  }

  const hasAddressInfo = stateRequiredCountries.has(formData.treatmentCenterCountry)
    // && !currentSchema.required.length
    && typeof formData.treatmentCenterCity !== 'undefined'
    && typeof formData.treatmentCenterState !== 'undefined'
    && typeof formData.treatmentCenterPostalCode !== 'undefined';

  if (hasAddressInfo && typeof formData.treatmentCenterState === 'undefined') {
    errors.treatmentCenterState.addError('Please enter a state or province, or remove other address information.');
  }

  validatePostalCodes(errors, formData);
}
const privateMedicalRecordsReleaseTreatmentSchema = Object.assign({}, treatments.items.properties.treatment.properties, {
  privateMedicalRecordsReleaseAccepted: {
    type: 'boolean'
  },
  'view:privateMedicalRecordsReleasePermissionRestricted': {
    type: 'object',
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
  },
  treatmentCenterPhone: phone,
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
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    date,
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
        // TODO: Should this be privateMedicalRecordsRelease or privateRecordsRelease? 
        privateMedicalRecordsRelease: {
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
                treatments: {
                  'ui:options': {
                    itemName: 'Record',
                    viewField: () => {
                      return (<div>hello</div>);
                    }
                  },
                  items: {
                    treatment: {
                      'ui:order': ['treatmentCenterName', 'privateMedicalRecordsReleaseAccepted', 'view:privateMedicalRecordsReleasePermissionRestricted', 'startTreatment', 'endTreatment', 'treatmentCenterCountry', 'treatmentCenterStreet1', 'treatmentCenterStreet2', 'treatmentCenterCity', 'treatmentCenterState', 'treatmentCenterPostalCode', 'treatmentCenterPhone'],
                      treatmentCenterName: { // TODO: is this required?
                        'ui:title': 'Name of private provider or hospital'
                      },
                      privateMedicalRecordsReleaseAccepted: {
                        'ui:title': 'I give my consent, or permission, to my doctor to only release records related to this condition'
                      },
                      'view:privateMedicalRecordsReleasePermissionRestricted': {
                        'ui:description': () => {
                          return (<div className="usa-alert usa-alert-warning no-background-image">
                            <span>Limiting consent means that your doctor can only share records that are directly related to your condition. This could add to the time it takes to get your private medical records.</span>
                          </div>);
                        },
                        'ui:options': {
                          expandUnder: 'privateMedicalRecordsReleaseAccepted' // TODO: prevent auto
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
                      treatmentCenterCountry: { // TODO: need to restrict these via select
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
                      treatmentCenterPostalCode: {  // TODO: need to validate this
                        'ui:title': 'Postal code',
                        'ui:options': {
                          widgetClassNames: 'usa-input-medium'
                        }
                      },
                      treatmentCenterPhone: phoneUI('Primary phone number'),
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
                    treatments: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          treatment: {
                            type: 'object',
                            properties: _.omit(['treatmentCenterType'], privateMedicalRecordsReleaseTreatmentSchema)
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
          title: 'Upload your private medical records',
          depends: (formData, index) => {
            const hasRecords = _.get(`disabilities.${index}.view:privateMedicalRecords`, formData);
            // TODO: enable once previous chapter merged
            // const uploadRecords = _.get(`disabilities.${index}.view:uploadPrivateRecords`, formData);
            const uploadRecords = true;
            return hasRecords && uploadRecords;
          },
          path: 'supporting-evidence/:index/documents',
          // editPageOnReview: true,
          showPagePerItem: true,
          arrayPath: 'disabilities',
          uiSchema: {
            disabilities: {
              items: {
                medicalRecords: Object.assign({},
                  fileUploadUI('Upload your private medical records', {
                    allowRename: true,
                    itemDescription: 'Adding additional evidence:',
                    endpoint: '/v0/preneeds/preneed_attachments', // TODO: update this with correct endpoint (e.g. '/v0/21-526EZ/medical_records')
                    fileTypes: ['pdf', 'jpg', 'jpeg', 'tiff', 'tif', 'png'],
                    maxSize: 27262976, // TODO: create constant
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
                  { 'ui:description': () => (<div>
                    <p>File upload guidelines:</p>
                    <ul>
                      <li>File types you can upload: .pdf, .jpeg, .gif, .tiff, or .png</li>
                      <li>Maximum file size: 25 MB</li>
                    </ul>
                    <p><em>Large files can be more difficult to upload with a slow Internet connection</em></p>
                  </div>) })
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
                    medicalRecords: {
                      type: 'array',
                      items: {
                        type: 'object',
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
        }
        // pageFive: {},
        // pageSix: {},
        // pageSeven: {},
        // pageEight: {},
        // pageNine: {},
        // pageTen: {},
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
