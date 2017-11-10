import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

/**
 * Timeline is in charge of the past events and current status.
 * TODO: Add the current status
 */
class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  getPastEvents = () => {
    return this.props.events.map((event, index) => (
      <li key={index} role="presentation" className="process-step section-complete">
        <h3>{event.title}</h3>
        <span>{event.date}</span> {/* Need to format */}
        <p>description here</p>
      </li>
    ));
  }

  toggleExpanded = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const eventList = this.state.expanded ? this.getPastEvents() : [];
    eventList.push(
      <li key={eventList.length} className="process-step section-expand">
        <h4><Link onClick={this.toggleExpanded}>{this.state.expanded ? 'Hide past events' : 'Show past events'}</Link></h4>
        <span>Date range here</span>
      </li>
    );

    return (
      // May not want this as an ol...
      <ol className="process form-process appeal-timeline">{eventList}</ol>
    );
  }
}

Timeline.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    date: PropTypes.string,
    details: PropTypes.object
  }))
};

export default Timeline;

