import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import HubCardList from './HubCardList';

const CaseProgressDescription = ({ step, status, showHubCards = false }) => {
  const navigate = useNavigate();

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
              for basic eligibility. Please visit the “Orientation Tools and
              Resources” link below to complete your CH31 Benefits Orientation.
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
              basic eligible is determined, a VR-03 Appointment and Orientation
              Notification Letter is being generated and will be sent to you
              regarding your scheduled appointment. Your next step is to watch
              and confirm completion of the Orientation Video, which can be
              found on the “Orientation Tools and Resources” tile at the bottom
              of this web page.
            </p>
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
      if (status === 'ACTIVE') {
        return (
          <>
            <p>
              VR&E has received and processed your Chapter 31 Benefits. Your
              VR-03 Appointment and Orientation Notification Letter has been
              created, uploaded to your VA eFolder (see link below), and sent to
              you in the mail. The letter includes details about your scheduled
              Initial Evaluation Appointment and outlines what you need to
              prepare for your meeting. Please visit the “Career Planning” Page
              to familiarize yourself with your career tools and the 28-1902w
              (Information for Veteran Readiness and Employment Entitlement
              Determination) Form.
            </p>
            {hubCards}
          </>
        );
      }

      if (status === 'COMPLETED') {
        return (
          <>
            <p>
              You have met with your VR&E counselor and provided the necessary
              information for your initial evaluation. If there are any
              outstanding requests for additional information or documentation,
              please submit those as soon as possible so your Counselor can
              complete the Entitlement Determination.
            </p>
            {hubCards}
          </>
        );
      }

      return (
        <>
          <p>
            After your application for VR&E Benefits is processed and your basic
            eligible is determined for Chapter 31 Benefits, you will receive a
            notification for an appointment, usually in the form of a VR-03
            Appointment and Orientation Notification Letter. This letter will
            include the date and time of your telecounseling appointment. If you
            prefer not to complete your initial evaluation via a telecounseling
            session, you have the option to request an in-person appointment.
          </p>
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
              Your Counselor is collaborating with you to establish and initiate
              your Chapter 31 Rehabilitation Plan and/or Career Track. Once your
              primary goals, objectives, services, effective date, duration, and
              schedule are determined, you will be asked to review and approve
              it before it is finalized and approved. The finalized forms will
              be uploaded to your VA eFolder.
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
