import React from 'react';
import PropTypes from 'prop-types';
import { VaRadioField } from '~/platform/forms-system/src/js/web-component-fields';
import { authorizationNote } from '../content/authorizeMedical';
import { saveYourApplication } from '../content/saveYourApplication';
import { representativeTypeMap } from '../utilities/helpers';

export const uiSchema = {
  'view:saveYourApplication': {
    'ui:description': saveYourApplication,
  },
  'ui:description': ({ formData }) => {
    return (
      <>
        <p>We’ll save your application after every change.</p>
        <h3>Authorization for access through VA’s sytems</h3>
        <p>
          This accredited{' '}
          {representativeTypeMap[formData.repTypeRadio] || `representative`} may
          work with their team to help you file a claim or request a decision
          review. Some of their team members may need to access your records
          outside of VA’s information technology systems.
        </p>
      </>
    );
  },
  'view:outsideVAAuthorizationPolicy': {
    'ui:description': () => {
      return (
        <div className="vads-u-margin-y--3">
          <va-accordion uswds bordered open-single>
            <va-accordion-item
              bordered
              header="Our policy for access outside of VA’s systems"
            >
              <p>
                If the individual in Item 16A is an accredited agent or
                attorney, I AUTHORIZE VA to disclose all my records (other than
                as provided in Items 20 and 21) to the following individuals
                named as administrative employees of my representative. This
                applies to disclosures, outside of those made via access to VA
                electronic IT systems contemplated by 38 CFR 1.600 to 1.603.
              </p>
            </va-accordion-item>
          </va-accordion>
        </div>
      );
    },
  },
  authorizeOutsideVARadio: {
    'ui:title': `Do you authorize this accredited representative's team to access your records outside of VA's information technology systems?`,
    'ui:webComponentField': VaRadioField,
    'ui:options': {
      widgetProps: {
        'Yes outside access': { 'data-info': 'yes_outside_access' },
        'No outside access': { 'data-info': 'no_outside_access' },
      },
      selectedProps: {
        'Yes outside access': { 'aria-describedby': 'yes_outside_access' },
        'No outside access': { 'aria-describedby': 'no_outside_access' },
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
    'view:outsideVAAuthorizationPolicy': {
      type: 'object',
      properties: {},
    },
    authorizeOutsideVARadio: {
      type: 'string',
      enum: [`Yes`, `No`],
    },
    'view:authorizationNote': {
      type: 'object',
      properties: {},
    },
  },
};

uiSchema.propTypes = {
  formData: PropTypes.shape({
    repTypeRadio: PropTypes.bool,
  }),
};
