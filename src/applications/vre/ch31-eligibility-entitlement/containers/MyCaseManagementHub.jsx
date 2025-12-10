import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { fetchCh31CaseStatusDetails } from '../actions/ch31-my-eligibility-and-benefits';
import HubCardList from '../components/HubCardList';
import ApplicationDiscontinuedAlert from '../components/ApplicationDiscontinuedAlert';

const stepLabels = [
  'Application Received',
  'Eligibility Determination',
  'Chapter 31 Benefits Orientation',
  'VR&E Benefits Intake Counselor Meeting',
  'Entitlement Determination date set',
  'Chapter 31 Rehabilitation Plan/Career Track',
  'VR&E Chapter 31 Benefits Initiated',
];

const MyCaseManagementHub = () => {
  const dispatch = useDispatch();

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showMyCaseManagementHubPage = useToggleValue(
    TOGGLE_NAMES.vre_eligibility_status_phase_2_updates,
  );

  const total = stepLabels.length; // 7
  const [current, setCurrent] = useState(2);

  const caseStatusDetails = useSelector(
    state => state?.ch31CaseStatusDetails?.data,
  );

  useEffect(
    () => {
      dispatch(fetchCh31CaseStatusDetails());
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (!caseStatusDetails) {
        return;
      }
      const attrs = caseStatusDetails?.attributes;
      const stateList = attrs?.external_status?.state_list || [];

      if (!stateList.length) {
        return;
      }

      const activeIndex = stateList.findIndex(step => step.status === 'ACTIVE');

      if (activeIndex >= 0) {
        const activeStep = Math.min(activeIndex + 1, total);
        setCurrent(activeStep);
      }
    },
    [caseStatusDetails, total],
  );

  const goPrev = () => setCurrent(c => Math.max(1, c - 1));
  const goNext = () => setCurrent(c => Math.min(total, c + 1));

  let labelsWithStatus = stepLabels;
  const attrs = caseStatusDetails?.attributes;
  const stateList = attrs?.external_status?.state_list || [];

  if (Array.isArray(stateList) && stateList.length) {
    labelsWithStatus = stepLabels.map((label, index) => {
      const stepState = stateList[index];
      if (!stepState || !stepState.status) {
        return label;
      }
      // e.g., "Application Received - COMPLETED"
      return `${label} - [${stepState.status}]`;
    });
  }

  if (!showMyCaseManagementHubPage) {
    return (
      <div className="row">
        <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
          <h1>My Case Management Hub</h1>
          <p className="vads-u-color--gray-medium">
            This page isn’t available right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="vads-u-margin-top--0p5 vads-u-margin-x--1 vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--0">
        <h1>My Case Management Hub</h1>

        <p className="usa-width-two-thirds">
          The Case Management Hub enables Veterans to manage their entire
          VR&amp;E journey independently, from eligibility determination through
          program participation and completion.
        </p>

        <h2>Case Progress</h2>

        <div className="usa-width-two-thirds vads-u-margin-y--3">
          <va-alert-expandable
            status="info"
            trigger="You have an Appointment Scheduled"
          >
            <p>
              We would like to remind you that you have an appointment scheduled
              with your Counselor for 11/30/2025 at 2:00 pm ET at the following
              location:
            </p>
            <p className="va-address-block">
              Department of Veterans Affairs Claims Intake Center <br />
              Attention: C-123 Claims
              <br />
              PO Box 5088
              <br />
              Janesville, WI 53547-5088
              <br />
            </p>
          </va-alert-expandable>
        </div>

        <div className="usa-width-two-thirds vads-u-margin-y--3">
          <va-alert
            close-btn-aria-label="Close notification"
            status="warning"
            visible
          >
            <h3 slot="headline">Scheduling isn’t available yet</h3>
            <p className="vads-u-margin-y--0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.
            </p>
          </va-alert>
        </div>
        <ApplicationDiscontinuedAlert />
        <div className="usa-width-one-whole vads-u-margin-top--2">
          <va-segmented-progress-bar
            counters="small"
            current={String(current)}
            heading-text="VA Benefits"
            label="Label is here"
            labels={labelsWithStatus.join(';')}
            total={String(total)}
          />
        </div>

        <p className="usa-width-two-thirds">
          Lorem ipsum dolor sit amet consectetur. Rutrum pulvinar suspendisse
          libero at pretium velit. Scelerisque mattis congue auctor enim nunc
          amet vitae accumsan viverra. Massa odio orci fringilla commodo et
          pellentesque donec arcu commodo. Dui consectetur sed nisl sed
          penatibus placerat.
        </p>

        <div className="usa-width-one-whole">
          <va-additional-info trigger="Additional Information">
            <p>Here are some popular pets to consider</p>
            <ul>
              <li>Dogs</li>
              <li>Cats</li>
              <li>Fish</li>
              <li>Birds</li>
            </ul>
          </va-additional-info>
        </div>

        <div className="usa-width-one-whole vads-u-margin-top--3 vads-u-margin-bottom--3">
          <va-button
            class="vads-u-margin-right--1"
            secondary
            onClick={goPrev}
            disabled={current === 1}
            text="Previous step"
          />
          <va-button
            class="vads-u-margin-right--1"
            onClick={goNext}
            disabled={current === total}
            text="Next step"
          />
        </div>

        <HubCardList step={current} />
      </div>
    </div>
  );
};

export default MyCaseManagementHub;
