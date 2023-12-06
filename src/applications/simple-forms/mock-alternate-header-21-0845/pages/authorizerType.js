import React from 'react';
import { radioSchema } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerType: {
      'ui:title': (
        <h1
          aria-describedby="alternate-header-stepper"
          className="vads-u-color--gray-dark vads-u-font-size--h3 medium-screen:vads-u-font-size--h1"
        >
          Who's submitting this authorization?
        </h1>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          veteran: "I'm a Veteran submitting on my own behalf",
          nonVeteran:
            "I'm a non-Veteran beneficiary or claimant submitting on behalf of a Veteran",
        },
      },
      'ui:reviewField': ({ children: { props } }) => (
        <div className="review-row">
          <dt>Who's submitting this authorization?</dt>
          <dd>{props.uiSchema['ui:options'].labels[(props?.formData)]}</dd>
        </div>
      ),
    },
    // web component implementation
    // disabled until radio issues are resolved
    // authorizerType: radioUI({
    //   title: "Who's submitting this authorization?",
    //   labels: {
    //     veteran: "I'm a Veteran submitting on my own behalf",
    //     nonVeteran:
    //       "I'm a non-Veteran beneficiary or claimant submitting on behalf of a Veteran",
    //   },
    //   labelHeaderLevel: '1',
    // }),
  },
  schema: {
    type: 'object',
    required: ['authorizerType'],
    properties: {
      authorizerType: radioSchema(['veteran', 'nonVeteran']),
    },
  },
};
