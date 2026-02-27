import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import HubCardList from './HubCardList';
import SelectPreferenceView from './SelectPreferenceView';

const CaseProgressDescription = ({ step, showHubCards = false, status }) => {
  const navigate = useNavigate();

  const ch31CaseMilestonesState = useSelector(
    state => state?.ch31CaseMilestones,
  );

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
        text="Your VR&E eligibility and benefits"
        onClick={handleRouteChange(href)}
      />{' '}
      page.
    </p>
  );

  switch (step) {
    case 1: {
      return (
        <>
          <p>
            We’ve received your application for VR&E benefits. There is nothing
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
            "Your application for VR&E benefits is currently being reviewed for basic eligibility. If you haven't confirmed your eligibility yet, visit",
          )}
          {hubCards}
        </>
      );
    }

    case 3: {
      return (
        <>
          <p>
            VR&E has received and processed your application for Chapter 31
            benefits. Your next step is to watch the Orientation Video and
            confirm its completion, which is below.
          </p>
          <p>
            If you prefer, you can complete the orientation during your Initial
            Evaluation Counselor Meeting. Once you make your selection, click
            submit, and the Initial Evaluation scheduling link will be sent via
            email.
          </p>
          <va-card background class="vads-u-padding-top--0">
            <h2 className="va-nav-linkslist-heading vads-u-margin-top--0 vads-u-margin-bottom--0">
              Orientation Completion
            </h2>
            {ch31CaseMilestonesState?.data &&
            !ch31CaseMilestonesState?.error ? (
              <va-alert
                class="vads-u-margin-top--2"
                full-width="false"
                slim
                status="success"
                visible
              >
                <p className="vads-u-margin-y--0">
                  Your choice has been recorded
                </p>
              </va-alert>
            ) : (
              <>
                <SelectPreferenceView />
                <h2 className="va-nav-linkslist-heading vads-u-margin-top--0 vads-u-margin-bottom--0">
                  Reading Material
                </h2>
                <ul className="va-nav-linkslist-list vads-u-margin-bottom--2">
                  <li>
                    <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                      <va-link
                        href="https://www.va.gov/careers-employment/vocational-rehabilitation"
                        text="Program Overview"
                        external
                      />
                    </h3>
                    <p className="va-nav-linkslist-description">
                      Read about how Veteran Readiness and Employment (Chapter
                      31) can help you address education or training needs.
                    </p>
                  </li>
                  <li>
                    <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                      <va-link
                        href="https://www.va.gov/careers-employment/vocational-rehabilitation/programs"
                        text="VR&E Support-and-Services Tracks"
                        external
                      />
                    </h3>
                    <p className="va-nav-linkslist-description">
                      We offer 5 support-and-services tracks to help you get
                      education, training, career planning, and live
                      independently.
                    </p>
                  </li>
                </ul>
              </>
            )}
          </va-card>
          {hubCards}
        </>
      );
    }

    case 4: {
      if (status === 'PENDING') {
        return (
          <p>
            We’ve received and processed your application for Chapter 31
            benefits. Check your email to schedule your meeting with your
            counselor. After scheduling, you’ll get a confirmation email and an
            appointment notification letter. To get ready for your Initial
            Evaluation Counselor Meeting, visit the "Career Planning" page
            linked below.
          </p>
        );
      }

      return (
        <p>
          Your Initial Evaluation Appointment has been scheduled. If you need to
          reschedule, use your appointment confirmation rescheduling link sent
          to you via email and text. If you need further assistance, contact
          your counselor.
        </p>
      );
    }

    case 5: {
      return (
        <>
          <p>
            Your counselor is completing the Entitlement Determination Review.
            Visit the “Career Planning” page for more information about career
            paths, support, and rehabilitation resources.
          </p>
          {hubCards}
        </>
      );
    }

    case 6: {
      return (
        <>
          <p>
            Your counselor is working with you to establish your Chapter 31
            Rehabilitation Plan or Career Track.
          </p>
          {hubCards}
        </>
      );
    }

    case 7: {
      return (
        <>
          <p>
            Your Chapter 31 Rehabilitation Plan or Career Track has started.
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
  status: PropTypes.string,
};

export default CaseProgressDescription;
