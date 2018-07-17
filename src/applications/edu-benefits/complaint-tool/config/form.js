// import fullSchema from 'vets-json-schema/dist/686-schema.json';
import _ from 'lodash/fp';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import AutosuggestField from '../../components/AutosuggestField.jsx';
import { uiSchema as autoSuggestUiSchema } from 'us-forms-system/lib/js/definitions/autosuggest';
import {
  fetchAutocompleteSuggestions,
  transformAutocompletePayloadForAutosuggestField
} from '../helpers';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'complaint-tool',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '686',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for declaration of status of dependents.',
    noAuth: 'Please sign in again to continue your application for declaration of status of dependents.'
  },
  title: 'Opt Out of Sharing VA Education Benefits Information',
  defaultDefinitions: {
  },
  chapters: {
    form: {
      title: 'Form',
      pages: {
        page1: {
          path: 'form-page',
          title: 'First Page',
          uiSchema: {
            name: _.merge(autoSuggestUiSchema(
              'Label',
              value => fetchAutocompleteSuggestions(value)
                .then(transformAutocompletePayloadForAutosuggestField),
              /*
              (value) => {

                return new Promise(resolve => {
                  setTimeout(() => resolve([
                    { label: 'option1', value: 'option1' },
                    { label: 'option2', value: 'option1' },
                    { label: 'option3', value: 'option1' },
                    { label: 'option4', value: 'option1' },
                    { label: 'option5', value: 'option1' },
                    { label: 'option6', value: 'option1' },
                    { label: 'option7', value: 'option1' },
                    { label: 'option8', value: 'option1' },
                    { label: 'option9', value: 'option1' }
                  ]), 1000);
                })
              },
              */
              {
                'ui:options': {
                  queryForResults: true,
                  freeInput: true,
                  debounceRate: 250
                },
                'ui:errorMessages': {
                  // If the maxLength changes, we'll want to update the message too
                  maxLength: 'Please enter a name with fewer than 100 characters.',
                  pattern: 'Please enter a valid name.'
                }
              }
            ),
              {
                'ui:field': AutosuggestField
              }
            )
          },
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
