import React from 'react';
import moment from '../../../../platform/startup/moment-setup';
import LoadFail, { fieldFailureMessage } from './LoadFail';
import LoadingSection from './LoadingSection';

class MilitaryInformation extends React.Component {
  renderContent = () => {
    const {
      serviceHistory: {
        serviceHistory
      }
    } = this.props.militaryInformation;

    if (!serviceHistory || serviceHistory.length === 0) fieldFailureMessage;

    return (
      <div>
        {serviceHistory.map((service, index) => {
          return (
            <div key={index}>
              <h3>{service.branchOfService}</h3>
              <div>{moment(service.beginDate).format('MMM D, YYYY')} &ndash; {moment(service.endDate).format('MMM D, YYYY')}</div>
            </div>
          );
        })}
      </div>
    );
  }
  render() {
    return (
      <div>
        <h2 className="va-profile-heading">Military Service</h2>
        <p>If you need to make any updates or corrections, call the Vets.gov Help Desk at  <a href="tel:+18555747286">1-855-574-7286</a> (TTY: <a href="tel:+18008778339">1-800-877-8339</a>). We're here Monday-Friday, 8 a.m. - 8 p.m. (ET).</p>
        <LoadingSection
          isLoading={!this.props.militaryInformation}
          message="Loading military information..."
          render={this.renderContent}/>
      </div>
    );
  }
}

export default MilitaryInformation;
