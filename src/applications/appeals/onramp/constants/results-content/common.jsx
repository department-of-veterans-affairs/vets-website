import React from 'react';
import manifest from '../../manifest.json';

export const HORIZ_RULE = <hr className="vads-u-margin-y--4" />;
export const NON_DR_HEADING = `Your available options`;
export const DR_HEADING = `Your decision review options`;

export const PRINT_RESULTS = (
  <>
    <h2 className="vads-u-margin-y--3">Print your results</h2>
    <p>
      You can print this page to keep a summary of your answers and the options
      that may apply to you.
    </p>
    <va-button
      class="vads-u-width--full"
      onClick={window.print}
      text="Print this page"
    />
  </>
);

export const RESTART_GUIDE = (
  <>
    <h2 className="vads-u-margin-y--0">Want to explore other pathways?</h2>
    <p className="vads-u-margin-bottom--3">
      We showed decision review options based on your responses. If your
      situation changes—or you want to see other options for a different
      reason—you can restart the guide.
    </p>
    <va-link-action href={manifest.rootUrl} text="Restart the guide" />
  </>
);

export const PRINT_OR_RESTART = (
  <>
    {PRINT_RESULTS}
    {HORIZ_RULE}
    {RESTART_GUIDE}
  </>
);

export const DIVIDED_BENES = (
  <>
    <h2 className="vads-u-margin-top--3">
      If you’re requesting a change to how benefits are divided
    </h2>
    <p>
      Some contested claims—like apportionments—may follow a different process.
    </p>
    <va-link
      external
      href="/find-forms/about-form-21-0788"
      text="Learn how to apply to receive an Apportionment of Beneficiary's Award"
    />
  </>
);
