import React from 'react';
import { authorizationNote } from '../content/authorizeMedical';
import { saveYourApplication } from '../content/saveYourApplication';

export const uiSchema = {
  'view:saveYourApplication': {
    'ui:description': saveYourApplication,
  },
  'view:authorizeInsideVA': {
    'ui:description': formData => {
      return (
        <>
          <h3>Authorization for access through VA’s sytems</h3>
          <p>
            This accredited{' '}
            {formData.repTypeRadio || `Veterans Service Organization (VSO)`} may
            work with their team to help you file a claim or request a decision
            review. Some of their team members may need to access your records
            through VA’s information technology systems.
          </p>
        </>
      );
    },
  },
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
                1.603, I AUTHORIZE VA to disclose all of my records (other than
                as provided in Items 20 and 21) to the associate attorneys,
                claims agents, and support staff affiliated with my
                representative.
              </p>
            </va-accordion-item>
          </va-accordion>
        </div>
      );
    },
  },
  authorizeInsideVARadio: {
    'ui:title': `Do you authorize this accredited [attorney, claims agent]'s team to access your records through VA’s information systems?`,
    'ui:widget': 'radio',
    'ui:options': {
      widgetProps: {
        'Yes inside access': { 'data-info': 'yes_inside_access' },
        'No inside access': { 'data-info': 'no_inside_access' },
      },
      selectedProps: {
        'Yes inside access': { 'aria-describedby': 'yes_inside_access' },
        'No inside access': { 'aria-describedby': 'no_inside_access' },
      },
      'ui:errorMessages': {
        required: 'Field is required',
      },
    },
  },

  'view:authorizationNote': {
    'ui:description': authorizationNote,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:saveYourApplication': {
      type: 'object',
      properties: {},
    },
    'view:authorizeInsideVA': {
      type: 'object',
      properties: {},
    },
    'view:insideVAAuthorizationPolicy': {
      type: 'object',
      properties: {},
    },
    authorizeInsideVARadio: {
      type: 'string',
      enum: [`Yes`, `No`],
    },
    'view:authorizationNote': {
      type: 'object',
      properties: {},
    },
  },
};
