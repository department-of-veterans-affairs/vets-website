import _ from '../../../../platform/utilities/data';
// import fullSchema from 'vets-json-schema/dist/21-526EZ-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import {
  treatmentView,
  recordReleaseWarning
} from '../../526EZ/helpers';

// const {
//   privateRecordReleases
// } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'private-medical-recores-release-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-4142',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for authorization to disclose information.',
    noAuth: 'Please sign in again to continue your application for authorization to disclose information.'
  },
  title: 'Authorization to disclose information',
  subTitle: 'Form 21-4142',
  defaultDefinitions: {
  },
  chapters: {
    privateMedical: {
      title: 'Authorization to disclose medical records',
      pages: {
        privateMedicalRecordRelease: {
          title: '',
          path: 'private-medical-records-release/hello',
          showPagePerItem: true,
          itemFilter: (item) => _.get('view:selected', item),
          arrayPath: 'disabilities',
          depends: (formData, index) => {
            const hasRecords = _.get(`disabilities.${index}.view:selectableEvidenceTypes.view:privateMedicalRecords`, formData);
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
                        'zipCode'
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
                      zipCode: {
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
                    // privateRecordReleases: _.set(
                    //   'items.properties.view:releaseRestrictedNotice',
                    //   {
                    //     type: 'object',
                    //     'ui:collapsed': true,
                    //     properties: {}
                    //   },
                    //   privateRecordReleases
                    // )
                  }
                }
              }
            },
          }
        }
      }
    }
  }
};

export default formConfig;
