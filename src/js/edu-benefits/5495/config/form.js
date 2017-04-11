import _ from 'lodash/fp';

import fullSchema5495 from 'vets-json-schema/dist/22-5495-schema.json';

// import pages from '../../pages/';

import * as fullName from '../../../common/schemaform/definitions/fullName';

import * as veteranId from '../../definitions/veteranId';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform
} from '../helpers';

const {
  veteranFullName,
  outstandingFelony
} = fullSchema5495.properties;

// const {
// } = fullSchema5495.definitions;

const formConfig = {
  urlPrefix: '/5495/',
  submitUrl: '/v0/education_benefits_claims/5495',
  trackingPrefix: 'edu-5495-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    fullName: fullName.schema
  },
  title: 'Update your Education Benefits',
  subTitle: 'Form 22-5495',
  chapters: {
    chapterName: {
      title: '',
      pages: {
        pageName: {
          path: 'page/path',
          title: '',
          initialData: {},
          uiSchema: {},
          schema: {
            type: 'object',
            required: [],
            properties: {}
          }
        }
      }
    },
    sponsorInformation: {
      title: 'Sponsor information',
      pages: {
        sponsorInformation: {
          path: 'sponsor/information',
          title: 'Sponsor information',
          uiSchema: {
            veteranFullName: fullName.uiSchema,
            'view:veteranId': _.merge(veteranId.uiSchema, {
              'view:noSSN': {
                'ui:title': 'I don’t know my sponsor’s Social Security number',
              },
            }),
            outstandingFelony: {
              'ui:title': 'Do you or your sponsor have an outstanding felony and/or warrant?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName,
              'view:veteranId': veteranId.schema,
              outstandingFelony
            }
          }
        }
      }
    }
  }
};


export default formConfig;
