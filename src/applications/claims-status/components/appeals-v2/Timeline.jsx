import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getEventContent, formatDate } from '../../utils/appeals-v2-helpers';
import Expander from './Expander';
import PastEvent from './PastEvent';

/**
 * Timeline is in charge of the past events.
 */
const Timeline = ({ events, missingEvents }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDateRange = () => {
    if (!events.length) {
      return '';
    }
    const first = formatDate(events[0].date);
    if (events.length === 1) {
      return first;
    }
    const last = formatDate(events[events.length - 1].date);
    return `${first} – ${last}`;
  };

  const toggleExpanded = e => {
    e.stopPropagation();
    setExpanded(prevExpanded => !prevExpanded);
  };

  const pastEventsList = events.length
    ? events
        .map((event, index) => {
          const content = getEventContent(event);
          if (!content) {
            return null;
          }

          const { title, description, liClass } = content;
          const date = formatDate(event.date);
          const hideSeparator = index === events.length - 1;

          return (
            <PastEvent
              key={`past-event-${index}`}
              title={title}
              date={date}
              description={description}
              liClass={liClass}
              hideSeparator={hideSeparator}
            />
          );
        })
        .filter(e => !!e)
    : [];

  const downArrow = expanded ? <div className="down-arrow" /> : null;
  const displayedEvents = expanded ? pastEventsList : [];

  return (
    <div>
      <ol id="appeal-timeline" className="form-process appeal-timeline">
        <Expander
          expanded={expanded}
          key="expander"
          dateRange={formatDateRange()}
          onToggle={toggleExpanded}
          missingEvents={missingEvents}
        />
        {displayedEvents}
      </ol>
      {downArrow}
    </div>
  );
};

Timeline.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      details: PropTypes.object,
    }),
  ).isRequired,
  missingEvents: PropTypes.bool.isRequired,
};

export default Timeline;
