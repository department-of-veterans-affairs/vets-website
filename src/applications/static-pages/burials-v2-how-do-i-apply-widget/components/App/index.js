import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

export const App = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const burialFormV2 = useToggleValue(TOGGLE_NAMES.burialFormV2);
  let timeLimitContent = (
    <>
      <h2>Is there a time limit for filing?</h2>
      <p>
        If you’re claiming a burial allowance for a non-service-connected death
        or unclaimed remains you must file a claim within 2 years after the
        Veteran’s burial.
      </p>
      <p>
        <strong>Note:</strong> If you’re claiming an allowance for burial plot
        interment or transportation costs for a non-service-connected death and
        the Veteran died while getting VA care either at a VA health facility or
        a facility contracted by VA, there’s no time limit to file a claim.
      </p>
      <p>
        If a Veteran’s discharge was changed after death from dishonorable to
        another status, you must file an allowance claim within 2 years after
        the discharge update.
      </p>
      <p>
        If you’re claiming an allowance for burial plot interment or
        transportation costs for a service-connected death, there’s no time
        limit.
      </p>
    </>
  );
  let documentSubmissionContent = (
    <>
      <h2>What documents do I need to submit with my application?</h2>
      <p>
        <strong>You’ll need to provide copies of these documents:</strong>
      </p>
      <ul>
        <li>The Veteran’s death certificate including the cause of death</li>
        <li>
          An itemized receipt for transportation costs (only if you paid
          transportation costs for the Veteran’s remains)
        </li>
      </ul>
      <p>
        We also recommend providing a copy of the Veteran’s DD214 or other
        separation documents including all of their service periods.
      </p>
      <p>
        If you don’t have their DD214 or other separation documents you can
        request these documents now.
      </p>
      <va-link>Learn more about requesting military service records.</va-link>
    </>
  );
  let mailDirectionsContent = (
    <>
      <p>
        Mail the application and copies of supporting documents to this address:
      </p>
      <p className="va-address-block">
        Department of Veterans Affairs <br />
        Pension Intake Center
        <br />
        PO Box 5365
        <br />
        Janesville, WI 53547-5365
        <br />
      </p>
    </>
  );
  if (!burialFormV2) {
    timeLimitContent = (
      <>
        <h2>Is there a time limit for filing?</h2>
        <p>
          You must file a claim for a non-service-connected burial allowance
          within 2 years after the Veteran’s burial. If a Veteran’s discharge
          was changed after death from dishonorable to another status, you must
          file for an allowance claim within 2 years after the discharge update.
        </p>
        <p>
          There’s no time limit to file for a service-connected burial, plot, or
          interment allowance.
        </p>
      </>
    );
    documentSubmissionContent = (
      <>
        <h2>What documents do I need to send with my application?</h2>
        <p>
          <strong>You’ll need to send copies of these documents:</strong>
        </p>
        <ul>
          <li>
            The Veteran’s military discharge papers (DD214 or other separation
            documents)
          </li>
          <li>The Veteran’s death certificate</li>
          <li>
            Any documents or receipts you have for the cost of transporting the
            Veteran’s remains
          </li>
          <li>
            A statement of account (preferably with the letterhead of the
            funeral director or cemetery owner)
          </li>
        </ul>
        <p>
          <strong>
            The statement of account should include this information:
          </strong>
        </p>
        <ul>
          <li>The Veteran’s name</li>
          <li>The type of service or item purchased</li>
          <li>Any credits</li>
          <li>The unpaid balance</li>
        </ul>
      </>
    );
    mailDirectionsContent = (
      <>
        <p>
          Mail the application and copies of supporting documents to your
          nearest VA regional office.
        </p>
        <va-link
          href="https://www.va.gov/find-locations/?facilityType=benefits"
          text="Find your nearest VA regional office."
        />
      </>
    );
  }
  return (
    <>
      <>
        <va-alert status="info">
          <h2>
            Am I eligible for allowances to help pay for a Veteran’s burial and
            funeral costs?
          </h2>
          <p>
            You may be eligible for Veterans burial allowances if you’re paying
            for the burial and funeral costs and you won’t be reimbursed by any
            other organization like another government agency or the Veteran’s
            employer. You must also meet all of these requirements.
          </p>
          <p>
            <strong>
              One of these relationships or professional roles describes your
              connection to the Veteran:
            </strong>
          </p>
          <ul>
            <li>
              You’re the Veteran’s surviving spouse (<strong>Note:</strong> We
              recognize same-sex marriages.), <strong>or</strong>
            </li>
            <li>
              You’re the surviving partner from a legal union (a relationship
              made formal in a document issued by the state recognizing the
              union), <strong>or</strong>
            </li>
            <li>
              You’re a surviving child of the Veteran, <strong>or</strong>
            </li>
            <li>
              You’re a parent of the Veteran, <strong>or</strong>
            </li>
            <li>
              You’re the executor or administrator of the Veteran’s estate
              (someone who officially represents the Veteran),{' '}
              <strong>or</strong>
            </li>
            <li>
              You’re a family member or friend who isn’t the executor of the
              Veteran’s estate, <strong>or</strong>
            </li>
            <li>
              You’re a representative from a funeral home, cemetery, or other
              organization
            </li>
          </ul>
          <p>
            <strong>
              The Veteran must not have received a dishonorable discharge and
              one of these circumstances must be true:
            </strong>
          </p>
          <ul>
            <li>
              The Veteran died as a result of a service-connected disability (a
              disability related to service), <strong>or</strong>
            </li>
            <li>
              The Veteran died while getting VA care either at a VA facility or
              at a facility contracted by VA, <strong>or</strong>
            </li>
            <li>
              The Veteran died while traveling with proper authorization and at
              VA’s expense either to or from a facility for an examination or to
              receive treatment or care, <strong>or</strong>
            </li>
            <li>
              The Veteran died with an original or reopened claim for VA
              compensation or pension pending at the time of death and they
              would’ve been entitled to benefits before the time of death,{' '}
              <strong>or</strong>
            </li>
            <li>
              The Veteran died while receiving a VA pension or compensation,{' '}
              <strong>or</strong>
            </li>
            <li>
              The Veteran died while eligible for a VA pension or compensation
              at their time of death but instead received full military
              retirement or disability pay, <strong>or</strong>
            </li>
            <li>
              The Veteran had been getting compensation or a VA pension when
              they died, <strong>or</strong>
            </li>
            <li>
              The Veteran had chosen to get military retired pay instead of
              compensation
            </li>
          </ul>
          <p>
            Note: We’ll also provide an allowance for the cost of transporting a
            Veteran’s remains for burial in a national cemetery.
          </p>
          <h3>You can’t get burial allowances for certain individuals</h3>
          <p>
            We don’t provide burial allowances if the individual died in any of
            these ways:
          </p>
          <ul>
            <li>
              On active duty, <strong>or</strong>
            </li>
            <li>
              While serving as a member of Congress, <strong>or</strong>
            </li>
            <li>While serving a federal prison sentence</li>
          </ul>
        </va-alert>

        {timeLimitContent}
        {documentSubmissionContent}

        <h2>How do I apply?</h2>
        <p>You can apply online or by mail.</p>
        <h3>Option 1: Online</h3>
        {burialFormV2 && (
          <p>
            We updated our online form. If you started applying online before
            04/05/2024, we have some new questions for you to answer. And we
            changed some questions so you may need to provide certain
            information again.
          </p>
        )}
        <a
          className="vads-c-action-link--green"
          href="/burials-and-memorials/application/530/introduction"
        >
          Apply for burial benefits
        </a>

        <h3>Option 2: By mail</h3>
        <p>Fill out an Application for Burial Benefits (VA Form 21P-530EZ).</p>
        <va-link
          href="https://www.va.gov/find-forms/about-form-21p-530ez/"
          text="Get VA Form 21P-530EZ to download."
        />
        {mailDirectionsContent}
      </>
    </>
  );
};

export default App;
