import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const orientationCard = {
  title: 'Orientation Tools and Resources',
  body: `This page has helpful resources to help you prepare for Step 3 ("Orientation Video" on the Progress Tracker). You'll find reading material such as a Quick Start Guide, FAQs, and a Program Overview. These tools and resources will help you complete Step 3.`,
  icon: 'location_city',
  href: '/orientation-tools-and-resources',
};

const careerPlanningCard = {
  title: 'Career Planning',
  body: `Explore career resources and tools to help you achieve your employment goals. This page provides links to guide you through your career journey, from assessing your interests, to finding a career path, and finding employment. This will prepare you for your Initial Evaluation Counselor Meeting (Step 4 on the Progress Tracker).`,
  icon: 'work',
  href: '/career-exploration-and-planning',
};

const schedulingCard = {
  title: 'Scheduling',
  body: `Use this link to schedule or reschedule your Initial Evaluation Counselor Meeting appointment. Follow the on-screen instructions to choose your preferred date and time.`,
  icon: 'event',
  href: '/my-case-management-hub',
};

const getCardsForStep = step => {
  switch (step) {
    case 1:
    case 2:
    case 3:
      return [orientationCard, careerPlanningCard];
    case 4:
      return [schedulingCard, careerPlanningCard];
    case 5:
    case 6:
    case 7:
      return [careerPlanningCard];
    default:
      return [];
  }
};

const HubCardList = ({ step }) => {
  const history = useHistory();
  const cards = getCardsForStep(step);

  if (!cards.length) {
    return null;
  }

  const handleRouteChange = (event, href) => {
    event.preventDefault();
    history.push(href);
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
                onClick={event => handleRouteChange(event, card.href)}
              />

              <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </va-card>
    </div>
  );
};

HubCardList.propTypes = {
  step: PropTypes.number.isRequired,
};

export default HubCardList;
