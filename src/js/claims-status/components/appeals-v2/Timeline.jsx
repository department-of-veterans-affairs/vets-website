import React from 'react';
import PropTypes from 'prop-types';
import { getEventContent, formatDate } from '../../utils/appeals-v2-helpers';
import CurrentStatus from './CurrentStatus';
import Expander from './Expander';
import PastEvent from './PastEvent';

/**
 * Timeline is in charge of the past events and current status.
 */
class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  getPastEvents = () => {
    const { events } = this.props;
    if (!events[0]) {
      return [];
    }
    return events.map((event, index) => {
      const { title, description, liClass } = getEventContent(event);
      const date = formatDate(event.date);
      return (
        <PastEvent
          key={`past-event-${index}`}
          title={title}
          date={date}
          description={description}
          liClass={liClass}/>
      );
    });
  };

  formatDateRange = () => {
    const { events } = this.props;
    if (events[0]) {
      const first = formatDate(events[0].date);
      const last = formatDate(events[events.length - 1].date);
      return `${first} - ${last}`;
    }
    return '';
  };

  toggleExpanded = () => this.setState((prevState) => ({ expanded: !prevState.expanded }));

  render() {
    // Add the expander
    let expanderTitle;
    let expanderCssClass;
    if (this.state.expanded) {
      expanderTitle = 'Hide past events';
      expanderCssClass = 'section-expanded';
    } else {
      expanderTitle = 'See past events';
      expanderCssClass = 'section-unexpanded';
    }

    const expander = (
      <Expander
        key={'expander'}
        title={expanderTitle}
        dateRange={this.formatDateRange()}
        onToggle={this.toggleExpanded}
        cssClass={expanderCssClass}/>
    );

    // Add past events
    const pastEvents = this.state.expanded ? this.getPastEvents() : [];

    // Add the current status
    const { title, description } = this.props.currentStatus;
    const currentEvent = (
      <CurrentStatus
        key={'current-event'}
        title={title}
        description={description}/>
    );

    // Combine into unified timeline
    return (
      <div>
        <ol className="form-process appeal-timeline">
          {expander}
          {pastEvents}
          {currentEvent}
        </ol>
        <div className="down-arrow"/>
      </div>
    );
  }
}

Timeline.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    date: PropTypes.string,
    details: PropTypes.object
  })),
  currentStatus: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired
};

export default Timeline;

