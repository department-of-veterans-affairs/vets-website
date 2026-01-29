import React, { useEffect } from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import AssessYourInterestsSection from '../components/AssessYourInterestsSection';
import FindAPathSection from '../components/FindAPathSection';
import FindAJobSection from '../components/FindAJobSection';
import NeedHelp from '../components/NeedHelp';

export default function CareerExplorationAndPlanning() {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const showCareerExplorationAndPlanningPage = useToggleValue(
    TOGGLE_NAMES.vre_eligibility_status_phase_2_updates,
  );

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  if (!showCareerExplorationAndPlanningPage) {
    return (
      <div className="row">
        <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
          <h1>Career Exploration and Planning test</h1>
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
        <h1>Career Exploration and Planning</h1>
        <p className="vads-u-font-size--lg">
          Career options, resources, and tools to help Veterans set and achieve
          your career goals.
        </p>

        <va-card background class="vads-u-padding-top--0">
          <AssessYourInterestsSection />
          <FindAPathSection />
          <FindAJobSection />
        </va-card>

        <NeedHelp />

        <va-back-to-top />
      </article>
    </div>
  );
}
