import React from 'react';

const UpcommingEvents = () => {
  return (
    <div data-widget-type="sco-events">
      <div>
        <h2 id="upcoming-events" tabIndex="-1">
          Upcoming events
        </h2>
        <ul id="get" className="hub-page-link-list">
          <li>
            <p>No new events are available at this time.</p>
          </li>
        </ul>
        <p className="vads-u-margin-bottom--0">
          See full list of{' '}
          <a href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/conferences_and_events.asp">
            Conferences and events
          </a>{' '}
          |{' '}
          <a href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/presentations.asp">
            Training webinars
          </a>
        </p>
      </div>
    </div>
  );
};

export default UpcommingEvents;
