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
    <va-accordion-item>
      <span slot="headline">What we consider an asset</span>
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

    <va-accordion-item>
      <span slot="headline">Who we consider a dependent</span>
      <div>
        <p className="vads-u-font-weight--bold">A dependent is:</p>
        <ul>
          <li>
            A spouse (<strong>Note:</strong> We recognize same-sex and common
            law marriages)
          </li>
          <li>
            A parent, if you’re directly caring for them and their income and
            net worth are below a certain amount
          </li>
          <li>
            An unmarried child (including an adopted child or stepchild) who
            meets one of the eligibility requirements listed here
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
          <li>They became permanently disabled</li>
        </ul>
      </div>
    </va-accordion-item>

    <va-accordion-item>
      <span slot="headline">Whose assets you need to report</span>
      <div>
        <p className="vads-u-font-weight--bold">
          If you’re a surviving spouse claimant:
        </p>
        <p>
          You must report income and assets for yourself and for any child of
          the veteran who lives with you or for whom you are responsible.
        </p>
        <p>A court may have decided you do not have custody of the child.</p>
        <p className="vads-u-font-weight--bold">
          If you’re a surviving child claimant:
        </p>
        <p>
          This means that the child isn’t in the custody of a surviving spouse.
        </p>
        <p>
          You must report income and assets for yourself, your custodian, and
          your custodian’s spouse.
        </p>
      </div>
    </va-accordion-item>
  </va-accordion>
);

const uiSchema = {
  ...titleUI('Income and assets', Description),
  'ui:description': WhatWeConsiderAsset,
  hasAssetsOverThreshold: yesNoUI({
    title: 'Do you and your dependents have over $75,000 in assets?',
  }),
};

const schema = {
  type: 'object',
  required: ['hasAssetsOverThreshold'],
  properties: {
    hasAssetsOverThreshold: yesNoSchema,
  },
};

export default {
  uiSchema,
  schema,
};
