import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class ScoEventsWidget extends React.Component {
  displayDate = event => {
    const startDate = moment(event.eventStartDate, 'YYYY-MM-DD').startOf('day');
    const endDate = moment(event.eventEndDate, 'YYYY-MM-DD').startOf('day');

    const spansMonths =
      !!event.eventEndDate && startDate.format('M') !== endDate.format('M');
    const spansYears =
      !!event.eventEndDate && startDate.format('Y') !== endDate.format('Y');

    if (!event.eventEndDate) {
      return `${startDate.format('MMMM D, Y')}`;
    }
    if (spansYears) {
      return `${startDate.format('MMMM D, Y')} - ${endDate.format(
        'MMMM, D Y',
      )}`;
    }
    return spansMonths
      ? `${startDate.format('MMMM D')} - ${endDate.format(
          'MMMM D',
        )}, ${startDate.format('Y')}`
      : `${startDate.format('MMMM D')} - ${endDate.format(
          'D',
        )}, ${startDate.format('Y')}`;
  };

  eventComparer = (eventA, eventB) =>
    moment(eventA.eventStartDate).isBefore(moment(eventB.eventStartDate))
      ? -1
      : 1;

  shouldDisplay = event => {
    const today = moment().startOf('day');
    const startDate = moment(event.eventStartDate, 'YYYY-MM-DD').startOf('day');
    const displayStart = moment(event.displayStartDate, 'YYYY-MM-DD').startOf(
      'day',
    );
    const displayEnd = event.eventEndDate
      ? moment(event.eventEndDate, 'YYYY-MM-DD').startOf('day')
      : moment(startDate).add(1, 'days');

    return (
      event.name &&
      event.url &&
      event.location &&
      event.eventStartDate &&
      event.displayStartDate &&
      displayStart.isSameOrBefore(today) &&
      today.isBefore(displayEnd)
    );
  };

  renderEvents = () => {
    const scoEvents =
      this.props.scoEvents &&
      this.props.scoEvents.filter(this.shouldDisplay).length > 0 ? (
        this.props.scoEvents
          .filter(this.shouldDisplay)
          .sort(this.eventComparer)
          .map((scoEvent, index) => (
            <li key={index} className="hub-page-link-list__item">
              <a href={scoEvent.url} className="no-external-icon">
                <span className="hub-page-link-list__header">
                  {`${scoEvent.name}`}
                </span>
                <img
                  className="all-link-arrow"
                  src="/img/arrow-right-blue.svg"
                  alt="right-arrow"
                />
              </a>
              <br />
              <span style={{ color: '#565c65' }}>
                <b>{`${this.displayDate(scoEvent)} — ${scoEvent.location}`}</b>
              </span>
            </li>
          ))
      ) : (
        <li>
          <p>No new events are available at this time.</p>
        </li>
      );
    return (
      <ul id="get" className="hub-page-link-list">
        {scoEvents}
      </ul>
    );
  };

  render() {
    return (
      <div>
        <h2 id="upcoming-events" tabIndex="-1">
          Upcoming events
        </h2>
        {this.renderEvents()}
        <p className="vads-u-margin-bottom--0">
          See full list of{' '}
          <a href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/conferences_and_events.asp">
            Conferences and events
          </a>{' '}
          |{' '}
          <a href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/presentations.asp">
            Training webinars
          </a>{' '}
        </p>
      </div>
    );
  }
}

ScoEventsWidget.propTypes = {
  scoEvents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      eventStartDate: PropTypes.string.isRequired,
      eventEndDate: PropTypes.string,
      displayStartDate: PropTypes.string.isRequired,
    }),
  ),
};
export default ScoEventsWidget;
