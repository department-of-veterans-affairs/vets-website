import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const Description = () => (
  <div>
    <p>
      We need to know if you and your dependents have over $75,000 in assets.
    </p>
  </div>
);

const WhatWeConsiderAsset = () => (
  <va-accordion>
    <va-accordion-item level={4} header="What we consider an asset">
      <div>
        <p>
          Assets include the fair market value of all the real and personal
          property that you own, minus the amount of any mortgages you have.
          “Real property” is the land and buildings you own. And “personal
          property” is items like these:
        </p>
        <ul>
          <li>Investments, like stocks and bonds</li>
          <li>Antique furniture</li>
          <li>Boats</li>
        </ul>
        <p className="vads-u-font-weight--bold">
          We don’t include items like these in your assets:
        </p>
        <ul>
          <li>
            Your primary residence (the home where you live most or all of your
            time)
          </li>
          <li>Your car</li>
          <li>
            Basic home items, like appliances that you wouldn’t take with you if
            you moved to a new house
          </li>
        </ul>
      </div>
    </va-accordion-item>

    <va-accordion-item level={4} header="Who we consider a dependent">
      <div>
        <p className="vads-u-font-weight--bold">A dependent is:</p>
        <ul>
          <li>
            A spouse (<strong>Note:</strong> We recognize same-sex and common
            law marriages)
          </li>
          <li>
            An unmarried child (including an adopted child or stepchild) who
            meets 1 of the eligibility requirements listed here
          </li>
        </ul>
        <p className="vads-u-font-weight--bold">
          To be considered a dependent, one of these must be true of an
          unmarried child:
        </p>
        <ul>
          <li>
            They’re under 18 years old, <strong>or</strong>
          </li>
          <li>
            They’re between the ages of 18 and 23 years old and enrolled in
            school full time, <strong>or</strong>
          </li>
          <li>They became permanently disabled before they turned 18</li>
        </ul>
      </div>
    </va-accordion-item>

    <va-accordion-item level={4} header="Whose assets you need to report">
      <div>
        <p className="vads-u-font-weight--bold">
          If you’re a surviving spouse claimant:
        </p>
        <p>
          You must report income and assets for yourself and for any child of
          the veteran who lives with you or for whom you are responsible, unless
          a court has decided you do not have custody of the child.
        </p>
        <p className="vads-u-font-weight--bold">
          If you’re a surviving child claimant:
        </p>
        <p>
          This means that the child isn’t in the custody of a surviving spouse.
          You must report income and assets for yourself, your custodian, and
          your custodian’s spouse. If your custodian is an agency or facility,
          you do not need to report their income.
        </p>
      </div>
    </va-accordion-item>
  </va-accordion>
);

const uiSchema = {
  ...titleUI('Income and assets', Description),
  'ui:description': WhatWeConsiderAsset,
  totalNetWorth: yesNoUI({
    title: 'Do you and your dependents have over $25,000 in assets?',
  }),
};

const schema = {
  type: 'object',
  required: ['totalNetWorth'],
  properties: {
    totalNetWorth: yesNoSchema,
  },
};

export default {
  uiSchema,
  schema,
};
