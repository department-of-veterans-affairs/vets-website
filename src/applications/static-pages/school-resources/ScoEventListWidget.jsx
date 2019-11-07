import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class ScoEventListWidget extends React.Component {
  static propTypes = {
    scoEvents: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['Event', 'Announcement', 'Webinar']).isRequired,
        name: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        eventStartDate: PropTypes.string.isRequired,
        eventEndDate: PropTypes.string,
        displayStartDate: PropTypes.string.isRequired,
        displayEndDate: PropTypes.string,
      }),
    ),
  };

  displayDate = event => {
    const eventMonths = [
      ...new Set([
        moment(event.eventStartDate).format('MMMM'),
        moment(event.eventEndDate).format('MMMM'),
      ]),
    ];
    const eventYears = [
      ...new Set([
        moment(event.eventStartDate).format('Y'),
        moment(event.eventEndDate).format('Y'),
      ]),
    ];

    if (!event.eventEndDate) {
      return `${moment(event.eventStartDate).format('MMMM D, Y')}`;
    } else if (eventYears.length === 2) {
      return `${moment(event.eventStartDate).format('MMMM D Y')} - ${moment(
        event.eventEndDate,
      ).format('MMMM D Y')}`;
    }
    return eventMonths.length === 2
      ? `${moment(event.eventStartDate).format('MMMM D')} - ${moment(
          event.eventEndDate,
        ).format('MMMM D')}, ${eventYears[0]}`
      : `${moment(event.eventStartDate).format('MMMM D')} - ${moment(
          event.eventEndDate,
        ).format('D')}, ${eventYears[0]}`;
  };

  eventComparer = (eventA, eventB) =>
    moment(eventA.eventStartDate).isBefore(moment(eventB.eventStartDate))
      ? -1
      : 1;

  shouldDisplay = event =>
    moment(event.displayStartDate).isBefore(moment()) &&
    ((event.displayEndDate &&
      moment().isBefore(moment(event.displayEndDate))) ||
      moment().isBefore(moment(event.eventStartDate).add(30, 'days')));

  renderEvents = () => {
    const scoEvents = this.props.scoEvents
      .filter(this.shouldDisplay)
      .sort(this.eventComparer)
      .map((scoEvent, index) => (
        <div key={index}>
          <p>
            <a href={scoEvent.url}>
              <b>{`${scoEvent.name} >`}</b>
            </a>
          </p>
          <p>{`${this.displayDate(scoEvent)} – ${scoEvent.location}`}</p>
        </div>
      ));
    return <div>{scoEvents}</div>;
  };

  render() {
    if (!this.props.scoEvents) {
      return null;
    }

    return (
      <div>
        <h2 id="upcoming-events">Upcoming events</h2>
        {this.renderEvents()}
        <p>
          See full list of{' '}
          <a href="http://localhost:3001/education/school-resources/(https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/conferences_and_events.asp">
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
