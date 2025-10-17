import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const SupportingDocumentsContent = (
  <>
    <p>
      On the next screen, we’ll ask you to submit supporting documents and
      additional evidence for your expenses. If you upload all of this
      information online now, you may be able to get a faster decision for your
      claim.
    </p>

    <p>You’ll need to submit one of these supporting documents:</p>

    <ul>
      <li>
        <va-link
          href="#"
          text="Residential Care, Adult Daycare, or a Similar Facility worksheet (opens in a new tab)"
          external
        />
      </li>
      <li>
        <va-link
          href="#"
          text="In-Home Attendant Expenses worksheet (opens in a new tab)"
          external
        />
      </li>
    </ul>

    <p>
      If you have nursing home expenses, you may need to submit one of these
      supporting documents:
    </p>

    <ul>
      <li>
        Request for Nursing Home Information in Connection with Claim for Aid
        and Attendance (
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-0779/"
          text="VA Form 21-0779 (opens in a new tab)"
          external
        />
        )
      </li>
      <li>
        Examination for Housebound Status or Permanent Need for Regular Aid and
        Attendance form (
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-2680/"
          text="VA Form 21-2680 (opens in a new tab)"
          external
        />
        )
      </li>
    </ul>
  </>
);

/** @type {PageSchema} */
export default {
  title: 'Supporting documents',
  path: 'expenses/additional-information/supporting-documents',
  uiSchema: {
    ...titleUI('Supporting documents'),
    'view:supportingDocuments': {
      'ui:description': SupportingDocumentsContent,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:supportingDocuments': {
        type: 'object',
        properties: {},
      },
    },
  },
};
