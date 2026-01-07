import React from 'react';
import PropTypes from 'prop-types';
import HubCard from './HubCard';

const orientationCard = {
  title: 'Orientation Tools and Resources',
  body: 'Learn about the program and how to get started.',
  icon: 'location_city',
};

const careerPlanningCard = {
  title: 'Career Planning',
  body: 'Learn about the program and how to get started.',
  icon: 'work',
};

const schedulingCard = {
  title: 'Scheduling',
  body: 'Review available options and how to schedule your intake appointment.',
  icon: 'event',
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
  const cards = getCardsForStep(step);

  if (!cards.length) {
    return null;
  }

  return (
    <div className="hub-card-list usa-width-one-whole vads-u-margin-top--3">
      {cards.map(card => (
        <HubCard
          key={card.title}
          title={card.title}
          body={card.body}
          icon={card.icon}
        />
      ))}
    </div>
  );
};

HubCardList.propTypes = {
  step: PropTypes.number.isRequired,
};

export default HubCardList;
