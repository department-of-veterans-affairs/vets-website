import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const CaseProgressDescription = ({ step }) => {
  const navigate = useNavigate();

  const handleRouteChange = href => event => {
    event.preventDefault();
    navigate(href);
  };

  switch (step) {
    case 1:
      return (
        <p className="usa-width-two-thirds">
          Your application for VR&E benefits has not yet been received and/or is
          being routed for evaluation.
        </p>
      );

    case 2: {
      const href = '/';
      return (
        <p className="usa-width-two-thirds">
          Once your VR&E Benefits Application has been deemed complete, it will
          be assessed for basic eligibility. If you have not yet verified your
          eligibility for VR&E CH31 Benefits, please visit the{' '}
          <VaLink
            href={href}
            text="VR&amp;E Check My Eligibility web page."
            onClick={handleRouteChange(href)}
          />{' '}
        </p>
      );
    }

    case 3:
      return (
        <p className="usa-width-two-thirds">
          Once your application for VR&E Chapter 31 benefits is processed, then
          your basic eligible is determined. You will then receive a VR-03
          Appointment and Orientation Notification Letter. Your first step will
          be to watch and confirm completion of the Orientation Video, which can
          be found on the "Orientation Tools and Resources" tile at the bottom
          of this web page.
        </p>
      );

    case 4:
      return (
        <p className="usa-width-two-thirds">
          After your application for VR&E Benefits is processed and your basic
          eligible is determined for Chapter 31 Benefits, you will receive a
          notification for an appointment, usually in the form of a VR-03
          Appointment and Orientation Notification Letter. This letter will
          include the date and time of your telecounseling appointment. If you
          prefer not to complete your initial evaluation via a telecounseling
          session, you have the option to request an in-person appointment.
        </p>
      );

    case 5:
      return (
        <p className="usa-width-two-thirds">
          Once you complete your initial evaluation, then your Counselor will
          confirm your Entitlement Determination for Chapter 31 Benefits. They
          will document their findings and record the date of confirmation,
          known as the Entitlement Determination Date.
        </p>
      );

    case 6:
      return (
        <p className="usa-width-two-thirds">
          Program participants are informed and then select a specific track to
          achieve their rehabilitation goal: Reemployment, Rapid Access to
          Employment, Employment through Long-Term Services, Independent Living,
          or Self-Employment. Once you complete your Orientation, Initial
          Evaluation, and receive a positive Entitlement Determination, your
          journey on one of these Rehabilitation Paths or Career Tracks will
          begin.
        </p>
      );

    case 7:
      return (
        <p className="usa-width-two-thirds">
          Once you complete all the previous steps and your Chapter 31
          Rehabilitation Plan or Career Track is approved, your Chapter 31
          benefits will begin.
        </p>
      );

    default:
      return null;
  }
};

CaseProgressDescription.propTypes = {
  step: PropTypes.number.isRequired,
};

export default CaseProgressDescription;
