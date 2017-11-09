import React from 'react';
import PropTypes from 'prop-types';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  getPastEvents() {
    return this.props.events.map((event, index) => (
      <li key={index}>
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
      <li key={eventList.length}>
        <h4><a href="#" onClick={this.toggleExpanded}>{this.state.expanded ? 'Hide past events' : 'Show past events'}</a></h4>
        <span>Date range here</span>
      </li>
    );

    return (
      // May not want this as an ol...
      <ul>{eventList}</ul>
    );
  }
}

History.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    date: PropTypes.string,
    details: PropTypes.object
  }))
};

export default History;

