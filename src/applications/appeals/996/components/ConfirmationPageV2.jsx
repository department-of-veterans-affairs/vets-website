import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { SubmissionAlert } from 'platform/forms-system/src/js/components/ConfirmationView';
import { scrollTo } from 'platform/utilities/scroll';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { resetStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';
import { selectProfile } from 'platform/user/selectors';
import {
  informalConferenceLabel,
  informalConferenceLabels,
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
import { formTitle } from '../content/title';
import {
  chapterHeaderClass,
  ConfirmationSummary,
  ConfirmationReturnLink,
} from '../../shared/components/ConfirmationSummary';
import { ConfirmationTitle } from '../../shared/components/ConfirmationTitle';
import ConfirmationPersonalInfo from '../../shared/components/ConfirmationPersonalInfo';
import ConfirmationIssues from '../../shared/components/ConfirmationIssues';
import { getReadableDate } from '../../shared/utils/dates';

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

  const { submission, data = {} } = form;
  const hasConference = data.informalConferenceChoice === 'yes';
  const hasRepContact = data.informalConference === 'rep';
  const conferenceTimes =
    (hasConference &&
      CONFERENCE_TIMES_V2_5[data.informalConferenceTime][
        hasRepContact ? 'labelRep' : 'labelMe'
      ]) ||
    false;
  const { informalConferenceRep = {} } = data;

  const submitDate = getReadableDate(
    submission?.timestamp || new Date().toISOString(),
  );

  const conferenceMessage = hasConference
    ? `Since you requested an informal conference, we’ll contact ${
        hasRepContact ? 'your accredited representative' : 'you'
      } to schedule your conference.`
    : '';

  return (
    <>
      <ConfirmationTitle pageTitle={formTitle} />
      <SubmissionAlert
        title="Your Higher Level Review request submission is in progress"
        content={
          <>
            <p className="vads-u-margin-top--0">
              You submitted the request on {submitDate}. It can take a few days
              for us to receive your request. We’ll send you a confirmation
              letter once we’ve processed your request.
            </p>
            {hasConference && <p>{conferenceMessage}</p>}
          </>
        }
      />

      <ConfirmationSummary
        name="Higher-Level Review"
        downloadUrl={downloadUrl}
      />

      <h2>What to expect next</h2>
      <p className="next-steps">
        You don’t need to do anything unless we send you a letter asking for
        more information. {conferenceMessage} After we’ve completed our review,
        we’ll mail you a decision packet with the details of our decision.
      </p>
      <p>
        <va-link
          disable-analytics
          href="/decision-reviews/after-you-request-review/"
          text="Learn more about what happens after you request a decision review"
        />
      </p>
      <p>
        You can check the status of your request in the claims and appeals
        status tool. It may take <strong>7 to 10 days</strong> to appear there.
      </p>
      <p>
        <va-link
          disable-analytics
          href="/claim-or-appeal-status/"
          text="Check the status of your request for a Higher-Level Review online"
        />
      </p>

      <h2>How to contact us if you have questions</h2>
      <p>You can ask us a question online through Ask VA.</p>
      <p>
        <va-link
          disable-analytics
          href="https://ask.va.gov/"
          text="Contact us online through Ask VA"
        />
        .
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

      <h3 className={chapterHeaderClass}>Informal conference</h3>
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
            {informalConferenceLabels[data.informalConferenceChoice] || ''}
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
};

ConfirmationPageV2.propTypes = {
  children: PropTypes.element,
  form: PropTypes.shape({
    data: PropTypes.shape({}),
    formId: PropTypes.string,
  }),
};

export default ConfirmationPageV2;
