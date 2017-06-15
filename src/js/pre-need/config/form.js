import _ from 'lodash/fp';

import fullSchemaBurials from 'vets-json-schema/dist/21P-530-schema.json';

// import { transform } from '../helpers';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { relationshipLabels, locationOfDeathLabels } from '../utils/labels.jsx';

import * as address from '../../common/schemaform/definitions/address';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import * as personId from '../../common/schemaform/definitions/personId';
import phoneUI from '../../common/schemaform/definitions/phone';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';

const {
  relationship,
  claimantFullName,
  veteranFullName,
  locationOfDeath,
  burialDate,
  deathDate,
  claimantEmail,
  claimantPhone
} = fullSchemaBurials.properties;

const {
  fullName,
  vaFileNumber,
  ssn,
  date,
  usaPhone
} = fullSchemaBurials.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/preneed',
  trackingPrefix: 'preneed-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  disableSave: true,
  title: 'Apply online for pre-need determination of eligibility in a VA National Cemetary',
  subTitle: 'Form 40-10007',
  defaultDefinitions: {
    fullName,
    vaFileNumber,
    ssn,
    date,
    usaPhone
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-information',
          uiSchema: {
            veteranFullName: fullNameUI,
            'view:veteranId': personId.uiSchema(
              'veteran',
              'view:veteranId.view:noSSN',
              'I don’t have the Veteran’s Social Security number'
            )
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName,
              'view:veteranId': personId.schema(fullSchemaBurials)
            }
          }

        }
      }
    },
    claimantContactInformation: {
      title: 'Claimant Contact Information',
      pages: {
        claimantContactInformation: {
          title: 'Claimant Contact Information',
          path: 'claimant-contact-information',
          uiSchema: {
            claimantAddress: address.uiSchema('Address'),
            claimantEmail: {
              'ui:title': 'Email address'
            },
            claimantPhone: phoneUI('Phone number')
          },
          schema: {
            type: 'object',
            required: ['claimantAddress', 'claimantEmail', 'claimantPhone'],
            properties: {
              claimantAddress: address.schema(fullSchemaBurials, true),
              claimantEmail,
              claimantPhone
            }
          }
        }
      }
    }
  }
};

export default formConfig;
