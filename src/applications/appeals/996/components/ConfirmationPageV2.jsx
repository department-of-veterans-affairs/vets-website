import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { resetStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

import { selectProfile } from 'platform/user/selectors';

import {
  informalConferenceLabel,
  newInformalConferenceLabels,
} from '../content/InformalConference';
import {
  informalConferenceContactLabel,
  informalConferenceContactOptions,
} from '../content/InformalConferenceContact';
import {
  RepresentativeFirstNameTitle,
  RepresentativeLastNameTitle,
  RepresentativePhoneTitle,
  RepresentativeEmailTitle,
} from '../content/InformalConferenceRep';
import { CONFERENCE_TIMES_V2_5 } from '../constants';

import {
  ConfirmationTitle,
  ConfirmationAlert,
  ConfirmationReturnLink,
} from '../../shared/components/ConfirmationCommon';
import ConfirmationPersonalInfo from '../../shared/components/ConfirmationPersonalInfo';
import ConfirmationPdfMessages from '../../shared/components/ConfirmationPdfMessages';
import ConfirmationIssues from '../../shared/components/ConfirmationIssues';

export const ConfirmationPageV2 = () => {
  resetStoredSubTask();

  const alertRef = useRef(null);

  const form = useSelector(state => state.form || {});
  const profile = useSelector(state => selectProfile(state));

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        // delay focus for Safari
        waitForRenderThenFocus('#main h2', alertRef.current);
      }
    },
    [alertRef],
  );

  // Fix this after Lighthouse sets up the download URL
  const downloadUrl = ''; // HLR_PDF_DOWNLOAD_URL;

  const { data = {} } = form;
  const hasConference = data.informalConferenceChoice === 'yes';
  const hasRepContact = data.informalConference === 'rep';
  const conferenceTimes =
    (hasConference &&
      CONFERENCE_TIMES_V2_5[data.informalConferenceTime][
        hasRepContact ? 'labelRep' : 'labelMe'
      ]) ||
    false;
  const { informalConferenceRep = {} } = data;

  const alertTitle = 'We’ve received your request for a Higher-Level Review';
  const alertContent = (
    <>
      <p className="vads-u-margin-top--0">
        If you requested an informal conference, we’ll contact you to schedule
        your conference.
      </p>
      <p className="vads-u-margin-bottom--0">
        After we’ve completed our review, we’ll mail you a decision packet with
        the details of our decision.
      </p>
    </>
  );

  return (
    <>
      <ConfirmationTitle pageTitle="Request a Higher-Level Review" />
      <ConfirmationAlert alertTitle={alertTitle} alertContent={alertContent} />

      <div className="screen-only">
        {downloadUrl && (
          <va-summary-box uswds class="vads-u-margin-top--2">
            <h3 slot="headline" className="vads-u-margin-top--0">
              Save a PDF copy of your Higher-Level Review request
            </h3>
            <p>
              If you’d like to save a PDF copy of your completed Higher-Level
              Review request for your records, you can download it now.
            </p>
            <p>
              <ConfirmationPdfMessages pdfApi={downloadUrl} />
            </p>
            <p>
              <strong>Note:</strong> This PDF is for your records only. You’ve
              already submitted your completed Higher-Level Review request. We
              ask that you don’t send us another copy.
            </p>
          </va-summary-box>
        )}

        <h3>Print this confirmation page</h3>
        <p>
          You can print this page, which includes a summary of the information
          you submitted in your Higher-Level Review request.
        </p>
        <va-button onClick={window.print} text="Print this page" />
      </div>

      <h2>What to expect next</h2>
      <p>
        You don’t need to do anything unless we send you a letter asking for
        more information. If you requested an informal conference, we’ll contact
        you to schedule your conference.
      </p>
      <p>
        <a href="/decision-reviews/after-you-request-review/">
          Learn more about what happens after you request a decision review
        </a>
      </p>
      <p>You can also check the status of your request online.</p>
      <p>
        <a href="/claim-or-appeal-status/">
          Check the status of your request for a Higher-Level Review online
        </a>
      </p>
      <p>
        <strong>Note:</strong> It may take 7 to 10 days after you submit your
        request for it to appear online.
      </p>

      <h2>How to contact us if you have questions</h2>
      <p>You can ask us a question online through Ask VA.</p>
      <p>
        <a href="https://ask.va.gov/">Contact us online through Ask VA.</a>
      </p>
      <p>
        Or call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ).
      </p>
      <p>
        <strong>
          If you don’t hear back from us about your Higher-Level Review request,
        </strong>{' '}
        don’t request a Higher-Level Review again or another type of decision
        review. Contact us online or call us instead.
      </p>

      <h2 className="vads-u-margin-top--4">Your Higher-Level Review request</h2>

      <ConfirmationPersonalInfo
        dob={profile.dob}
        homeless={data.homeless}
        userFullName={profile.userFullName}
        veteran={data.veteran}
      />

      <ConfirmationIssues data={data} />

      <h3 className="vads-u-margin-top--2">Informal conference</h3>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            {informalConferenceLabel}
          </div>
          <div
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-dd-action-name="informal conference choice"
          >
            {newInformalConferenceLabels[data.informalConferenceChoice] || ''}
          </div>
        </li>
        {hasConference && (
          <li>
            <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
              {informalConferenceContactLabel}
            </div>
            <div
              className="vads-u-margin-bottom--2 dd-privacy-hidden"
              data-dd-action-name="informal conference contact"
            >
              {informalConferenceContactOptions[data.informalConference]}
            </div>
            {hasRepContact && (
              <>
                <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
                  {RepresentativeFirstNameTitle}
                </div>
                <div
                  className="vads-u-margin-bottom--2 dd-privacy-hidden"
                  data-dd-action-name="informal conference rep first name"
                >
                  {informalConferenceRep.firstName || ''}
                </div>
                <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
                  {RepresentativeLastNameTitle}
                </div>
                <div
                  className="vads-u-margin-bottom--2 dd-privacy-hidden"
                  data-dd-action-name="informal conference rep last name"
                >
                  {informalConferenceRep.lastName}
                </div>
                <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
                  {RepresentativePhoneTitle}
                </div>
                <div
                  className="vads-u-margin-bottom--2 dd-privacy-hidden"
                  data-dd-action-name="informal conference rep phone"
                >
                  <va-telephone
                    not-clickable
                    contact={informalConferenceRep.phone}
                    extension={informalConferenceRep.extension}
                  />
                </div>
                <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
                  {RepresentativeEmailTitle}
                </div>
                <div
                  className="vads-u-margin-bottom--2 dd-privacy-hidden"
                  data-dd-action-name="informal conference rep email"
                >
                  {informalConferenceRep.email}
                </div>
              </>
            )}
            <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
              Best time to call?
            </div>
            <div
              className="vads-u-margin-bottom--2 dd-privacy-hidden"
              data-dd-action-name="informal conference selected time"
            >
              {conferenceTimes}
            </div>
          </li>
        )}
      </ul>

      <ConfirmationReturnLink />
    </>
  );

  /*
  return (
    <ConfirmationDecisionReviews
      appType="request"
      pageTitle="Request a Higher-Level Review"
      alertTitle="We’ve received your request for a Higher-Level Review"
      alertContent={alertContent}
    >
      <h2 className="vads-u-font-size--h3">What to expect next</h2>
      <p>
        You don’t need to do anything unless we send you a letter asking for
        more information. If you requested an informal conference, we’ll contact
        you to schedule your conference.
      </p>
      <a href="/decision-reviews/after-you-request-review/">
        Learn more about what happens after you request a decision review
      </a>
      <p>You can also check the status of your request online.</p>
      <a href="/claim-or-appeal-status/">
        Check the status of your Higher-Level Review request online
      </a>
      <p>
        <strong>Note:</strong> It may take 7 to 10 days after you submit your
        request for it to appear online.
      </p>

      <h2 className="vads-u-font-size--h3">
        How to contact us if you have questions
      </h2>
      <p>You can ask us a question online through Ask VA.</p>
      <p>
        <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
      </p>
      <p>
        Or call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ).
      </p>
      <p>
        <strong>
          If you don’t hear back from us about your Higher-Level Review request,
        </strong>{' '}
        don’t request a Higher-Level Review again or another type of decision
        review. Contact us online or call us instead.
      </p>
    </ConfirmationDecisionReviews>
  );
  */
};

ConfirmationPageV2.propTypes = {
  children: PropTypes.element,
  form: PropTypes.shape({
    data: PropTypes.shape({}),
    formId: PropTypes.string,
  }),
};

export default ConfirmationPageV2;
