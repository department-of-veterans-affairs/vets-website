import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const programOverviewCard = {
  title: 'Program Overview',
  body:
    'Read about how Veteran Readiness and Employment (Chapter 31) can help you address education or training needs. ',
  href: 'https://www.va.gov/careers-employment/vocational-rehabilitation/',
  isExternal: true,
};

const orientationCard = {
  title: 'VR&E Support-and-Services Tracks',
  body:
    'We offer 5 support-and-services tracks to help you get education, training, career planning, and live independently. Explore the different tracks and take charge of your future.',
  href:
    'https://www.va.gov/careers-employment/vocational-rehabilitation/programs/',
  isExternal: true,
};

const getCareerPlanningCard = step => {
  const body = [
    'Explore career resources and tools to help you achieve your employment goals. This page provides links to guide you through your career journey. Find how to assess your interest, to find a career path, and employment.',
  ];

  if (step <= 4) {
    body.push(
      'This will prepare you for your “Initial Evaluation Counselor Meeting."',
    );
  }

  return {
    title: 'Career Planning',
    body,
    href: '/career-planning',
    isExternal: false,
  };
};

const getCardsForStep = (step, stateList = []) => {
  const careerPlanningCard = getCareerPlanningCard(step);

  const currentStatus = stateList?.[step - 1]?.status;

  const isComplete =
    currentStatus === 'COMPLETE' || currentStatus === 'COMPLETED';

  const isActive = currentStatus === 'ACTIVE';

  switch (step) {
    case 1:
    case 2:
      return [programOverviewCard, orientationCard, careerPlanningCard];

    case 3:
      return isActive || isComplete
        ? [careerPlanningCard]
        : [programOverviewCard, orientationCard, careerPlanningCard];

    case 4:
      return [careerPlanningCard];

    case 5:
      return [careerPlanningCard];

    case 6:
      return isComplete ? [] : [careerPlanningCard];

    case 7:
      return [];

    default:
      return [];
  }
};

const HubCardList = ({ step, stateList = [] }) => {
  const history = useHistory();
  const cards = getCardsForStep(step, stateList);

  if (!cards.length) return null;

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
              {card.isExternal ? (
                <VaLink
                  external
                  href={card.href}
                  text={card.title}
                  className=" vads-u-font-weight--bold"
                />
              ) : (
                <VaLink
                  active
                  href={card.href}
                  text={card.title}
                  onClick={event => handleRouteChange(event, card.href)}
                />
              )}

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
