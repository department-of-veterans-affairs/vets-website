import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEventOnce } from 'platform/monitoring/record-event';
import { ANALYTICS_EVENTS, HELP_TEXT_CLICKED_EVENT } from '../constants';
import { getSharedVariable, setSharedVariable } from '../utils/sharedState';

const {
  openedPrivateRecordsAcknowledgment,
  // openedPrivateChoiceHelp,
} = ANALYTICS_EVENTS;

export const privateRecordsChoiceHelp = (
  <p>
    <va-accordion open-single>
      <va-accordion-item
        bordered
        header="What happens when you upload your non-VA treatment records yourself"
        id="get-records-yourself"
      >
        <p>
          We can review your claim more quickly if you upload your records
          yourself. You can upload .pdf, .jpeg, or .png files.
        </p>
      </va-accordion-item>
    </va-accordion>

    <va-accordion open-single>
      <va-accordion-item
        bordered
        header="What happens when you ask us to get your non-VA treatment records"
        id="have-va-get-your-records"
      >
        <p>
          We’ll ask you to give us information about the provider or hospital
          that treated you. We’ll use this information to get your records. It
          may take some time for us to get them. This means that it could take
          longer for us to decide your claim. We’ll try at least 2 times to get
          your records from the provider or hospital. If we can’t get them,
          we’ll contact you to let you know and tell you if there’s anything you
          need to do.
        </p>
      </va-accordion-item>
    </va-accordion>
  </p>
);

export const recordsConfirmAlertBanner = () => {
  if (getSharedVariable('alertNeedsShown4142') === true) {
    setSharedVariable('alertNeedsShown4142', false);
    return (
      <va-banner
        data-label="Info banner"
        headline="Confirm how to provide your non-VA records"
        type="warning"
        visible
      >
        <p>
          You previously chose not to upload your private medical records and
          gave us permission to get them from your provider. But we updated our
          terms and conditions for the release of these records.
          <br />
          If you still want us to get them, select <strong>No</strong> and
          review the updated terms and conditions on the next screen.
        </p>
      </va-banner>
    );
  }
  return null;
};

export const patientAcknowledgmentTitle = (
  <h3 className="vads-u-margin-top--0">Authorize us to get your records</h3>
);

export const privateRecordsChoiceHelpTitle = (
  <h4 className="vads-u-margin-top--0">
    What else to know about these options
  </h4>
);

export const patientAcknowledgmentError = (
  <p>
    You must select “I acknowledge and authorize this release of information”
    for us to get your records from your provider.
  </p>
);

export const authorizationNotes = (
  <p>
    <strong>Note:</strong> If you select <strong>No</strong>, we’ll use VA Form
    21-4142 to authorize VA to get your non-VA treatment records.
    <br />
    <br />
    <va-link
      external
      href="https://www.va.gov/find-forms/about-form-21-4142/"
      text="Learn more about VA Form 21-4142"
    />
  </p>
);

export const patientAcknowledgmentText = (
  <div className="patient-acknowldegment-help">
    <VaAdditionalInfo
      trigger="Read the full text."
      disableAnalytics
      onClick={() =>
        recordEventOnce(
          openedPrivateRecordsAcknowledgment,
          HELP_TEXT_CLICKED_EVENT,
        )
      }
    >
      <h4>Patient Authorization:</h4>
      <p>
        I voluntarily authorize and request disclosure (including paper, oral,
        and electronic interchange) of: All my medical records; including
        information related to my ability to perform tasks of daily living. This
        includes specific permission to release:
      </p>
      <ol>
        <li>
          All records and other information regarding my treatment,
          hospitalization, and outpatient care for my impairment(s) including,
          but not limited to:
        </li>
        <li>
          <ul>
            <li>
              Psychological, psychiatric, or other mental impairment(s)
              excluding "psychotherapy notes" as defined in 45 C.F.R. §164.501,
            </li>
            <li>Drug abuse, alcoholism, or other substance abuse,</li>
            <li>Sickle cell anemia,</li>
            <li>
              Records which may indicate the presence of a communicable or
              non-communicable disease; and tests for or records of HIV/AIDS,
            </li>
            <li>Gene-related impairments (including genetic test results)</li>
          </ul>
        </li>
        <li>
          Information about how my impairment(s) affects my ability to complete
          tasks and activities of daily living, and affects my ability to work.
        </li>
        <li>
          Information created within 12 months after the date this authorization
          is signed in Item 11, as well as past information.
        </li>
      </ol>
      <p>
        You should not complete this form unless you want the VA to obtain
        private treatment records on your behalf. If you have already provided
        these records or intend to obtain them yourself, there is no need to
        fill out this form. Doing so will lengthen your claim processing time.
      </p>
      <h4>Important:</h4>
      <p>
        In accordance with 38 C.F.R. §3.159(c), "VA will not pay any fees
        charged by a custodian to provide records requested."
      </p>
      <h4>Patient Acknowledgment:</h4>
      <p>
        I hereby authorize the sources listed in Section IV, to release any
        information that may have been obtained in connection with a physical,
        psychological or psychiatric examination or treatment, with the
        understanding that VA will use this information in determining my
        eligibility to veterans benefits I have claimed.
      </p>
      <p>
        I understand that the source being asked to provide the Veterans
        Benefits Administration with records under this authorization may not
        require me to execute this authorization before it provides me with
        treatment, payment for health care, enrollment in a health plan, or
        eligibility for benefits provided by it.
      </p>
      <p>
        I understand that once my source sends this information to VA under this
        authorization, the information will no longer be protected by the HIPAA
        Privacy Rule, but will be protected by the Federal Privacy Act, 5 USC
        552a, and VA may disclose this information as authorized by law.
      </p>
      <p>
        I also understand that I may revoke this authorization in writing, at
        any time except to the extent a source of information has already relied
        on it to take an action. To revoke, I must send a written statement to
        the VA Regional Office handling my claim or the Board of Veterans'
        Appeals (if my claim is related to an appeal) and also send a copy
        directly to any of my sources that I no longer wish to disclose
        information about me.
      </p>
      <p>
        I understand that VA may use information disclosed prior to revocation
        to decide my claim.
      </p>
      <p>
        <va-link
          external
          href="https://www.benefits.va.gov/privateproviders/"
          text="Learn more about VA From 21-4142"
        />
      </p>
    </VaAdditionalInfo>
  </div>
);
