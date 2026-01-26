import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import SafeArrayField from '../components/SafeArrayField';
import { DisabilityView } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': (
      <div>
        <h3 style={{ marginTop: 0 }}>
          Section II: Disability and Medical Information
        </h3>
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h4 slot="headline">
            <b>What to expect:</b>
          </h4>
          <div className="vads-u-margin--0">
            <ul style={{ marginBottom: 0 }}>
              <li>
                List of your service-connected disabilities that prevent you
                from working
              </li>
              <li>
                Names and addresses of doctors who treated you in the past 12
                months (if applicable)
              </li>
              <li>Dates of recent medical treatment (if applicable)</li>
              <li>Hospital names and dates (if applicable)</li>
              <li>Takes about 7-10 minutes</li>
            </ul>
          </div>
        </VaAlert>

        <div className="vads-u-margin-top--5">
          <h4 style={{ marginTop: 0 }}>Disability And Medical Treatment</h4>
        </div>
      </div>
    ),

    disabilityDescription: {
      'ui:field': SafeArrayField,
      'ui:options': {
        itemName: 'Disability',
        viewField: DisabilityView,
        customTitle: 'Service-connected disabilities',
        keepInPageOnReview: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this disability?',
        addAnotherText: 'Add another disability',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        disability: textUI({
          title:
            'What service-connected disability prevents you from getting or keeping a job?',
          useDlWrap: true,
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      disabilityDescription: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            disability: textSchema,
          },
          required: ['disability'],
        },
      },
    },
    required: ['disabilityDescription'],
  },
};
