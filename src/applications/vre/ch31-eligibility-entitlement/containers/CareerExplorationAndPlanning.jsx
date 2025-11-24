import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

export default function CareerExplorationAndPlanning() {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const showCareerExplorationAndPlanningPage = useToggleValue(
    TOGGLE_NAMES.vre_eligibility_status_phase_2_updates,
  );

  if (!showCareerExplorationAndPlanningPage) {
    return (
      <div className="row">
        <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
          <h1>Career Exploration and Planning</h1>
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
          <h2 className="va-nav-linkslist-heading vads-u-margin-top--0 vads-u-margin-bottom--0">
            Career Exploration
          </h2>
          <ul className="va-nav-linkslist-list">
            <li>
              <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                <va-link href="https://www.va.gov" text="Interest Assessment" />
              </h3>
              <p className="va-nav-linkslist-description">
                Learn about your interests and how they apply to different
                career paths.
              </p>
            </li>
            <li>
              <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                <va-link href="https://www.va.gov" text="Explore Careers" />
              </h3>
              <p className="va-nav-linkslist-description">
                Research career options that match your interests.
              </p>
            </li>
          </ul>
        </va-card>

        <va-card background class="vads-u-margin-top--4 vads-u-padding-top--0">
          <h2 className="va-nav-linkslist-heading vads-u-margin-top--0 vads-u-margin-bottom--0">
            Career Planning
          </h2>
          <ul className="va-nav-linkslist-list">
            <li>
              <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                <va-link href="https://www.va.gov" text="Career Planning" />
              </h3>
              <p className="va-nav-linkslist-description">
                Set career goals and create a personalized action plan.
              </p>
            </li>
            <li>
              <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                <va-link
                  href="https://www.va.gov"
                  text="Educational Resources"
                />
              </h3>
              <p className="va-nav-linkslist-description">
                Find information about education and training programs.
              </p>
            </li>
            <li>
              <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
                <va-link href="https://www.va.gov" text="Job Search" />
              </h3>
              <p className="va-nav-linkslist-description">
                Use this link to find available positions that are best suited
                to your interests.
              </p>
            </li>
          </ul>
        </va-card>

        <div className="vads-u-margin-top--4 medium-screen:vads-u-display--inline-block vads-u-display--none">
          <va-button back onClick={() => {}} text="Back to Case Tracker" />
        </div>
      </article>
    </div>
  );
}
