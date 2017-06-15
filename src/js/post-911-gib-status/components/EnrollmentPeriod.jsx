import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

import InfoPair from './InfoPair';

import { getScrollOptions } from '../../common/utils/helpers';
import { formatDateShort } from '../utils/helpers';

const scroller = Scroll.scroller;

class EnrollmentPeriod extends React.Component {
  constructor() {
    super();
    this.scrollToEnrollment = this.scrollToEnrollment.bind(this);
    this.toggleHistory = this.toggleHistory.bind(this);
    this.state = { historyExpanded: false };
  }

  scrollToEnrollment() {
    const options = getScrollOptions({ delay: 2 });
    scroller.scrollTo(`collapsible-${this.props.id}`, options);
  }

  toggleHistory() {
    const shouldExpand = !this.state.historyExpanded;
    this.setState({ historyExpanded: !this.state.historyExpanded });
    if (shouldExpand) {
      this.scrollToEnrollment();
    }
  }

  render() {
    const { enrollment, id } = this.props;
    const amendments = enrollment.amendments || [];
    const onCampusHours = <InfoPair label="On-campus Hours" value={enrollment.onCampusHours}/>;
    const onlineHours = <InfoPair label="Online Hours" value={enrollment.onlineHours}/>;

    const changes = this.state.historyExpanded ? (
      <div id={`collapsible-${id}`} className="usa-accordion-content">
        {amendments.map((amendment, index) => {
          return (
            <div key={`amendment-${index}`}>
              {index > 0 ? <hr/> : null}
              <InfoPair label="On-campus Hours" value={amendment.onCampusHours}/>
              <InfoPair label="Online Hours" value={amendment.onlineHours}/>
              <InfoPair label="Type of Change" value={amendment.type}/>
              <InfoPair
                  label="Change Effective Date"
                  value={formatDateShort(amendment.changeEffectiveDate)}/>
            </div>
          );
        })}
      </div>
      ) : null;

    const changeHistory = amendments.length > 0 ? (
      <div className="usa-accordion">
        <ul className="usa-unstyled-list">
          <li>
            <div className="accordion-header clearfix">
              <button
                  className="usa-button-unstyled"
                  aria-expanded={this.state.historyExpanded ? 'true' : 'false'}
                  aria-controls={`collapsible-${id}`}
                  onClick={this.toggleHistory}>
                See Change History
              </button>
            </div>
            {changes}
          </li>
        </ul>
      </div>
    ) : null;

    return (
      <div>
        <hr/>
        <h4>{formatDateShort(enrollment.beginDate)} to {formatDateShort(enrollment.endDate)} at <span className="facility">{(enrollment.facilityName || '').toLowerCase()}</span> ({enrollment.facilityCode})</h4>
        {onCampusHours}
        {onlineHours}
        {changeHistory}
      </div>
    );
  }
}

EnrollmentPeriod.propTypes = {
  id: PropTypes.string,
  enrollment: PropTypes.object
};

export default EnrollmentPeriod;
