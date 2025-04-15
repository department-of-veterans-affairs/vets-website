import React from 'react';
import PropTypes from 'prop-types';
import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { authorizationNote } from '../../content/authorizeMedical';
import { getRepType } from '../../utilities/helpers';
import { OutsideVAAuthorizationDescription } from '../../components/OutsideVAAuthorizationDescription';

export const uiSchema = {
  'ui:description': ({ formData }) => (
    <OutsideVAAuthorizationDescription formData={formData} />
  ),
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
                attorney, <strong>I AUTHORIZE</strong> VA to disclose all my
                records (other than as provided in Items 20 and 21) to the
                following individuals named as administrative employees of my
                representative. This applies to disclosures, outside of those
                made via access to VA electronic IT systems contemplated by 38
                CFR 1.600 to 1.603.
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
      const title = `Do you authorize this accredited ${getRepType(
        formData['view:selectedRepresentative'],
      )}’s team to access your records outside VA’s information technology systems?`;
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
