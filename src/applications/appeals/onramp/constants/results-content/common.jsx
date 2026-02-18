import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import manifest from '../../manifest.json';

export const HORIZ_RULE = (
  <hr className="vads-u-margin-y--4" aria-hidden="true" />
);
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
      class="print-button"
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
      situation changes—or you want to review other options for a different
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
      href="/find-forms/about-form-21-0788"
      text="Learn how to apply to receive an Apportionment of Beneficiary's Award"
    />
  </>
);

export const COURT_OF_APPEALS = (
  <va-card class="vads-u-display--block vads-u-margin-top--3">
    <h3 className="vads-u-margin-top--0">
      US Court of Appeals for Veterans Claims
    </h3>
    <p>
      This is a legal appeal outside of VA and may be a good fit for an appeal
      of a Board decision.
    </p>
    <p>
      <strong>Note:</strong> This option is available only if it has been fewer
      than 120 days since your decision date.{' '}
    </p>
    <va-link
      external
      href="https://www.uscourts.cavc.gov/appeal.php"
      text="How to file an appeal on the US Court of Appeals website"
    />
  </va-card>
);

export const GET_GUIDANCE = (
  <>
    <h2>Get additional guidance for your situation</h2>
    <h3>Contact an accredited representative</h3>
    <p>
      An accredited representative can review your specific situation and help
      you understand all your options. They provide free services and know VA
      rules and processes.
    </p>
    <va-link
      href="/get-help-from-accredited-representative"
      text="Get help from an accredited attorney, claims agent, or Veterans Service Organization (VSO) representative"
    />
    <h3>Message us</h3>
    <va-link
      href="/contact-us/ask-va"
      text="Contact us online through Ask VA"
    />
    <h3>Call us</h3>
    <p>
      MyVA411 main information line:{' '}
      <va-telephone contact={CONTACTS.HELP_DESK} />
    </p>
    <p>
      VA benefits hotline: <va-telephone contact={CONTACTS.VA_BENEFITS} />
    </p>
    <p>
      Health benefits hotline: <va-telephone contact="8772228287" />
    </p>
    <p>
      Telecommunications Relay Services (using TTY):{' '}
      <va-telephone contact={CONTACTS['711']} tty />
    </p>
  </>
);

export const CLAIM_FOR_INCREASE_CARD = (nested = false) => {
  let header = <h2 className="vads-u-margin-top--0">Claim for increase</h2>;

  if (nested) {
    header = <h3 className="vads-u-margin-top--0">Claim for increase</h3>;
  }

  return (
    <>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
      a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="onramp-list-none" role="list">
        <li>
          <va-card data-testid="claim-for-increase-card">
            {header}
            <p>
              This may be a good fit because your condition has worsened since
              the decision on your initial claim. This could result in an
              increased award moving forward.
            </p>
            <p>
              <strong>Note:</strong> You’ll need to submit evidence with your
              claim.
            </p>
            <va-link
              external
              class="vads-u-display--block vads-u-margin-bottom--2"
              href="/disability/how-to-file-claim/evidence-needed/#type-of-claim-youre-filing"
              text="Learn more about evidence needed for a claim for increase"
            />
            <va-link-action
              href="/disability/file-disability-claim-form-21-526ez"
              text="Start disability compensation application"
            />
          </va-card>
        </li>
      </ul>
    </>
  );
};

export const CONDITION_HAS_WORSENED_INFO = (
  <>
    <h2 className="vads-u-margin-y--3">Your condition has worsened</h2>
    <p>
      Since your condition has gotten worse, this option may be a good fit for
      you.
    </p>
  </>
);
