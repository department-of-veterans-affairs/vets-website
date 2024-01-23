import React from 'react';
import { CurrentDebtTitle } from '../../components/shared/CurrentDebtTitle';
import ResolutionWaiverAgreement from '../../components/resolution/ResolutionWaiverAgreement';
import { validateWaiverCheckbox } from '../../utils/validations';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:validations': [validateWaiverCheckbox],
      resolutionWaiverCheck: {
        'ui:title': (
          <div className="vads-u-margin-y--0">
            <p className="vads-u-display--block">
              You selected:{' '}
              <span className="vads-u-font-weight--bold">Waiver</span>
            </p>

            <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-bottom--1">
              If we approve your request, we’ll stop collection on and waive the
              debt.
            </span>
          </div>
        ),
        'ui:widget': ResolutionWaiverAgreement,
        'ui:options': {
          hideOnReview: true,
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebtsAndCopays: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          resolutionWaiverCheck: {
            type: 'boolean',
          },
        },
      },
    },
  },
};
