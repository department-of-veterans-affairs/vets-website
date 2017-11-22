import React from 'react';
import PropTypes from 'prop-types';
import NextEvent from './NextEvent';

class WhatsNext extends React.Component {
  render() {
    const { nextEvents } = this.props;
    const eventsList = nextEvents.map((event, index) => {
      return (
        <NextEvent
          key={event.title}
          title={event.title}
          description={event.description}
          durationText={event.durationText}
          cardDescription={event.cardDescription}
          // show a separator after all events except the last one
          showSeparator={(index !== nextEvents.length - 1)}/>
      );
    });

    return (
      <div>
        <h2>What happens next?</h2>
        <ul className="appeals-next-list">
          {eventsList}
        </ul>
      </div>
    );
  }
}

WhatsNext.propTypes = {
  nextEvents: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    durationText: PropTypes.string.isRequired,
    cardDescription: PropTypes.string.isRequired
  })).isRequired
};

export default WhatsNext;

