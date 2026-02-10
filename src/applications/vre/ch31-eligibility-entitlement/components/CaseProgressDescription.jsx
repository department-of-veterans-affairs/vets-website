import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom-v5-compat';
import {
  VaLink,
  VaRadio,
  VaRadioOption,
  VaAdditionalInfo,
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

const CaseProgressDescription = ({ step, status, showHubCards = false }) => {
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
        text="VR&amp;E Check My Eligibility web page."
        onClick={handleRouteChange(href)}
      />{' '}
    </p>
  );

  switch (step) {
    case 1: {
      if (status === 'ACTIVE') {
        return (
          <>
            <p>Your application for VR&E benefits has been received.</p>
            {hubCards}
          </>
        );
      }

      if (status === 'COMPLETED') {
        return (
          <>
            <p>
              Your application for VR&E benefits has been received and is being
              evaluated.
            </p>
            {hubCards}
          </>
        );
      }

      return (
        <>
          <p>
            Your application for VR&E benefits has not yet been received and/or
            is being routed for evaluation.
          </p>
          {hubCards}
        </>
      );
    }

    case 2: {
      if (status === 'ACTIVE') {
        return (
          <>
            {withEligibilityLink(
              'Your VR&E Benefits Application is currently being evaluated for basic eligibility. If you have not yet verified your eligibility for VR&E CH31 Benefits, please visit the',
            )}
            {hubCards}
          </>
        );
      }

      if (status === 'COMPLETED') {
        return (
          <>
            <p>
              Your VR&E application for Chapter 31 benefits has been reviewed
              for basic eligibility. To learn more about the program, its five
              support-and-service tracks, and how to prepare for your career,
              please visit the links provided in the "Preparing for the Next
              Steps" section below.
            </p>
            {hubCards}
          </>
        );
      }

      return (
        <>
          {withEligibilityLink(
            'Once your VR&E Benefits Application has been deemed complete, it will be assessed for basic eligibility. If you have not verified your eligibility for VR&E CH31 Benefits, please visit the',
          )}
          {hubCards}
        </>
      );
    }

    case 3: {
      if (status === 'ACTIVE') {
        return (
          <>
            <p>
              Your application for VR&E Chapter 31 benefits is processed and
              basic eligibility is determined, a VR-03 Appointment and
              Orientation Notification Letter is being generated and will be
              sent to you regarding your scheduled appointment. Your next step
              is to watch and confirm completion of the Orientation Video, which
              can be found on the “Orientation Tools and Resources” tile at the
              bottom of this web page.
            </p>
            <va-card background class="vads-u-padding-top--0">
              <h2 className="va-nav-linkslist-heading vads-u-margin-top--0 vads-u-margin-bottom--0">
                Reading Material
              </h2>
              <ul className="va-nav-linkslist-list vads-u-margin-bottom--2">
                <li>
                  <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                    <va-link
                      href="https://www.va.gov"
                      text="Program Overview"
                    />
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

      if (status === 'COMPLETED') {
        return (
          <>
            <p>Congratulations! You have completed your Orientation.</p>
            {hubCards}
          </>
        );
      }

      return (
        <>
          <p>
            Once your application for VR&E Chapter 31 benefits is processed,
            then your basic eligible is determined. You will then receive a
            VR-03 Appointment and Orientation Notification Letter. Your first
            step will be to watch and confirm completion of the Orientation
            Video, which can be found on the “Orientation Tools and Resources”
            tile at the bottom of this web page.
          </p>
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
                  <VaAdditionalInfo
                    trigger="Additional Info"
                    className="vads-u-margin-bottom--1"
                  >
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
                  </VaAdditionalInfo>
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
                  <VaAdditionalInfo
                    trigger="Additional Info"
                    className="vads-u-margin-bottom--1"
                  >
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
                  </VaAdditionalInfo>
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
      if (status === 'ACTIVE') {
        return (
          <>
            <p>
              You have completed your initial evaluation meeting, are in the
              process of, or have provided additional evidence and documentation
              requested, and your Counselor is completing the Entitlement
              Determination Review. Please visit the Career Planning Page for
              more information about career paths, support, and rehabilitation
              support.
            </p>
            {hubCards}
          </>
        );
      }

      if (status === 'COMPLETED') {
        return (
          <>
            <p>
              Congratulations! Your initial evaluation is complete and
              Entitlement Determination Date has been established. Your
              Counselor will be reaching out to you to begin your VR&E Chapter
              31 Benefits for Vocational Exploration. To prepare for your
              Vocational Exploration meeting, please visit the “Career Planning”
              Page for more information about career paths, support, and
              rehabilitation support.
            </p>
            {hubCards}
          </>
        );
      }

      return (
        <>
          <p>
            Once you complete your initial evaluation, then your Counselor will
            confirm your Entitlement Determination for Chapter 31 Benefits. They
            will document their findings and record the date of confirmation,
            known as the Entitlement Determination Date.
          </p>
          {hubCards}
        </>
      );
    }

    case 6: {
      if (status === 'ACTIVE') {
        return (
          <>
            <p>
              Your counselor is collaborating with you to establish and initiate
              your Chapter 31 Rehabilitation Plan and/or Career Track. Once your
              primary goals, objectives, services, effective date, duration, and
              schedule are determined, you will be asked to review and approve
              the Rehabilitation Plan. The finalized forms will be uploaded to
              your VA Electronic Folder (eFolder).
            </p>
            {hubCards}
          </>
        );
      }

      if (status === 'COMPLETED') {
        return (
          <>
            <p>
              Congratulations! Your Chapter 31 Rehabilitation Plan is complete.
              Your VR&E Chapter 31 benefits have started, and you can now see
              the expected start date, duration, and estimated completion dates.
              If you don’t see these dates below, please contact your team or
              counselor for more information.
            </p>
            {hubCards}
          </>
        );
      }

      return (
        <>
          <p>
            Program participants are informed and then select a specific track
            to achieve their rehabilitation goal: Reemployment, Rapid Access to
            Employment, Employment through Long-Term Services, Independent
            Living, or Self-Employment. Once you complete your Orientation,
            Initial Evaluation, and receive a positive Entitlement
            Determination, your journey on one of these Rehabilitation Paths or
            Career Tracks will begin.
          </p>
          {hubCards}
        </>
      );
    }

    case 7: {
      if (status === 'ACTIVE') {
        return (
          <>
            <p>
              Congratulations! Your Chapter 31 Rehabilitation Plan or Career
              Track has been initiated and you will receive your primary goals
              and objectives, your start or effective date, and the estimated
              completion date.
            </p>
            {hubCards}
          </>
        );
      }

      if (status === 'COMPLETED') {
        return (
          <>
            <p>
              Congratulations! Your Rehabilitation Plan or Career Track has been
              completed and your goals and objectives have been achieved.
            </p>
            {hubCards}
          </>
        );
      }

      return (
        <>
          <p>
            Once you complete all the previous steps and your Chapter 31
            Rehabilitation Plan or Career Track is approved, your Chapter 31
            benefits will begin.
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
  status: PropTypes.oneOf(['PENDING', 'ACTIVE', 'COMPLETED']),
  showHubCards: PropTypes.bool,
};

CaseProgressDescription.defaultProps = {
  status: 'PENDING',
};

export default CaseProgressDescription;
