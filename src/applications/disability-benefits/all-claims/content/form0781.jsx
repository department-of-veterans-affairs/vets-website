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
        <li>You experienced unwanted sexual advances</li>
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
      trigger="Learn how to get mental health help now"
    >
      <p>
        We understand that some of the questions may be difficult to answer. If
        you need to take a break and come back to your application, your
        information will be saved.
      </p>
      <br />
      <p>
        If you’re a Veteran in crisis or concerned about one, connect with our
        caring, qualified Veterans Crisis Line responders for confidential help.
        Many of them are Veterans themselves. This service is private, free, and
        available 24/7.
      </p>
      <br />
      {mentalHealthSupportResources}
    </va-alert-expandable>
  );
};

/**
 * Create a title and headingTag for a page which will be passed into ui:title so that
 * they are grouped in the same legend
 * @param {string} title - the title for the page, which displays below the stepper
 * @param {string} headingTag - the headingTag for the page, which displays above the title
 * @returns {JSX.Element} markup with title and headingTag. example below.
 *
 * <h3 class="...">VA FORM 21-0781</h3>
 * <h3 class="...">Mental health support</h3>
 */
export function titleWithTag(title, headingTag) {
  return (
    <>
      <h3 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-margin--0">
        {`${headingTag} `}
      </h3>
      <h3 className="vads-u-font-size--h3 vads-u-color--base vads-u-margin--0">
        {title}
      </h3>
    </>
  );
}
