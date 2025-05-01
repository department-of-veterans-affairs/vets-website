import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getEventContent, formatDate } from '../../utils/appeals-v2-helpers';
import Expander from './Expander';
import PastEvent from './PastEvent';

/** Renders the list of past appeal-workflow events. */
const Timeline = ({ events = [], missingEvents = false }) => {
  const [expanded, setExpanded] = useState(false);

  const dateRange = useMemo(
    () => {
      if (!events.length) return '';
      const first = formatDate(events[0].date);
      if (events.length === 1) return first;
      const last = formatDate(events[events.length - 1].date);
      return `${first} – ${last}`;
    },
    [events],
  );

  const toggleExpanded = useCallback(e => {
    e.stopPropagation();
    setExpanded(prev => !prev);
  }, []);

  const pastEvents = useMemo(
    () =>
      events
        .map((event, index) => {
          const content = getEventContent(event);
          if (!content) return null;

          const { title, description, liClass } = content;
          const date = formatDate(event.date);
          const hideSeparator = index === events.length - 1;

          return (
            <PastEvent
              /* eslint-disable-next-line react/no-array-index-key */
              key={`past-event-${index}`}
              title={title}
              date={date}
              description={description}
              liClass={liClass}
              hideSeparator={hideSeparator}
            />
          );
        })
        .filter(Boolean),
    [events],
  );

  return (
    <div>
      <ol id="appeal-timeline" className="form-process appeal-timeline">
        <Expander
          expanded={expanded}
          dateRange={dateRange}
          onToggle={toggleExpanded}
          missingEvents={missingEvents}
        />
        {expanded && pastEvents}
      </ol>
      {expanded && <div className="down-arrow" />}
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
  missingEvents: PropTypes.bool,
};

export default Timeline;
