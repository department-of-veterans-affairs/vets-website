import React, { useEffect } from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import AssessYourInterestsAccordionItem from '../components/AssessYourInterestsAccordionItem';
import FindEmploymentAccordionItem from '../components/FindEmploymentAccordionItem';
import FindAPathAccordionItem from '../components/FindAPathAccordionItem';
import NeedHelp from '../components/NeedHelp';

export default function CareerPlanning() {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const showCareerPlanningPage = useToggleValue(
    TOGGLE_NAMES.vre_eligibility_status_phase_2_updates,
  );

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  if (!showCareerPlanningPage) {
    return (
      <div className="row">
        <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
          <h1>Career Planning</h1>
          <p className="vads-u-color--gray-medium">
            This page isn't available right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <article className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
        <h1>Career Planning</h1>
        <p className="vads-u-font-size--lg">
          Explore career resources and tools to help you achieve your employment
          goals.
        </p>

        <va-accordion>
          <AssessYourInterestsAccordionItem />
          <FindAPathAccordionItem />
          <FindEmploymentAccordionItem />
        </va-accordion>

        <NeedHelp />

        <va-back-to-top />
      </article>
    </div>
  );
}
