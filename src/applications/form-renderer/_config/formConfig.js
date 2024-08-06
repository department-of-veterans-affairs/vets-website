/**
 * This file - in its current form - is temporary. We want to temporarily define
 * two `formConfig` objects that can be dynamically chosen based on the url.
 * Eventually, the `formConfig` object that drives the application will
 * be calculated after fetching configuration from Drupal.
 *
 * As such, we purposely do not name this file `form.js` so as to bypass
 * unit testing that automatically takes place on all `config/form.js` files
 * in `src/applications`.
 */

// import fullSchema from 'vets-json-schema/dist/-schema.json';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { dependsOn } from '../utils/conditional';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

export const formConfig1 = {
  rootUrl: `${manifest.rootUrl}/123-abc`,
  urlPrefix: '/123-abc/',
  trackingPrefix: '123-abc-',
  // eslint-disable-next-line no-console
  submit: () => console.log('submit form 1'),
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '123-abc',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Form 1 NOT FOUND',
    noAuth: 'Please sign in again to continue Form 1.',
  },
  title: 'Form 123-ABC',
  defaultDefinitions: {},
  chapters: {
    f1c1: {
      title: 'Form 1 Chapter 1',
      pages: {
        f1c1p1: {
          path: 'f1c1p1',
          title: 'Form 1 Chapter 1 Page 1',
          uiSchema: {
            'ui:title': 'Eligibility',
            'ui:description': 'Requirements',
            isEligible1: {
              'ui:title': 'Are you eligible for Item1?',
              'ui:widget': 'yesNo',
            },
            isEligible2: {
              'ui:title': 'Are you eligible for Item2?',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            required: ['isEligible1'],
            properties: {
              isEligible1: {
                type: 'boolean',
              },
              isEligible2: {
                type: 'boolean',
              },
            },
          },
        },
        f1c1p2: {
          depends: dependsOn({
            operator: 'or',
            conditions: [
              {
                field: 'isEligible1',
                value: true,
              },
              {
                field: 'isEligible2',
                value: true,
              },
            ],
          }),
          path: 'f1c1p2',
          title: 'Form 1 Chapter 1 Page 2',
          uiSchema: {
            'ui:title': 'Conditional Page',
            'ui:description': 'Other',
            isOtherEligible: {
              'ui:title': 'Are you eligible for something else?',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            required: ['isOtherEligible'],
            properties: {
              isOtherEligible: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },
  },
};

export const formConfig2 = {
  rootUrl: `${manifest.rootUrl}/456-xyz`,
  urlPrefix: '/456-xyz/',
  trackingPrefix: '456-xyz-',
  // eslint-disable-next-line no-console
  submit: () => console.log('submit form 2'),
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '456-xyz',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Form 2 NOT FOUND',
    noAuth: 'Please sign in again to continue Form 2.',
  },
  title: 'Form 456-XYZ',
  defaultDefinitions: {},
  chapters: {
    f2c1: {
      title: 'Form 2 Chapter 1',
      pages: {
        f2c1p1: {
          path: 'f2c1p1',
          title: 'Form 2 Chapter 1 Page 1',
          uiSchema: {
            favoriteFood: {
              'ui:title': 'Favorite Food',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  P: 'Pizza',
                  H: 'Hamburger',
                  S: 'Salad',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: [],
            properties: {
              favoriteFood: {
                type: 'string',
                enum: ['P', 'H', 'S'],
              },
            },
          },
        },
        f2c1p2: {
          path: 'f2c1p2',
          title: 'Form 2 Chapter 1 Page 2',
          uiSchema: {
            otherInformation: {
              'ui:title': 'Other Information',
              'ui:widget': 'textarea',
            },
          },
          schema: {
            type: 'object',
            required: [],
            properties: {
              otherInformation: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
