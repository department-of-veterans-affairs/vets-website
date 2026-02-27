import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom-v5-compat';
import {
  VaLink,
  VaRadio,
  VaRadioOption,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import HubCardList from './HubCardList';
import SelectPreferenceView from './SelectPreferenceView';

const initialEvaluationMeetingTypeRadioGroupName =
  'initial_evaluation_meeting_type_preference';

const INITIAL_EVALUATION_MEETING_TYPE = {
  TELECOUNSELING: 'Telecounseling meeting',
  IN_PERSON: 'In-person appointment',
};

const CaseProgressDescription = ({ step, showHubCards = false }) => {
  const navigate = useNavigate();
  const [
    initialEvaluationMeetingType,
    setInitialEvaluationMeetingType,
  ] = useState();
  const [
    initialEvaluationMeetingTypeSubmitted,
    setInitialEvaluationMeetingTypeSubmitted,
  ] = useState(false);

  const submitInitialEvaluationMeetingType = () => {
    setInitialEvaluationMeetingTypeSubmitted(true);
  };

  const handleRouteChange = href => event => {
    event.preventDefault();
    navigate(href);
  };

  const hubCards = showHubCards ? (
    <div className="vads-u-clear--both">
      <HubCardList step={step} />
    </div>
  ) : null;

  const href = '/';

  const withEligibilityLink = textBefore => (
    <p>
      {textBefore}{' '}
      <VaLink
        href={href}
        text="VR&amp;E Check My Eligibility"
        onClick={handleRouteChange(href)}
      />{' '}
      web page.
    </p>
  );

  switch (step) {
    case 1: {
      return (
        <>
          <p>
            We’ve received your application for VR&E benefits. There’s nothing
            you need to do right now.
          </p>
          {hubCards}
        </>
      );
    }

    case 2: {
      return (
        <>
          {withEligibilityLink(
            "Your application for VR&E benefits is currently being reviewed for basic eligibility. If you haven't confirmed your eligibility yet, please visit the",
          )}
          {hubCards}
        </>
      );
    }

    case 3: {
      return (
        <>
          <p>
            Your application for VR&E Chapter 31 benefits has been processed and
            your basic eligibility has been determined. Your next step is to
            watch the Orientation Video and confirm its completion, which can be
            found below. If you prefer, you can complete your orientation during
            your Initial Evaluation Counselor Meeting. Once you make your
            selection and submit your choice, you will receive an email
            confirming that you are ready to schedule your Initial Evaluation
            with your counselor.
          </p>
          <va-card background class="vads-u-padding-top--0">
            <h2 className="va-nav-linkslist-heading vads-u-margin-top--0 vads-u-margin-bottom--0">
              Reading Material
            </h2>
            <ul className="va-nav-linkslist-list vads-u-margin-bottom--2">
              <li>
                <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                  <va-link href="https://www.va.gov" text="Program Overview" />
                </h3>
                <p className="va-nav-linkslist-description">
                  More details in here.
                </p>
              </li>
              <li>
                <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                  <va-link
                    href="https://www.va.gov"
                    text="VR&E Support-and-Services Tracks"
                  />
                </h3>
                <p className="va-nav-linkslist-description">
                  We offer 5 support-and-services tracks to help you get
                  education or training, find and keep a job, and live as
                  independently as possible. Explore the different tracks and
                  take charge of your future.
                </p>
              </li>
            </ul>
            <h2 className="va-nav-linkslist-heading vads-u-margin-top--0 vads-u-margin-bottom--0">
              Orientation Completion
            </h2>
            <SelectPreferenceView />
          </va-card>
          {hubCards}
        </>
      );
    }

    case 4: {
      if (initialEvaluationMeetingTypeSubmitted) {
        return (
          <>
            <p>
              You have scheduled your Initial Evaluation Appointment. If you
              need to reschedule, please use your appointment confirmation,
              rescheduling link sent to you via email and text. If you need
              further assistance, please contact your counselor.
            </p>
            {hubCards}
          </>
        );
      }
      return (
        <>
          <p>
            VR&E has received and processed your application for Chapter 31
            benefits. Please check your email for confirmation that you can
            schedule your Initial Evaluation Counselor Meeting online. After
            scheduling, you will receive a confirmation of the meeting in a
            VR-03 Appointment and Orientation Notification Letter, which will be
            mailed to you. To prepare for your Initial Evaluation Counselor
            Meeting, please visit the "Career Planning" web page found below.
          </p>
          <va-card background class="vads-u-padding-top--0">
            <h2 className="va-nav-linkslist-heading vads-u-margin-top--0 vads-u-margin-bottom--0">
              Schedule your Initial Evaluation Counselor Meeting
            </h2>
            <p>
              You can either meet them in person, at their office, or you can
              meet them online. Please, select your preference from the radio
              button down below.
            </p>
            <VaRadio
              label="My preference is to:"
              onVaValueChange={e => {
                setInitialEvaluationMeetingType(e.detail.value);
              }}
            >
              <VaRadioOption
                label={INITIAL_EVALUATION_MEETING_TYPE.TELECOUNSELING}
                name={initialEvaluationMeetingTypeRadioGroupName}
                value={INITIAL_EVALUATION_MEETING_TYPE.TELECOUNSELING}
              />
              {initialEvaluationMeetingType ===
                INITIAL_EVALUATION_MEETING_TYPE.TELECOUNSELING && (
                <div className="vads-u-margin-left--4">
                  <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-padding-left--2">
                    <p>
                      Telecounseling uses Microsoft Teams, which is accessible
                      on any web-enabled device, such as a smartphone, tablet,
                      or laptop computer, with a webcam and microphone. You will
                      need to download the free application and click on
                      Telecounseling link to start the meeting.
                    </p>
                    <p>
                      Note: During the Telecounseling initial evaluation
                      appointment, you must be in a private setting to ensure
                      confidentiality of your personal information and to avoid
                      any distractions. If you wish to have anyone present
                      during your appointment, you must sign a release of
                      information before the person may attend your appointment.
                      The setting must also provide sufficient lightning and
                      noise control. If you are driving or a passenger in an
                      automobile during the scheduled appointment, the meeting
                      will be immediately canceled or rescheduled.
                    </p>
                  </div>

                  <VaButton
                    onClick={submitInitialEvaluationMeetingType}
                    text="Submit"
                  />
                </div>
              )}
              <VaRadioOption
                label={INITIAL_EVALUATION_MEETING_TYPE.IN_PERSON}
                name={initialEvaluationMeetingTypeRadioGroupName}
                value={INITIAL_EVALUATION_MEETING_TYPE.IN_PERSON}
              />
              {initialEvaluationMeetingType ===
                INITIAL_EVALUATION_MEETING_TYPE.IN_PERSON && (
                <div className="vads-u-margin-left--4">
                  <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-padding-left--2">
                    <p>
                      If your appointment is in-person appointment at a
                      specified location
                    </p>
                    <p>
                      a) Plan for the initial evaluation appointment to last two
                      hours or more as the appointment may also involve career
                      assessment, if you did not complete the online career
                      assessment.
                    </p>
                    <p>b) Do not bring minor children with you.</p>
                    <p>
                      c) If you have not submitted your required documents prior
                      to your scheduled initial evaluation, you may bring the
                      documents outlined.
                    </p>
                  </div>

                  <VaButton
                    onClick={submitInitialEvaluationMeetingType}
                    text="Submit"
                  />
                </div>
              )}
            </VaRadio>
          </va-card>
          {hubCards}
        </>
      );
    }

    case 5: {
      return (
        <>
          <p>
            Your counselor is now completing the Entitlement Determination
            Review. Please visit the "Career Planning" web page for more
            information about career paths, support, and rehabilitation
            resources.
          </p>
          {hubCards}
        </>
      );
    }

    case 6: {
      return (
        <>
          <p>
            Your counselor is working with you to establish and initiate your
            Chapter 31 Rehabilitation Plan and/or Career Track. Your counselor
            will share the Rehabilitation Plan with you for your review and
            approval.
          </p>
          {hubCards}
        </>
      );
    }

    case 7: {
      return (
        <>
          <p>
            Congratulations! Your Chapter 31 Rehabilitation Plan or Career Track
            has been initiated.
          </p>
          {hubCards}
        </>
      );
    }

    default:
      return null;
  }
};

CaseProgressDescription.propTypes = {
  step: PropTypes.number.isRequired,
  showHubCards: PropTypes.bool,
};

export default CaseProgressDescription;
