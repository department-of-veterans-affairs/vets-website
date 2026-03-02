import React from 'react';

export const form0781HeadingTag = 'VA FORM 21-0781';

export const traumaticEventsExamples = (
  <va-accordion open-single>
    <va-accordion-item class="vads-u-margin-y--3" id="first" bordered>
      <h3 slot="headline">Examples of traumatic events</h3>
      <h4 className="vads-u-margin-top--0">
        Traumatic events related to combat
      </h4>
      <ul>
        <li>You were engaged in combat with enemy forces</li>
        <li>You experienced fear of hostile military or terrorist activity</li>
        <li>You served in an imminent danger area</li>
        <li>You served as a drone aircraft crew member</li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Traumatic events related to sexual assault or harassment
      </h4>
      <ul>
        <li>
          You experienced pressure to engage in sexual activities (for example,
          someone threatened you with bad treatment for refusing sex, or
          promised you better treatment in exchange for sex)
        </li>
        <li>
          You were pressured into sexual activities against your will (for
          example, when you were asleep or intoxicated)
        </li>
        <li>You were physically forced into sexual activities</li>
        <li>
          You experienced offensive comments about your body or sexual
          activities
        </li>
        <li>You experienced repeated unwanted sexual advances</li>
        <li>
          You experienced someone touching or grabbing you against your will,
          including during hazing
        </li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Traumatic events related to other personal interactions
      </h4>
      <ul>
        <li>
          You experienced physical assault, battery, robbery, mugging, stalking,
          or harassment by a person who wasn’t part of an enemy force
        </li>
        <li>You experienced domestic intimate partner abuse or harassment</li>
      </ul>
      <h4 className="vads-u-margin-top--0">Other traumatic events</h4>
      <ul>
        <li>You got into a car accident</li>
        <li>You witnessed a natural disaster, like a hurricane</li>
        <li>You worked on burn ward or graves registration</li>
        <li>
          You witnessed the death, injury, or threat to another person or to
          yourself, that was caused by something other than a hostile military
          or terrorist activity
        </li>
        <li>
          You experienced or witnessed friendly fire that occurred on a gunnery
          range during a training mission
        </li>
      </ul>
    </va-accordion-item>
  </va-accordion>
);

export const mentalHealthSupportSummary = (
  <p>
    Before we start asking questions, we want to make sure you know how to get
    support if you need it. You can access support anytime, including while you
    wait for a decision on this claim.
  </p>
);

export const mentalHealthSupportTextBlob = (
  <>
    <p>
      We can connect you with mental health care—no matter your discharge
      status, service history, or eligibility for VA health care. And you can
      get free, confidential help anytime, day or night.
    </p>
    <va-link
      external
      href="https://www.va.gov/health-care/health-needs-conditions/mental-health/"
      text="Learn how to get support for mental health care"
    />
  </>
);

export const militarySexualTraumaSupportTextBlob = (
  <>
    <p>
      If you’re having difficulties related to military sexual trauma, we’re
      here to support you in whatever way will help you best.
    </p>
    <p>
      We provide free treatment for any physical or mental health conditions
      related to your experiences of MST. You don’t need to have reported the
      MST at the time or have other proof that the MST occurred to get care.
    </p>
    <va-link
      external
      href="https://www.va.gov/health-care/health-needs-conditions/military-sexual-trauma/"
      text="Learn how to get support for military sexual trauma"
    />
  </>
);

export const rememberTextBlob = (
  <p>
    <strong>Note: </strong>
    Any information you provide will help us understand your situation and
    identify evidence to support your claim. But you can skip questions you
    can’t or don’t want to answer. And you can save your in-progress online form
    anytime if you need a break.
  </p>
);

export const mentalHealthSupportResources = (
  <>
    <strong>
      Veterans Crisis Line responders are available 24 hours a day. You can
      connect with a responder in any of these ways:
    </strong>
    <ul>
      <li>
        Dial <va-telephone contact="988" /> then select 1.
      </li>
      <li>
        <va-link
          external
          href="https://www.veteranscrisisline.net/get-help-now/chat/"
          text="Start a confidential chat."
        />
      </li>
      <li>
        Text <va-telephone contact="838255" />.
      </li>
      <li>
        If you have hearing loss, call TTY: <va-telephone contact="711" />, then{' '}
        <va-telephone contact="988" />.
      </li>
    </ul>
    <strong>You can also get support in any of these ways:</strong>
    <ul>
      <li>
        <va-link
          external
          href="https://www.va.gov/get-help-from-accredited-representative/"
          text="Connect with a Veterans Service Officer (VSO) to assist you with your
          application."
        />
      </li>
      <li>
        Call <va-telephone contact="911" />.
      </li>
      <li>Go to the nearest emergency room.</li>
      <li>
        Go directly to your nearest VA medical center. It doesn’t matter what
        your discharge status is or if you’re enrolled in VA health care.
        <va-link
          external
          href="https://www.va.gov/find-locations/?facilityType=health"
          text="Find your nearest VA medical center"
        />
      </li>
    </ul>
    <strong>
      If your claim is related to MST (military sexual trauma), you can also get
      support in these ways:
    </strong>
    <ul>
      <li>
        <va-link
          external
          href="https://www.mentalhealth.va.gov/msthome/vha-mst-coordinators.asp"
          text="Connect with a MST Outreach Coordinator."
        />
      </li>
      <li>
        <va-link
          external
          href="https://www.va.gov/health-care/health-needs-conditions/military-sexual-trauma/"
          text="Learn more about our MST-related services."
        />
      </li>
    </ul>
  </>
);

export const mentalHealthSupportAlert = () => {
  return (
    <va-alert-expandable
      status="info"
      trigger="Get mental health and military sexual trauma support anytime"
    >
      <p>
        We can connect you with free, confidential support for mental health
        care or military sexual trauma anytime. We can connect you with support
        even if you don’t file a claim for disability compensation or you aren’t
        eligible for compensation.
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/health-care/health-needs-conditions/mental-health/"
          text="Learn how to get support for mental health care"
        />
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/health-care/health-needs-conditions/military-sexual-trauma/"
          text="Learn how to get support for military sexual trauma"
        />
      </p>
    </va-alert-expandable>
  );
};

/**
 * Generates a combined heading inside a <legend> element for use in a page title.
 * This groups a heading tag (like a form identifier) and a page-specific title
 * into a single semantic block, styled appropriately.
 *
 * @param {string} title - The main title for the page, typically describing the form section
 * @param {string} headingTag - A label or identifier that appears above the title
 * @returns {JSX.Element} A <legend> element containing a single <h3> with two styled <span> blocks
 *
 * Example rendered structure:
 * <legend>
 *   <h3 class="vads-u-margin--0">
 *     <span class="...">VA FORM 21-0781</span>
 *     <span class="...">Mental health support</span>
 *   </h3>
 * </legend>
 */
export function titleWithTag(title, headingTag) {
  return (
    <legend>
      <h3 className="vads-u-margin--0">
        <span className="vads-u-display--block vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
          {`${headingTag}`}{' '}
        </span>
        <span className="vads-u-display--block vads-u-font-size--h3 vads-u-color--base">
          {title}
        </span>
      </h3>
    </legend>
  );
}

export function standardTitle(title) {
  return (
    <h3 className="vads-u-margin--0">
      <span className="vads-u-display--block vads-u-font-size--h3 vads-u-color--base">
        {title}
      </span>
    </h3>
  );
}
