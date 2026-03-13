import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';

const programOverviewCard = {
  title: 'Learn about the VR&E program',
  body: `Read about how Veteran Readiness and Employment (Chapter 31) can help you address education or training needs.`,
  href: 'https://www.va.gov/careers-employment/vocational-rehabilitation',
};

const orientationCard = {
  title: 'Explore VR&E Support-and-Services tracks',
  body:
    'We offer 5 support-and-services tracks to help you get education, training, career planning, and live independently. Explore the different tracks and take charge of your future.',
  href:
    'https://www.va.gov/careers-employment/vocational-rehabilitation/programs/',
};

const getCareerPlanningCard = step => {
  const body = [
    'Explore career resources and tools to help you achieve your employment goals. This page provides links to guide you through your career journey. Find how to assess your interest, to find a career path, and employment.',
  ];

  if (step <= 4) {
    body.push(
      'This will prepare you for your "Initial Evaluation Counselor Meeting."',
    );
  }

  return {
    title: 'Explore Career Planning tools and resources',
    body,
    href: '/career-planning',
    useRouter: true,
  };
};

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
      return isComplete ? [] : [careerPlanningCard];

    case 7:
      return [];

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
              {card.useRouter ? (
                <VaLink
                  active
                  href={card.href}
                  text={card.title}
                  onClick={event => handleRouteChange(event, card.href)}
                />
              ) : (
                <VaLink
                  href={card.href}
                  text={card.title}
                  className=" vads-u-font-weight--bold"
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
