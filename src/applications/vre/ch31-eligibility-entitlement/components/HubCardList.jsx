import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';

const programOverviewCard = {
  title: 'Program Overview',
  body: `Read about how Veteran Readiness and Employment (Chapter 31) can help you explore employment options and address education or training needs.`,
  href: 'https://www.va.gov/careers-employment/vocational-rehabilitation',
  isExternal: true,
};
const orientationCard = {
  title: 'VR&E Support-and-Services Tracks',
  body: `We offer 5 support-and-services tracks to help you get education or training, find and keep a job, and live as independently as possible. Explore the different tracks and take charge of your future.`,
  href:
    'https://www.va.gov/careers-employment/vocational-rehabilitation/programs',
  isExternal: true,
};

const getCareerPlanningCard = step => {
  const body = [
    `Explore career resources and tools to help you achieve your employment goals. This page provides links to guide you through your career journey, from assessing your interest, to finding a career path, and finding employment.`,
  ];

  // Show the “prepares you for Step 4” line only until you pass step 4
  if (step <= 4) {
    body.push(
      `This will prepare you for your “Initial Evaluation Counselor Meeting” (Step 4 on the Progress Tracker).`,
    );
  }

  return {
    title: 'Career Planning',
    body,
    href: '/career-planning',
  };
};

// const schedulingCard = {
//   title: 'Scheduling',
//   body: `Use this link to schedule or reschedule your Initial Evaluation Counselor Meeting appointment. Follow the on-screen instructions to choose your preferred date and time.`,
//   href: '/my-case-management-hub',
// };

const getCardsForStep = (step, stateList = [], ch31CaseMilestonesState) => {
  const careerPlanningCard = getCareerPlanningCard(step);

  const currentStatus = stateList?.[step - 1]?.status;

  const isComplete =
    currentStatus === 'COMPLETE' || currentStatus === 'COMPLETED';

  const isActive = currentStatus === 'ACTIVE';

  const isPending = currentStatus === 'PENDING';

  const allCards = [programOverviewCard, orientationCard, careerPlanningCard];

  switch (step) {
    case 1:
      return allCards;
    case 2:
      return allCards;
    case 3: {
      if (ch31CaseMilestonesState?.data && !ch31CaseMilestonesState?.error) {
        return allCards;
      }

      return isActive || isPending ? [careerPlanningCard] : allCards;
    }
    case 4:
      return [careerPlanningCard];
    case 5:
      return [careerPlanningCard];
    case 6:
      return isComplete ? [] : [careerPlanningCard]; // show only if NOT complete
    case 7:
      return []; // never show any cards on step 7
    default:
      return [];
  }
};

const HubCardList = ({ step, stateList = [] }) => {
  const history = useHistory();
  const ch31CaseMilestonesState = useSelector(
    state => state?.ch31CaseMilestones,
  );
  const cards = getCardsForStep(step, stateList, ch31CaseMilestonesState);

  if (!cards.length) {
    return null;
  }

  const handleRouteChange = (event, href, isExternal) => {
    event.preventDefault();
    if (isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      history.push(href);
    }
  };

  return (
    <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
      <va-card background icon-name="">
        <h3 className="va-nav-linkslist-heading">
          Preparing for the next steps
        </h3>

        <div>
          {cards.map(card => (
            <div
              key={card.title}
              className="vads-u-margin-top--2 vads-u-padding-bottom--2"
            >
              <VaLink
                active
                href={card.href}
                text={card.title}
                external={card.isExternal}
                onClick={event => {
                  handleRouteChange(event, card.href, card.isExternal);
                }}
              />

              {Array.isArray(card.body) ? (
                card.body.map((text, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'vads-u-margin-top--1 vads-u-margin-bottom--1'
                        : 'vads-u-margin-top--1 vads-u-margin-bottom--0'
                    }
                  >
                    {text}
                  </p>
                ))
              ) : (
                <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
                  {card.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </va-card>
    </div>
  );
};

HubCardList.propTypes = {
  step: PropTypes.number.isRequired,
  stateList: PropTypes.array,
};

export default HubCardList;
