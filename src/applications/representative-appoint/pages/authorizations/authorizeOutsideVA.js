import React from 'react';
import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import PropTypes from 'prop-types';
import { authorizationNote } from '../../content/authorizeMedical';
import { representativeTypeMap } from '../../utilities/helpers';

export const uiSchema = {
  'ui:description': ({ formData }) => {
    return (
      <>
        <h3>Authorization for access outside of VA’s systems</h3>
        <p className="appoint-text">
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
  authorizeOutsideVARadio: radioUI({
    title:
      'Do you authorize this accredited representative’s team to access your records outside of VA’s information technology systems?',
    updateUiSchema: formData => {
      const title = `Do you authorize this accredited ${representativeTypeMap[
        (formData?.repTypeRadio)
      ] ||
        'representative'}'s team to access your records through VA's information technology systems?`;
      return { 'ui:title': title };
    },
  }),
  'view:authorizationNote5': {
    'ui:description': authorizationNote,
  },
};

export const schema = {
  type: 'object',
  required: ['authorizeOutsideVARadio'],
  properties: {
    'view:outsideVAAuthorizationPolicy': {
      type: 'object',
      properties: {},
    },
    authorizeOutsideVARadio: radioSchema(['Yes', 'No']),
    'view:authorizationNote5': {
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
