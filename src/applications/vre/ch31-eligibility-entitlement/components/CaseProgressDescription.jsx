import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import HubCardList from './HubCardList';
import SelectPreferenceView from './SelectPreferenceView';

const CaseProgressDescription = ({ step, showHubCards = false }) => {
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
