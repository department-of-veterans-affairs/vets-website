import React from 'react';
import PropTypes from 'prop-types';
import NextEvent from './NextEvent';

const WhatsNext = ({ nextEvents }) => {
  const { header, events } = nextEvents;
  const eventsList = events.map((event, index) => {
    return (
      <NextEvent
        key={event.title}
        title={event.title}
        description={event.description}
        durationText={event.durationText}
        cardDescription={event.cardDescription}
        // show a separator after all events except the last one
        showSeparator={(index !== eventsList.length - 1)}/>
    );
  });

  return (
    <div>
      <h2>What happens next?</h2>
      <p>{header}</p>
      <ul className="appeals-next-list">
        {eventsList}
      </ul>
    </div>
  );
};

WhatsNext.propTypes = {
  nextEvents: PropTypes.shape({
    header: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.element.isRequired,
      durationText: PropTypes.string.isRequired,
      cardDescription: PropTypes.string.isRequired
    })).isRequired
  }).isRequired,
};

export default WhatsNext;

