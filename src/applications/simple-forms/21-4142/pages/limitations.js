import React from 'react';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import environment from 'platform/utilities/environment';
import {
  textareaSchema,
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { schemaFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: environment.isProduction()
    ? {
        [schemaFields.limitedConsent]: {
          'ui:title': (
            <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
              Do you want to limit the information we can request?
            </h3>
          ),
          'ui:description': (
            <p>
              If you want to limit what we can request from the private medical
              providers, describe the limits here. For example, you may want the
              provider to release only treatment dates or certain types of
              disabilities. If you limit consent, it may take us longer to get
              the private medical records.
            </p>
          ),
          'ui:widget': 'textarea',
        },
      }
    : {
        ...titleUI({
          title: 'Do you want to limit the information we can request?',
        }),
        [schemaFields.limitedConsent]: textareaUI(
          'If you want to limit what we can request from the private medical providers, describe the limits here. For example, you want your provider to release only treatment dates or certain types of disabilities. If you limit consent, it may take us longer to get the private medical records.',
        ),
      },
  schema: {
    type: 'object',
    properties: environment.isProduction()
      ? {
          [schemaFields.limitedConsent]:
            fullSchema.properties[schemaFields.limitedConsent],
        }
      : {
          [schemaFields.limitedConsent]: textareaSchema,
        },
  },
};
