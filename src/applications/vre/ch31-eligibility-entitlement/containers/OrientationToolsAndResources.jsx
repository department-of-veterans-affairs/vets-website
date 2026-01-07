import React, { useState, useEffect } from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import WatchVideoView from '../components/WatchVideoView';
import SelectPreferenceView from '../components/SelectPreferenceView';
import ScheduleMeetingView from '../components/ScheduleMeetingView';
import NeedHelp from '../components/NeedHelp';

const ORIENTATION_TYPE = {
  SCHEDULE_MEETING: 'Schedule a meeting with my local RO',
  WATCH_VIDEO: 'Watch the VA Orientation Video online',
};

export default function OrientationToolsAndResources() {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const [selectedPreference, setSelectedPreference] = useState();

  const showOrientationToolsAndResourcesPage = useToggleValue(
    TOGGLE_NAMES.vre_eligibility_status_phase_2_updates,
  );

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  if (!showOrientationToolsAndResourcesPage) {
    return (
      <div className="row">
        <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
          <h1>Orientation Tools and Resources</h1>
          <p className="vads-u-color--gray-medium">
            This page isn't available right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <article className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
        <h1>Orientation Tools and Resources</h1>
        <p className="vads-u-font-size--lg">
          This page offers all resources to help you getting through the full
          life-cycle of your VR&E Journey. Get familiar with the program, and
          how to use the platform to manage your case.
        </p>

        <va-card background class="vads-u-padding-top--0">
          <h2 className="va-nav-linkslist-heading vads-u-margin-top--0 vads-u-margin-bottom--0">
            Reading Material
          </h2>
          <ul className="va-nav-linkslist-list">
            <li>
              <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                <va-link href="https://www.va.gov" text="Quick Start Guide" />
              </h3>
              <p className="va-nav-linkslist-description">
                More details in here.
              </p>
              <p>
                <va-link
                  download
                  filetype="PDF"
                  href="https://www.va.gov"
                  text="Download Start Guide"
                />
              </p>
            </li>
            <li>
              <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                <va-link href="https://www.va.gov" text="FAQs" />
              </h3>
              <p className="va-nav-linkslist-description">
                More details in here.
              </p>
              <p>
                <va-link
                  download
                  filetype="PDF"
                  href="https://www.va.gov"
                  text="Download FAQs"
                />
              </p>
            </li>
            <li>
              <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                <va-link href="https://www.va.gov" text="Program Overview" />
              </h3>
              <p className="va-nav-linkslist-description">
                More details in here.
              </p>
              <p>
                <va-link
                  download
                  filetype="PDF"
                  href="https://www.va.gov"
                  text="Download Program Overview"
                />
              </p>
            </li>
          </ul>
        </va-card>

        <va-card background class="vads-u-margin-top--4 vads-u-padding-top--0">
          <h2 className="va-nav-linkslist-heading vads-u-margin-top--0 vads-u-margin-bottom--0">
            Orientation Completion
          </h2>
          {!selectedPreference && (
            <SelectPreferenceView
              ORIENTATION_TYPE={ORIENTATION_TYPE}
              setSelectedPreference={setSelectedPreference}
            />
          )}
          {selectedPreference === ORIENTATION_TYPE.WATCH_VIDEO && (
            <WatchVideoView
              setScheduleMeetingView={() =>
                setSelectedPreference(ORIENTATION_TYPE.SCHEDULE_MEETING)
              }
            />
          )}
          {selectedPreference === ORIENTATION_TYPE.SCHEDULE_MEETING && (
            <ScheduleMeetingView
              setWatchVideoView={() =>
                setSelectedPreference(ORIENTATION_TYPE.WATCH_VIDEO)
              }
            />
          )}
        </va-card>

        <NeedHelp />

        <div className="medium-screen:vads-u-display--inline-block vads-u-display--none">
          <va-button back onClick={() => {}} text="Back to Case Tracker" />
        </div>
      </article>
    </div>
  );
}
