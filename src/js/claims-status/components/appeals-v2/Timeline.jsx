import React from 'react';
import PropTypes from 'prop-types';

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
    const expanderClassName = this.state.expanded ? 'section-expanded' : 'section-unexpanded';
    eventList.push(
      <li key={eventList.length} className={`process-step ${expanderClassName}`}>
        {/* Giving this a margin top to help center the text to the li bullet */}
        <button onClick={this.toggleExpanded} className="va-button-link" style={{ marginTop: '-5px' }}>
          <h4>{this.state.expanded ? 'Hide past events' : 'Show past events'}</h4>
        </button>
        <div>Date range here</div>
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

