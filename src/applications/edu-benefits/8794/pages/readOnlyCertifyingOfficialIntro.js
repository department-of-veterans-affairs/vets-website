import React from 'react';
import { descriptionUI } from 'platform/forms-system/src/js/web-component-patterns';

export const readOnlyCertifyingOfficialIntro = descriptionUI(
  <>
    <p>
      In this next section of the form, please list any read-only certifying
      officials at your institution. A read-only certifying official is an
      individual at an educational institution or training facility with
      permission to access enrollment information, request information, and
      submit inquiries to VA to assist an authorized SCO with obtaining accurate
      information to certify student’s enrollment. Individuals requesting
      “read-only” access are not required to complete 305 training.
    </p>
    <va-alert status="info" visible>
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
        <strong>Note:</strong> All certifying officials at your institution must
        be listed on this form. This submission will replace any previously
        provided list of certifying officials.{' '}
        <strong>
          If any information in this form changes, you must submit a new,
          updated form.
        </strong>
      </p>
    </va-alert>
  </>,
)['ui:description'];
