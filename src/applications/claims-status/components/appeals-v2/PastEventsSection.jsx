import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';
import { getEventContent, formatDate } from '../../utils/appeals-v2-helpers';
import MissingEventsAlert from './MissingEventsAlert';

const PastEventsSection = ({ events, missingEvents }) => {
  // Track when alert is displayed
  useEffect(
    () => {
      if (missingEvents && window.DD_RUM?.getInitConfiguration()) {
        datadogRum.addAction('appeals-missing-events-alert-displayed', {
          component: 'PastEventsSection',
          context: 'AppealsV2StatusPage',
          eventsCount: events.length,
        });
      }
    },
    [missingEvents, events.length],
  );
  let pastEventsList = [];
  if (events.length) {
    pastEventsList = events
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((event, index) => {
        const content = getEventContent(event);
        if (!content) {
          return null;
        }

        const { title, description } = content;
        const date = formatDate(event.date);
        return (
          <li
            key={`past-event-${index}`}
            className="vads-u-margin-bottom--2 vads-u-padding-bottom--1"
          >
            <h3 className="vads-u-margin-y--0">{date}</h3>
            <p className="vads-u-margin-y--0">{title}</p>
            <p
              className="item-description vads-u-margin-top--0p5 vads-u-margin-bottom--1"
              data-dd-privacy="mask"
              data-dd-action-name="item description"
            >
              {description}
            </p>
          </li>
        );
      })
      .filter(e => !!e); // Filter out the nulls
  }
  return (
    <div>
      <h2>Past events</h2>
      <ol className="va-list-horizontal appeal-past-events">
        {pastEventsList}
      </ol>
      {missingEvents && <MissingEventsAlert />}
    </div>
  );
};

PastEventsSection.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      details: PropTypes.object,
    }),
  ).isRequired,
  missingEvents: PropTypes.bool.isRequired,
};

export default PastEventsSection;
