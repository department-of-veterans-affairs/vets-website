import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DEFAULT_ANNOUNCEMENT_DAYS_TO_DISPLAY } from './constants/constants';
import recordEvent from 'platform/monitoring/record-event';

export default class ScoAnnouncementsWidget extends React.Component {
  static propTypes = {
    scoEvents: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string,
        date: PropTypes.string.isRequired,
        displayStartDate: PropTypes.string.isRequired,
        displayEndDate: PropTypes.string,
      }),
    ),
  };

  eventComparer = (a, b) => (moment(a.date).isBefore(moment(b.date)) ? 1 : -1);

  recordClickEvent = () => {
    recordEvent({
      event: 'nav-featured-content-link-click',
      'featured-content-header': 'Latest announcement from VA',
    });
  };

  shouldDisplay = announcement => {
    const today = moment().startOf('day');
    const date = moment(announcement.date, 'YYYY-MM-DD').startOf('day');
    const displayStart = moment(
      announcement.displayStartDate,
      'YYYY-MM-DD',
    ).startOf('day');
    const displayEnd = announcement.displayEndDate
      ? moment(announcement.displayEndDate, 'YYYY-MM-DD').startOf('day')
      : moment(date).add(DEFAULT_ANNOUNCEMENT_DAYS_TO_DISPLAY, 'days');

    return (
      announcement.name &&
      announcement.date &&
      announcement.displayStartDate &&
      displayStart.isSameOrBefore(today) &&
      today.isBefore(displayEnd)
    );
  };

  renderAnnouncements = () => {
    const announcements =
      this.props.announcements &&
      this.props.announcements.filter(this.shouldDisplay).length > 0 ? (
        this.props.announcements
          .filter(this.shouldDisplay)
          .sort(this.eventComparer)
          .map((announcement, index) => {
            const displayDate = moment(announcement.date).format('M/D/YYYY');
            const content = `${displayDate} — ${announcement.name}`;
            return (
              <li key={index} className="hub-page-link-list__item">
                {announcement.url ? (
                  <a href={announcement.url} onClick={this.recordClickEvent}>
                    <b>{content}</b>
                  </a>
                ) : (
                  <b>{content}</b>
                )}
              </li>
            );
          })
      ) : (
        <li>
          <p>No new announcements are available at this time.</p>
        </li>
      );

    return <ul className="va-nav-linkslist-list">{announcements}</ul>;
  };

  render() {
    return (
      <div className="field_related_links vads-u-background-color--primary-alt-lightest vads-u-padding--1p5 vads-u-margin-top--6">
        <h3 className="va-nav-linkslist-heading vads-u-padding-top--0">
          Latest announcements from VA
        </h3>
        {this.renderAnnouncements()}
        <p className="vads-u-margin-bottom--0">
          <a
            href="https://www.benefits.va.gov/GIBILL/index.asp#Announcements "
            className="vads-u-text-decoration--none"
          >
            See all announcements...
          </a>
        </p>
      </div>
    );
  }
}
