import React from 'react';
import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { authorizationNote } from '../../content/authorizeMedical';
import { getRepType } from '../../utilities/helpers';
import { InsideVAAuthorizationDescription } from '../../components/InsideVAAuthorizationDescription';

/** @type {UISchemaOptions} */

export const uiSchema = {
  'ui:description': ({ formData }) => (
    <InsideVAAuthorizationDescription formData={formData} />
  ),
  'view:insideVAAuthorizationPolicy': {
    'ui:description': () => {
      return (
        <div className="vads-u-margin-y--3">
          <va-accordion uswds bordered open-single>
            <va-accordion-item
              bordered
              header="Our policy for access through VA’s systems"
            >
              <p>
                If the individual in Item 16A is an accredited agent or attorney
                who has been approved by VA for access to VA information
                technology (IT) systems in accordance with 38 CFR 1.600 to
                1.603, <strong>I AUTHORIZE </strong> VA to disclose all of my
                records (other than as provided in Items 20 and 21) to the
                associate attorneys, claims agents, and support staff affiliated
                with my representative.
              </p>
            </va-accordion-item>
          </va-accordion>
        </div>
      );
    },
  },
  authorizeInsideVARadio: radioUI({
    title:
      'Do you authorize this accredited representative’s team to access your records through VA’s information technology systems?',
    updateUiSchema: formData => {
      const title = `Do you authorize this accredited ${getRepType(
        formData['view:selectedRepresentative'],
      )}’s team to access your records through VA’s information technology systems?`;
      return { 'ui:title': title };
    },
  }),
  'view:authorizationNote2': {
    'ui:description': authorizationNote,
  },
};

/** @type {UISchemaOptions} */
export const schema = {
  type: 'object',
  required: ['authorizeInsideVARadio'],
  properties: {
    'view:insideVAAuthorizationPolicy': {
      type: 'object',
      properties: {},
    },
    authorizeInsideVARadio: radioSchema(['Yes', 'No']),
    'view:authorizationNote2': {
      type: 'object',
      properties: {},
    },
  },
};
