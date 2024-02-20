import React from 'react';
import PropTypes from 'prop-types';

const missingEventsAlert = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <h4 className="usa-alert-heading">Missing events</h4>
      <p className="usa-alert-text">
        There may be some events missing from this page. If you have questions
        about a past form or VA decision, please contact your VSO or
        representative for more information.
      </p>
    </div>
  </div>
);

const Expander = ({ expanded, dateRange, onToggle, missingEvents }) => {
  const title = expanded ? 'Hide past events' : 'Reveal past events';
  const cssClass = expanded ? 'section-expanded' : 'section-unexpanded';
  const separator =
    expanded && !missingEvents ? <div className="separator" /> : null;
  const alert = expanded && missingEvents ? missingEventsAlert : null;

  return (
    <div>
      <va-button secondary text={title} onClick={onToggle} uswds />
      <div className="appeal-event-date vads-u-margin-top--1">{dateRange}</div>
      <li className={`past-events-expander process-step ${cssClass}`}>
        {alert}
        {separator}
      </li>
    </div>
  );
};

Expander.propTypes = {
  dateRange: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  missingEvents: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired, // Make sure this does event.stopPropagation()
};

export default Expander;
