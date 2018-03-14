import _ from '../../../common/utils/data-utils';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';

import initialData from '../../../../../test/disability-benefits/526EZ/schema/initialData';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform,
  supportingEvidenceOrientation,
  evidenceTypesDescription,
  EvidenceTypeHelp,
  disabilityNameTitle,
  facilityDescription,
  treatmentView,
  vaMedicalRecordsIntro
} from '../helpers';

const {
  treatments
} = fullSchema526EZ.properties;

const {
  date
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
    date
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
          path: 'supporting-evidence/:index/va-medical-records',
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
          },
        }
      }
    }
  }
};


export default formConfig;
