import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class ScoEventsWidget extends React.Component {
  static propTypes = {
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

  displayDate = event => {
    const startDate = moment(event.eventStartDate, 'YYYY-MM-DD').startOf('day');
    const endDate = moment(event.eventEndDate, 'YYYY-MM-DD').startOf('day');

    const spansMonths =
      !!event.eventEndDate && startDate.format('M') !== endDate.format('M');
    const spansYears =
      !!event.eventEndDate && startDate.format('Y') !== endDate.format('Y');

    if (!event.eventEndDate) {
      return `${startDate.format('MMMM D, Y')}`;
    } else if (spansYears) {
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

    return displayStart.isSameOrBefore(today) && today.isBefore(displayEnd);
  };

  renderEvents = () => {
    const scoEvents = this.props.scoEvents
      .filter(this.shouldDisplay)
      .sort(this.eventComparer)
      .map((scoEvent, index) => (
        <li key={index} className="hub-page-link-list__item">
          <a href={scoEvent.url}>
            <b>{`${scoEvent.name} >`}</b>
          </a>
          <br />
          <b>{`${this.displayDate(scoEvent)} — ${scoEvent.location}`}</b>
        </li>
      ));
    return (
      <ul id="get" className="hub-page-link-list">
        {scoEvents}
      </ul>
    );
  };

  render() {
    return (
      <div>
        <h2 id="upcoming-events">Upcoming events</h2>
        {this.renderEvents()}
        <p>
          See full list of{' '}
          <a href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/conferences_and_events.asp">
            Conferences and Events
          </a>{' '}
          |{' '}
          <a href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/presentations.asp">
            Training Webinars
          </a>{' '}
        </p>
      </div>
    );
  }
}
