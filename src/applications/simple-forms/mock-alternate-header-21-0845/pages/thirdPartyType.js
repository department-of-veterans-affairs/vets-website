import React from 'react';
import { radioSchema } from 'platform/forms-system/src/js/web-component-patterns/radioPattern';

import { THIRD_PARTY_TYPES } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    thirdPartyType: {
      'ui:title': (
        <h1
          aria-describedby="alternate-header-stepper"
          className="vads-u-color--gray-dark vads-u-font-size--h3 medium-screen:vads-u-font-size--h1"
        >
          Do you authorize us to release your information to a specific person
          or to an organization?
        </h1>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          [THIRD_PARTY_TYPES.PERSON]: 'A specific person',
          [THIRD_PARTY_TYPES.ORGANIZATION]: 'An organization',
        },
      },
      'ui:reviewField': ({ children: { props } }) => (
        <div className="review-row">
          <dt>
            Do you authorize us to release your information to a specific person
            or to an organization?
          </dt>
          <dd>{props.uiSchema['ui:options'].labels[(props?.formData)]}</dd>
        </div>
      ),
    },
    // web component implementation
    // disabled until radio issues are resolved
    // radioUI({
    //   title:
    //     'Do you authorize us to release your information to a specific person or to an organization?',
    //   labels: {
    //     [THIRD_PARTY_TYPES.PERSON]: 'A specific person',
    //     [THIRD_PARTY_TYPES.ORGANIZATION]: 'An organization',
    //   },
    //   labelHeaderLevel: '1',
    // }),
  },
  schema: {
    type: 'object',
    required: ['thirdPartyType'],
    properties: {
      thirdPartyType: radioSchema(Object.values(THIRD_PARTY_TYPES)),
    },
  },
};
