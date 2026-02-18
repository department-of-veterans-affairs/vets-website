import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const SupportingDocumentsContent = (
  <>
    <p>
      Next we’ll ask you to submit evidence (supporting documents) for your
      expenses. If you upload all of this information online now, you may be
      able to get a faster decision on your claim.
    </p>

    <p>
      If you’re claiming expenses for a residential care facility or in-home
      care attendant, you’ll need to submit these supporting documents:
    </p>

    <ul>
      <li>
        Worksheet for a Residential Care, Adult Daycare, or Similar Facility
        from VA Form 21P-8416
        <span className="vads-u-display--block">
          <va-link
            href="https://www.va.gov/find-forms/about-form-21p-8416/"
            text="Get VA Form 21P-8416 to download"
            external
          />
        </span>
      </li>
      <li>
        Worksheet for In-Home Attendant from VA Form 21P-8416
        <span className="vads-u-display--block">
          <va-link
            href="https://www.va.gov/find-forms/about-form-21p-8416/"
            text="Get VA Form 21P-8416 to download"
            external
          />
        </span>
      </li>
    </ul>

    <p>
      If you have nursing home expenses, you may need to submit 1 of these
      supporting documents:
    </p>

    <ul>
      <li>
        Request for Nursing Home Information in Connection with Claim for Aid
        and Attendance (VA Form 21-0779)
        <span className="vads-u-display--block">
          <va-link
            href="https://www.va.gov/find-forms/about-form-21-0779/"
            text="Get VA Form 21-0779 to download"
            external
          />
        </span>
      </li>
      <li>
        Examination for Housebound Status or Permanent Need for Regular Aid and
        Attendance form (VA Form 21-2680)
        <span className="vads-u-display--block">
          <va-link
            href="https://www.va.gov/find-forms/about-form-21-2680/"
            text="Get VA Form 21-2680 to download"
            external
          />
        </span>
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
