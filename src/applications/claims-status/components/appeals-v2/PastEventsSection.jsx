import React from 'react';
import PropTypes from 'prop-types';
import { getEventContent, formatDate } from '../../utils/appeals-v2-helpers';

const PastEventsSection = ({ events, missingEvents }) => {
  const missingEventsAlert = (
    <>
      <div className="alert-demo-text">
        <span>
          Missing Events Alert
          <br />
          Triggered by: Appeal with missing event history (missingEvents=true)
        </span>
      </div>
      <div className="usa-alert usa-alert-warning">
        <div className="usa-alert-body">
          <h4 className="usa-alert-heading">Missing events</h4>
          <p className="usa-alert-text">
            There may be some events missing from this page. If you have
            questions about a past form or VA decision, please contact your VSO
            or representative for more information.
          </p>
        </div>
      </div>
    </>
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
      {missingEvents && missingEventsAlert}
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
