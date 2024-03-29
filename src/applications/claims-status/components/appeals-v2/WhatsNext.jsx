import React from 'react';
import PropTypes from 'prop-types';
import NextEvent from './NextEvent';

const WhatsNext = ({ nextEvents }) => {
  const { header, events } = nextEvents;
  const eventsList = events.map((event, index) => (
    <NextEvent
      key={event.title}
      title={event.title}
      description={event.description}
      // show a separator after all events except the last one
      showSeparator={index !== events.length - 1}
    />
  ));

  return (
    <div>
      <h2>What happens next?</h2>
      <p>{header}</p>
      <ul className="appeals-next-list">{eventsList}</ul>
    </div>
  );
};

WhatsNext.propTypes = {
  nextEvents: PropTypes.shape({
    header: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.element.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default WhatsNext;
