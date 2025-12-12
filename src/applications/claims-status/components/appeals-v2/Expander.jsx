import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';
import MissingEventsAlert from './MissingEventsAlert';

const Expander = ({ expanded, dateRange, onToggle, missingEvents }) => {
  // Track when alert is displayed
  useEffect(
    () => {
      if (expanded && missingEvents && window.DD_RUM?.getInitConfiguration()) {
        datadogRum.addAction('appeals-missing-events-alert-displayed', {
          component: 'Expander',
          context: 'Timeline',
        });
      }
    },
    [expanded, missingEvents],
  );

  const title = expanded ? 'Hide past events' : 'Reveal past events';
  const cssClass = expanded ? 'section-expanded' : 'section-unexpanded';
  const separator =
    expanded && !missingEvents ? <div className="separator" /> : null;
  const alert = expanded && missingEvents ? <MissingEventsAlert /> : null;

  return (
    <li className={`past-events-expander process-step ${cssClass}`}>
      <va-button
        secondary
        class="view-events-button"
        text={title}
        onClick={onToggle}
      />
      <div className="appeal-event-date vads-u-margin-top--1">{dateRange}</div>
      {alert}
      {separator}
    </li>
  );
};

Expander.propTypes = {
  dateRange: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  missingEvents: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired, // Make sure this does event.stopPropagation()
};

export default Expander;
