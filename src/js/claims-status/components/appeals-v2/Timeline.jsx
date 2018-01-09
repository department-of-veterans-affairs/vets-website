import React from 'react';
import PropTypes from 'prop-types';
import { getEventContent, formatDate } from '../../utils/appeals-v2-helpers';
import Expander from './Expander';
import PastEvent from './PastEvent';

/**
 * Timeline is in charge of the past events.
 */
class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  formatDateRange = () => {
    const { events } = this.props;
    if (!events.length) {
      return '';
    }
    const first = formatDate(events[0].date);
    const last = formatDate(events[events.length - 1].date);
    return `${first} - ${last}`;
  };

  toggleExpanded = () => this.setState((prevState) => ({ expanded: !prevState.expanded }));

  render() {
    const { events } = this.props;
    let pastEventsList = [];
    if (events.length) {
      pastEventsList = events.map((event, index) => {
        const { title, description, liClass } = getEventContent(event);
        const date = formatDate(event.date);
        const hideSeparator = (index === events.length - 1);
        return (
          <PastEvent
            key={`past-event-${index}`}
            title={title}
            date={date}
            description={description}
            liClass={liClass}
            hideSeparator={hideSeparator}/>
        );
      });
    }

    let expanderTitle = '';
    let expanderCssClass = '';
    let hideSeparator = false;
    let displayedEvents = [];
    let downArrow;
    if (this.state.expanded) {
      expanderTitle = 'Hide past events';
      expanderCssClass = 'section-expanded';
      hideSeparator = false;
      displayedEvents = pastEventsList;
      downArrow = <div className="down-arrow"/>;
    } else {
      expanderTitle = 'See past events';
      expanderCssClass = 'section-unexpanded';
      hideSeparator = true;
      displayedEvents = [];
      downArrow = null;
    }

    return (
      <div>
        <ol className="form-process appeal-timeline">
          <Expander
            key={'expander'}
            title={expanderTitle}
            dateRange={this.formatDateRange()}
            onToggle={this.toggleExpanded}
            cssClass={expanderCssClass}
            hideSeparator={hideSeparator}/>
          {displayedEvents}
        </ol>
        {downArrow}
      </div>
    );
  }
}

Timeline.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    details: PropTypes.object
  })).isRequired,
};

export default Timeline;
