import drop from 'lodash/fp/drop';

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
    this.state = { historyOpen: false };
  }

  scrollToEnrollment() {
    const options = getScrollOptions({ delay: 2 });
    scroller.scrollTo(`collapsible-${this.props.id}`, options);
  }

  toggleHistory() {
    const willOpen = !this.state.historyOpen;
    this.setState({ historyOpen: !this.state.historyOpen });
    if (willOpen) {
      this.scrollToEnrollment();
    }
  }

  render() {
    const { enrollment, id } = this.props;
    const amendments = enrollment.amendments || [];
    const firstAmendment = amendments.length > 0 && amendments[0];

    // TODO: should fullTimeHours be used anywhere?
    // const fullTimeHours = <InfoPair label="Full-time Hours" value={enrollment.fullTimeHours}/>;
    const onCampusHours = <InfoPair label="On-campus Hours" value={enrollment.onCampusHours}/>;
    const onlineHours = <InfoPair label="Online Hours" value={enrollment.onlineHours}/>;
    const typeOfChange = firstAmendment &&
      <InfoPair label="Type of Change" value={firstAmendment.type}/>;
    const changeEffectiveDate = firstAmendment &&
      <InfoPair label="Change Effective Date" value={formatDateShort(firstAmendment.changeEffectiveDate)}/>;

    const moreAmendments = amendments.length > 0 && drop(1, amendments);
    const changeHistory = moreAmendments.length > 0 && (
      <div className="usa-accordion-bordered">
        <ul className="usa-unstyled-list">
          <li>
            <div id={`collapsible-${id}`} className="usa-accordion-content">
            {/* <div id={`collapsible-${id}`} className="accordion-header clearfix"> */}
              <button
                  className="usa-button-unstyled"
                  aria-expanded={this.state.historyOpen ? 'true' : 'false'}
                  aria-controls={`collapsible-${id}`}
                  onClick={this.toggleHistory}>
                See Change History
              </button>
            </div>
           {this.state.historyOpen && moreAmendments.map((amendment, index) => {
             return (
               <span key={`amendment-${this.props.key}-${index}`}>
                 <InfoPair label="On-campus Hours" value={amendment.onCampusHours}/>
                 <InfoPair label="Online Hours" value={amendment.onlineHours}/>
                 <InfoPair label="Type of Change" value={amendment.type}/>
                 <InfoPair
                     label="Change Effective Date"
                     value={formatDateShort(amendment.changeEffectiveDate)}/>
               </span>
             );
           })}
          </li>
        </ul>
      </div>
    );

    return (
      <div>
        <hr/>
        <h4>{formatDateShort(enrollment.beginDate)} to {formatDateShort(enrollment.endDate)} at {enrollment.facilityName} ({enrollment.facilityCode})</h4>
        {onCampusHours}
        {onlineHours}
        {typeOfChange}
        {changeEffectiveDate}
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
