import React, { useEffect, useState } from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { useHistory } from 'react-router-dom';
import AssessYourInterestsAccordionItem from '../components/AssessYourInterestsAccordionItem';
import FindEmploymentAccordionItem from '../components/FindEmploymentAccordionItem';
import FindAPathAccordionItem from '../components/FindAPathAccordionItem';
import NeedHelp from '../components/NeedHelp';

const MOBILE_BREAKPOINT = 768;

export default function CareerPlanning() {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const history = useHistory();

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <article className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
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

        <div className="medium-screen:vads-u-display--inline-block vads-u-display--none vads-u-margin-top--2">
          <VaButton
            back
            onClick={() => history.push('/my-case-management-hub')}
            text="Back to Case Tracker"
          />
        </div>

        <NeedHelp />

        <va-back-to-top />

        <hr />

        <div className="vads-u-display--flex vads-u-justify-content--flex-end">
          <VaButton fullWidth={isMobile} text="Feedback" />
        </div>
      </article>
    </div>
  );
}
