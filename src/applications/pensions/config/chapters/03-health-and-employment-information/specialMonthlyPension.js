import React from 'react';

import { SpecialMonthlyPensionEvidenceAlert } from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    specialMonthlyPension: {
      'ui:widget': 'yesNo',
      'ui:options': {
        updateSchema: (formData, schema, uiSchema) => {
          const labelString = 'Are you claiming special monthly pension?';

          // eslint-disable-next-line no-param-reassign
          uiSchema['ui:reviewField'] = ({ children }) => (
            // prevent ui:title's <h3> from getting pulled into
            // review-field's <dt> & causing a11y headers-hierarchy errors.
            <div className="review-row">
              <dt>{labelString}</dt>
              <dd>{children}</dd>
            </div>
          );

          return {
            title: (
              <>
                <h3>
                  {labelString}{' '}
                  <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-color--secondary-dark">
                    (*Required)
                  </span>
                </h3>
                <span className="vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-line-height--4 vads-u-display--block">
                  If you have certain health needs or disabilities, you may be
                  eligible for additional pension. We call this special monthly
                  pension (SMP).
                  <br />
                  <br />
                  You may be eligible for SMP if you need the regular assistance
                  of another person, have severe visual impairment, or are
                  generally confined to your immediate premises.
                </span>
              </>
            ),
            uiSchema,
          };
        },
      },
    },
    'view:warningAlert': {
      'ui:description': SpecialMonthlyPensionEvidenceAlert,
      'ui:options': {
        hideIf: formData => formData.specialMonthlyPension !== true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['specialMonthlyPension'],
    properties: {
      specialMonthlyPension: {
        type: 'boolean',
      },
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
