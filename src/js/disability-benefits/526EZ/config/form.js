import React from 'react';
import _ from '../../../common/utils/data-utils';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
import fileUploadUI from '../../../common/schemaform/definitions/file';

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
  recordReleaseWarning,
  validateAddress,
  documentDescription,
  evidenceSummaryView,
  additionalDocumentDescription,
  releaseView
} from '../helpers';

const { treatments } = fullSchema526EZ.properties;

const {
  date
  // files
} = fullSchema526EZ.definitions;

const FIFTY_MB = 52428800;

// We may add these back in after the typeahead, but for now...
// const treatmentsSchema = _.set(
//   'items.properties.treatment.properties',
//   _.omit(
//     [
//       'treatmentCenterType',
//       'treatmentCenterCountry',
//       'treatmentCenterState',
//       'treatmentCenterCity'
//     ],
//     treatments.items.properties.treatment.properties
//   ),
//   treatments
// );

// const privateRecordReleasesSchema = Object.assign(
//   {},
//   treatments.items.properties.treatment.properties,
//   {
//     privateMedicalRecordsReleaseAccepted: {
//       type: 'boolean'
//     },
//     'view:privateMedicalRecordsReleasePermissionRestricted': {
//       type: 'object',
//       'ui:collapsed': true,
//       properties: {}
//     },
//     treatmentCenterStreet1: {
//       type: 'string'
//     },
//     treatmentCenterStreet2: {
//       type: 'string'
//     },
//     treatmentCenterPostalCode: {
//       type: 'number'
//     }
//   }
// );

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/21-526EZ',
  trackingPrefix: 'disability-526EZ-',
  formId: '21-526EZ',
  version: 1,
  migrations: [],
  savedFormMessages: {
    notFound: 'Please start over to apply for disability claims increase.',
    noAuth:
      'Please sign in again to resume your application for disability claims increase.'
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    date
    // files
  },
  title: 'Disability Claims for Increase',
  subTitle: 'Form 21-526EZ',
  // getHelp: GetFormHelp,
  chapters: {
    additionalInformation: {
      title: 'Additional Information',
      pages: {
        expedited: {
          title: 'Fully developed claim program',
          path: 'additional-information/fdc',
          uiSchema: {
            'ui:description': (
              <div>
                <h5>Fully developed claim program</h5>
                <p>
                  You can apply using the Fully Developed Claim (FDC) program if
                  you’ve uploaded all the supporting documents or supplemental
                  forms needed to support your claim. Learn more about the FDC
                  program.
                </p>
                <a href="/pension/apply/fully-developed-claim/" target="_blank">
                  Learn more about the FDC program
                </a>.
              </div>
            ),
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
              'ui:description': (
                <div className="usa-alert usa-alert-info no-background-image">
                  <div className="usa-alert-body">
                    <div className="usa-alert-text">
                      Since you’ve uploaded all your supporting documents, your
                      claim will be submitted as a fully developed claim.
                    </div>
                  </div>
                </div>
              ),
              'ui:options': {
                expandUnder: 'noRapidProcessing',
                expandUnderCondition: false
              }
            },
            noFDCWarning: {
              'ui:description': (
                <div className="usa-alert usa-alert-info no-background-image">
                  <div className="usa-alert-body">
                    <div className="usa-alert-text">
                      Since you’ll be sending in additional documents later,
                      your application doesn’t qualify for the Fully Developed
                      Claim program. We’ll review your claim through the
                      standard claim process. Please turn in any information to
                      support your claim as soon as you can.
                    </div>
                  </div>
                </div>
              ),
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
